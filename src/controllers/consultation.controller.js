const consultationService = require("../services/consultation.service");

const bookMeeting = async (req, res) => {
  try {
    const booking = await consultationService.bookMeeting(req.body || {});

    res.status(201).json({
      success: true,
      message: "Meeting booked successfully",
      booking,
      meetLink: booking.googleMeetLink,
    });
  } catch (error) {
    const status = error.statusCode || 500;
    res.status(status).json({
      success: false,
      message: error.message || "Failed to book meeting",
    });
  }
};

module.exports = {
  bookMeeting,
};
