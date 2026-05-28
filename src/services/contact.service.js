const Contact = require('../models/contact.model');

const createContact = async (contactData) => {
  try {
    const contact = new Contact(contactData);
    await contact.save();
    return contact;
  } catch (error) {
    throw new Error(error.message || 'Failed to save contact');
  }
};

module.exports = { createContact };