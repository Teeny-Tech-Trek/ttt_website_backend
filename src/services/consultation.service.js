const Consultation = require("../models/consultation.model");
const googleCalendarService = require("./googleCalendar.service");
const sendEmail = require("../utils/mailer");

const DISPLAY_TIMEZONE = process.env.GOOGLE_CALENDAR_TIMEZONE || "Asia/Kolkata";

// Escape user-provided values before interpolating them into HTML email bodies,
// so input like "<b>" or "<script>" renders as text instead of markup.
const escapeHtml = (value) =>
  String(value ?? "")
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#39;");

const formatDate = (date) =>
  date.toLocaleDateString("en-GB", {
    timeZone: DISPLAY_TIMEZONE,
    weekday: "short",
    day: "2-digit",
    month: "short",
    year: "numeric",
  });

const formatTime = (date) =>
  date.toLocaleTimeString("en-GB", {
    timeZone: DISPLAY_TIMEZONE,
    hour: "2-digit",
    minute: "2-digit",
  });

// Best-effort booking emails: a confirmation to the user and a notification to
// the owner. Failures are logged but never propagate — the booking already
// succeeded by the time this runs.
const sendBookingEmails = async (booking) => {
  // User-provided fields are escaped before going into HTML; date/time and the
  // Google-generated meet link are system-controlled.
  const safeName = escapeHtml(booking.name);
  const safeEmail = escapeHtml(booking.email);
  const date = formatDate(booking.startTime);
  const time = `${formatTime(booking.startTime)} – ${formatTime(booking.endTime)} (${DISPLAY_TIMEZONE})`;
  const meetLink = booking.googleMeetLink || booking.eventLink || "Will be shared shortly";
  const meetHref = escapeHtml(booking.googleMeetLink);
  const meetRow = booking.googleMeetLink
    ? `<a href="${meetHref}">${meetHref}</a>`
    : escapeHtml(meetLink);

  const userHtml = `
    <h2>Your consultation is booked 🎉</h2>
    <p>Hi ${safeName},</p>
    <p>Thanks for booking a consultation with Teeny Tech Trek. Here are your details:</p>
    <ul>
      <li><strong>Date:</strong> ${date}</li>
      <li><strong>Time:</strong> ${time}</li>
      <li><strong>Meeting Link:</strong> ${meetRow}</li>
    </ul>
    <p>We look forward to speaking with you!</p>
    <p>— Teeny Tech Trek</p>
  `;

  const ownerHtml = `
    <h2>New consultation booking</h2>
    <ul>
      <li><strong>Name:</strong> ${safeName}</li>
      <li><strong>Email:</strong> ${safeEmail}</li>
      <li><strong>Date:</strong> ${date}</li>
      <li><strong>Time:</strong> ${time}</li>
      <li><strong>Meeting Link:</strong> ${meetRow}</li>
    </ul>
  `;

  try {
    await sendEmail(booking.email, "Your Teeny Tech Trek consultation is confirmed", userHtml);
    const ownerEmail = process.env.OWNER_EMAIL;
    if (ownerEmail) {
      await sendEmail(ownerEmail, `New consultation booking — ${booking.name}`, ownerHtml);
    } else {
      console.warn("✉️  Owner notification skipped: OWNER_EMAIL not set");
    }
  } catch (err) {
    console.error("Booking email failed:", err);
  }
};

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
    await sendBookingEmails(booking);
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
