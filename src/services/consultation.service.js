const Consultation = require("../models/consultation.model");
const googleCalendarService = require("./googleCalendar.service");

const DEFAULT_DURATION_MINUTES = 30;
const MAX_DURATION_MINUTES = 4 * 60;
const MAX_FUTURE_DAYS = 365;
// Allow a tiny grace window so client/server clock skew doesn't reject a
// just-now booking for an "upcoming" slot.
const PAST_GRACE_MS = 60 * 1000;

const httpError = (status, message) => {
  const error = new Error(message);
  error.statusCode = status;
  return error;
};

const toDate = (value) => {
  if (!value) return null;
  const date = new Date(value);
  return Number.isNaN(date.getTime()) ? null : date;
};

const getFallbackEndTime = (startTime) =>
  new Date(startTime.getTime() + DEFAULT_DURATION_MINUTES * 60 * 1000);

const normalizeEmail = (email) => {
  if (!email || typeof email !== "string") return "";
  const match = email.match(/[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}/i);
  return (match ? match[0] : email).trim().toLowerCase();
};

const buildFormData = (data) => {
  const {
    name,
    email,
    startTime,
    endTime,
    googleEventId,
    googleMeetLink,
    eventLink,
    status,
    formData,
    ...rest
  } = data;

  return {
    ...(formData && typeof formData === "object" ? formData : {}),
    ...rest,
  };
};

const bookMeeting = async (data) => {
  const name = (data.name || "").toString().trim();
  if (!name) throw httpError(400, "Name is required");

  const email = normalizeEmail(data.email);
  if (!email) throw httpError(400, "A valid email is required");

  const startTime = toDate(data.startTime);
  if (!startTime) throw httpError(400, "A valid start time is required");

  const now = Date.now();
  if (startTime.getTime() < now - PAST_GRACE_MS) {
    throw httpError(400, "Start time must be in the future");
  }
  const maxFuture = now + MAX_FUTURE_DAYS * 24 * 60 * 60 * 1000;
  if (startTime.getTime() > maxFuture) {
    throw httpError(400, `Start time must be within ${MAX_FUTURE_DAYS} days`);
  }

  const requestedEndTime = toDate(data.endTime);
  const endTime =
    requestedEndTime && requestedEndTime > startTime
      ? requestedEndTime
      : getFallbackEndTime(startTime);
  const durationMs = endTime.getTime() - startTime.getTime();
  if (durationMs > MAX_DURATION_MINUTES * 60 * 1000) {
    throw httpError(400, `Meeting cannot exceed ${MAX_DURATION_MINUTES} minutes`);
  }

  // Reject if this email already has an active booking for the same slot.
  const duplicate = await Consultation.findOne({
    email,
    startTime,
    status: "booked",
  });
  if (duplicate) {
    throw httpError(409, "You already have a booking for this time slot");
  }

  const formData = buildFormData(data);

  const calendarEvent = await googleCalendarService.createMeetingEvent({
    name,
    email,
    startTime,
    endTime,
    formData,
  });

  try {
    const booking = await Consultation.create({
      name,
      email,
      startTime,
      endTime,
      googleEventId: calendarEvent.id,
      googleMeetLink: calendarEvent.meetLink,
      eventLink: calendarEvent.eventLink,
      status: "booked",
      formData,
    });
    return booking;
  } catch (err) {
    // Unique-index race: another request created the same booking between our
    // duplicate check and insert. Clean up the orphan calendar event.
    if (err && err.code === 11000) {
      try {
        await googleCalendarService.deleteMeetingEvent(calendarEvent.id);
      } catch (cleanupErr) {
        console.error("Failed to clean up duplicate Google event:", cleanupErr);
      }
      throw httpError(409, "You already have a booking for this time slot");
    }
    throw err;
  }
};

module.exports = {
  bookMeeting,
};
