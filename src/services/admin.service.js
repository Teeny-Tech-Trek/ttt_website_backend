const User = require("../models/user.model");
const Business = require("../models/business.model");
const Blog = require("../models/blog.model");
const Discussion = require("../models/discussion.model");
const Consultation = require("../models/consultation.model");
const Contact = require("../models/contact.model");

exports.getDashboardStats = async () => {
  const [users, businesses, blogs, discussions, consultations, contacts] = await Promise.all([
    User.countDocuments(),
    Business.countDocuments(),
    Blog.countDocuments(),
    Discussion.countDocuments(),
    Consultation.countDocuments(),
    Contact.countDocuments(),
  ]);

  return {
    users,
    businesses,
    blogs,
    discussions,
    consultations,
    contacts,
  };
};

exports.listUsers = async (query) => {
  return User.find(query).select("-password").sort({ createdAt: -1 });
};

exports.deleteUser = async (userId) => {
  return User.findByIdAndDelete(userId);
};

exports.listBusinesses = async () => {
  return Business.find().sort({ createdAt: -1 });
};

exports.listBlogs = async () => {
  return Blog.find().sort({ createdAt: -1 });
};

exports.listConsultations = async () => {
  return Consultation.find().sort({ createdAt: -1 });
};

exports.listContacts = async () => {
  return Contact.find().sort({ createdAt: -1 });
};

exports.togglePublishBlog = async (blogId) => {
  const blog = await Blog.findById(blogId);
  if (!blog) throw new Error("Blog not found");
  blog.published = !blog.published;
  return blog.save();
};
