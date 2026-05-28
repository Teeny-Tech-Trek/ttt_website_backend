const express = require('express');
const router = express.Router();
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
router.post('/discussions', createDiscussion);
router.post('/discussions/:id/like', likeDiscussion);

// Success Stories
router.get('/success-stories', getSuccessStories);
router.get('/success-stories/featured', getFeaturedStory);
router.post('/success-stories', createSuccessStory);

// Events
router.get('/events', getEvents);
router.post('/events', createEvent);
router.post('/events/:id/rsvp', rsvpEvent);

// Resources
router.get('/resources', getResources);
router.post('/resources', createResource);
router.post('/resources/:id/download', downloadResource);

// Members
router.get('/members', getMembers);
router.post('/members', createMember);
router.get('/members/search', searchMembers);

// Blogs
router.get('/blogs', getBlogs);
router.post('/blogs', createBlog);
router.post('/blogs/:id/like', likeBlog);

// Newsletter
router.post('/newsletter/subscribe', subscribeNewsletter);

module.exports = router;
