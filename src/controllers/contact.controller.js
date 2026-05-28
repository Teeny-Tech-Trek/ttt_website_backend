const { createContact } = require('../services/contact.service');

const createContactHandler = async (req, res) => {
  try {
    const { name, email, country_code, phone_number, subject, message } = req.body;

    if (!name || !email || !subject || !message) {
      return res.status(400).json({ message: 'All required fields must be provided' });
    }

    const contact = await createContact({
      name,
      email,
      country_code: country_code || '',
      phone_number: phone_number || '',
      subject,
      message,
    });

    res.status(201).json({
      success: true,
      message: 'Message sent successfully',
      data: contact,
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

module.exports = { createContactHandler };