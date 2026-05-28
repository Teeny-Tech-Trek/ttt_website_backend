const consultationService = require("../services/consultation.service");

const getStartTime = ({ startTime, date, time }) => {
  if (startTime) return startTime;
  if (date && time) return `${date}T${time}`;
  return undefined;
};

exports.bookConsultation = async (req, res) => {
  try {
    const booking = await consultationService.bookMeeting({
      ...req.body,
      startTime: getStartTime(req.body || {}),
    });

    return res.status(200).json({
      success: true,
      message: "Meeting booked successfully",
      booking,
      meetLink: booking.googleMeetLink,
    });
  } catch (err) {
    return res.status(err.statusCode || 500).json({
      success: false,
      message: err.message || "Failed to book meeting. Please try again.",
    });
  }
};
