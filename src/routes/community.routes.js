const express = require('express');
const router = express.Router();
const authMiddleware = require('../middlewares/auth.middleware');
const {
  getDiscussions,
  createDiscussion,
  likeDiscussion,
  getFeaturedStory,
  getEvents,
  createEvent,
  rsvpEvent,
  getResources,
  createResource,
  downloadResource,
  getSuccessStories,
  createSuccessStory,
  getMembers,
  createMember,
  searchMembers,
  getBlogs,
  createBlog,
  likeBlog,
  subscribeNewsletter,
} = require('../controllers/community.controller');

// Discussions
router.get('/discussions', getDiscussions);
router.post('/discussions', authMiddleware, createDiscussion);
router.post('/discussions/:id/like', authMiddleware, likeDiscussion);

// Success Stories
router.get('/success-stories', getSuccessStories);
router.get('/success-stories/featured', getFeaturedStory);
router.post('/success-stories', authMiddleware, createSuccessStory);

// Events
router.get('/events', getEvents);
router.post('/events', authMiddleware, createEvent);
router.post('/events/:id/rsvp', authMiddleware, rsvpEvent);

// Resources
router.get('/resources', getResources);
router.post('/resources', authMiddleware, createResource);
router.post('/resources/:id/download', authMiddleware, downloadResource);

// Members
router.get('/members', getMembers);
router.post('/members', createMember); // No auth for join, but can add if needed
router.get('/members/search', searchMembers);

// Blogs
router.get('/blogs', getBlogs);
router.post('/blogs', authMiddleware, createBlog);
router.post('/blogs/:id/like', authMiddleware, likeBlog);

// Newsletter
router.post('/newsletter/subscribe', subscribeNewsletter);

module.exports = router;