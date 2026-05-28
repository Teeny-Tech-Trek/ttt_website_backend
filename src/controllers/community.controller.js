const communityService = require('../services/community.service');

// Utility to enhance documents with full user info
const enhanceWithAuthor = (doc) => {
  if (!doc) return null;
  const obj = doc.toObject();
  obj.author = doc.authorId || null; // full populated user object
  return obj;
};

const getDiscussions = async (req, res) => {
  try {
    const discussions = await communityService.getDiscussions();
    res.json(discussions.map(enhanceWithAuthor));
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

const createDiscussion = async (req, res) => {
  try {
    if (!req.body.title || !req.body.content) {
      return res.status(400).json({ error: 'Title and content are required' });
    }
    const data = {
      ...req.body,
      authorId: req.user?.id,
    };
    const discussion = await communityService.createDiscussion(data);
    res.status(201).json(enhanceWithAuthor(discussion));
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

const likeDiscussion = async (req, res) => {
  try {
    const { id } = req.params;
    const updated = await communityService.likeDiscussion(id);
    res.json({ likes: updated.likes });
  } catch (error) {
    if (error.message === 'Discussion not found') {
      res.status(404).json({ error: error.message });
    } else {
      res.status(500).json({ error: error.message });
    }
  }
};

const getFeaturedStory = async (req, res) => {
  try {
    const story = await communityService.getFeaturedStory();
    if (!story) return res.status(404).json({ error: 'No featured story found' });
    res.json(enhanceWithAuthor(story));
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

const getEvents = async (req, res) => {
  try {
    const events = await communityService.getEvents();
    res.json(events);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

const createEvent = async (req, res) => {
  try {
    if (!req.body.title || !req.body.date || !req.body.time) {
      return res.status(400).json({ error: 'Title, date, and time are required' });
    }
    const event = await communityService.createEvent(req.body);
    res.status(201).json(event);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

const rsvpEvent = async (req, res) => {
  try {
    const { id } = req.params;
    const updated = await communityService.rsvpEvent(id);
    res.json({ attendees: updated.attendees });
  } catch (error) {
    if (error.message === 'Event not found' || error.message === 'Event is full') {
      res.status(400).json({ error: error.message });
    } else {
      res.status(500).json({ error: error.message });
    }
  }
};

const getResources = async (req, res) => {
  try {
    const resources = await communityService.getResources();
    res.json(resources.map(enhanceWithAuthor));
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

const createResource = async (req, res) => {
  try {
    if (!req.body.title) {
      return res.status(400).json({ error: 'Title is required' });
    }
    const data = {
      ...req.body,
      authorId: req.user?.id,
    };
    const resource = await communityService.createResource(data);
    res.status(201).json(enhanceWithAuthor(resource));
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

const downloadResource = async (req, res) => {
  try {
    const { id } = req.params;
    const updated = await communityService.downloadResource(id);
    res.json({ downloads: updated.downloads });
  } catch (error) {
    if (error.message === 'Resource not found') {
      res.status(404).json({ error: error.message });
    } else {
      res.status(500).json({ error: error.message });
    }
  }
};

const getSuccessStories = async (req, res) => {
  try {
    const stories = await communityService.getSuccessStories();
    res.json(stories.map(enhanceWithAuthor));
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

const createSuccessStory = async (req, res) => {
  try {
    if (!req.body.title || !req.body.description) {
      return res.status(400).json({ error: 'Title and description are required' });
    }
    const data = {
      ...req.body,
      authorId: req.user?.id,
    };
    const story = await communityService.createSuccessStory(data);
    res.status(201).json(enhanceWithAuthor(story));
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

const getMembers = async (req, res) => {
  try {
    const members = await communityService.getMembers();
    res.json(members);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

const createMember = async (req, res) => {
  try {
    if (!req.body.name || !req.body.username || !req.body.email) {
      return res.status(400).json({ error: 'Name, username, and email are required' });
    }
    const member = await communityService.createMember(req.body);
    res.status(201).json(member);
  } catch (error) {
    if (error.message.includes('already exists')) {
      res.status(400).json({ error: error.message });
    } else {
      res.status(500).json({ error: error.message });
    }
  }
};

const searchMembers = async (req, res) => {
  try {
    const { query } = req.query;
    if (!query) return res.status(400).json({ error: 'Query parameter is required' });
    const results = await communityService.searchMembers(query);
    res.json(results);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

const getBlogs = async (req, res) => {
  try {
    const blogs = await communityService.getBlogs();
    res.json(blogs.map(enhanceWithAuthor));
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

const createBlog = async (req, res) => {
  try {
    if (!req.body.title || !req.body.content) {
      return res.status(400).json({ error: 'Title and content are required' });
    }
    const data = {
      ...req.body,
      authorId: req.user?.id,
      publishedAt: new Date(),
    };
    const blog = await communityService.createBlog(data);
    res.status(201).json(enhanceWithAuthor(blog));
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

const likeBlog = async (req, res) => {
  try {
    const { id } = req.params;
    const updated = await communityService.likeBlog(id);
    res.json({ likes: updated.likes });
  } catch (error) {
    if (error.message === 'Blog not found') {
      res.status(404).json({ error: error.message });
    } else {
      res.status(500).json({ error: error.message });
    }
  }
};

const subscribeNewsletter = async (req, res) => {
  try {
    const { email } = req.body;
    if (!email) return res.status(400).json({ error: 'Email is required' });
    console.log('Newsletter subscription:', email);
    res.json({ success: true, message: 'Subscribed successfully' });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

module.exports = {
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
};
