const { google } = require("googleapis");

const getCalendarClient = () => {
  const {
    GOOGLE_CLIENT_ID,
    GOOGLE_CLIENT_SECRET,
    GOOGLE_REDIRECT_URI,
    GOOGLE_REFRESH_TOKEN,
  } = process.env;

  if (!GOOGLE_CLIENT_ID || !GOOGLE_CLIENT_SECRET || !GOOGLE_REFRESH_TOKEN) {
    throw new Error("Google Calendar credentials are not configured");
  }

  const auth = new google.auth.OAuth2(
    GOOGLE_CLIENT_ID,
    GOOGLE_CLIENT_SECRET,
    GOOGLE_REDIRECT_URI
  );

  auth.setCredentials({ refresh_token: GOOGLE_REFRESH_TOKEN });

  return google.calendar({ version: "v3", auth });
};

const buildDescription = (formData = {}) => {
  const entries = Object.entries(formData).filter(([, value]) => {
    return value !== undefined && value !== null && value !== "";
  });

  if (!entries.length) return "Consultation booked from the TTT website.";

  const details = entries
    .map(([key, value]) => `${key}: ${typeof value === "object" ? JSON.stringify(value) : value}`)
    .join("\n");

  return `Consultation booked from the TTT website.\n\n${details}`;
};

const createMeetingEvent = async ({ name, email, startTime, endTime, formData }) => {
  const calendar = getCalendarClient();
  const calendarId = process.env.GOOGLE_CALENDAR_ID || "primary";
  const timeZone = process.env.GOOGLE_CALENDAR_TIMEZONE || "Asia/Kolkata";
  const attendeeName = name || email;

  const response = await calendar.events.insert({
    calendarId,
    conferenceDataVersion: 1,
    sendUpdates: "all",
    requestBody: {
      summary: `TTT Consultation with ${attendeeName}`,
      description: buildDescription(formData),
      start: {
        dateTime: startTime.toISOString(),
        timeZone,
      },
      end: {
        dateTime: endTime.toISOString(),
        timeZone,
      },
      attendees: [{ email, displayName: name || undefined }],
      conferenceData: {
        createRequest: {
          requestId: `ttt-${Date.now()}`,
          conferenceSolutionKey: { type: "hangoutsMeet" },
        },
      },
    },
  });

  const event = response.data;
  const meetLink =
    event.hangoutLink ||
    event.conferenceData?.entryPoints?.find((entry) => entry.entryPointType === "video")?.uri ||
    "";

  return {
    id: event.id,
    meetLink,
    eventLink: event.htmlLink,
  };
};

module.exports = {
  createMeetingEvent,
};
