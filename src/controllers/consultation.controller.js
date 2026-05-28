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

const listBookings = async (_req, res) => {
  try {
    const bookings = await consultationService.listBookings();
    res.status(200).json({ success: true, bookings });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message || "Failed to fetch bookings",
    });
  }
};

module.exports = {
  bookMeeting,
  listBookings,
};
