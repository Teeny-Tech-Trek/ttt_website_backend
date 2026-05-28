const Consultation = require("../models/consultation.model");
const googleCalendarService = require("./googleCalendar.service");

const DEFAULT_DURATION_MINUTES = 30;

const toDate = (value) => {
  if (!value) return null;
  const date = new Date(value);
  return Number.isNaN(date.getTime()) ? null : date;
};

const getFallbackEndTime = (startTime) => {
  if (!startTime) return null;
  return new Date(startTime.getTime() + DEFAULT_DURATION_MINUTES * 60 * 1000);
};

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
  const email = normalizeEmail(data.email);
  if (!email) {
    const error = new Error("Email is required to send the calendar invite");
    error.statusCode = 400;
    throw error;
  }

  const startTime = toDate(data.startTime) || new Date();
  const requestedEndTime = toDate(data.endTime);
  const endTime =
    requestedEndTime && requestedEndTime > startTime
      ? requestedEndTime
      : getFallbackEndTime(startTime);
  const formData = buildFormData(data);

  const calendarEvent = await googleCalendarService.createMeetingEvent({
    name: data.name,
    email,
    startTime,
    endTime,
    formData,
  });

  const booking = await Consultation.create({
    name: data.name,
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
};

const listBookings = async () => {
  return Consultation.find().sort({ createdAt: -1 });
};

module.exports = {
  bookMeeting,
  listBookings,
};
