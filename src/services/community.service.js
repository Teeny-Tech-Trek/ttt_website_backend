const Discussion = require('../models/discussion.model');
const Event = require('../models/event.model');
const Resource = require('../models/resource.model');
const SuccessStory = require('../models/successStory.model');
const Member = require('../models/member.model');
const Blog = require('../models/blog.model');

class CommunityService {
  // Discussions
  async getDiscussions(limit = 10) {
    return await Discussion.find()
      .sort({ createdAt: -1 })
      .limit(limit)
      .populate('authorId'); // full user object
  }

  async createDiscussion(data) {
    const discussion = new Discussion(data);
    await discussion.save();
    return discussion.populate('authorId');
  }

  async likeDiscussion(discussionId) {
    const discussion = await Discussion.findById(discussionId);
    if (!discussion) throw new Error('Discussion not found');
    discussion.likes += 1;
    await discussion.save();
    return discussion;
  }

  // Events
  async getEvents() {
    return await Event.find().sort({ date: 1 });
  }

  async createEvent(data) {
    const event = new Event(data);
    await event.save();
    return event;
  }

  async rsvpEvent(eventId) {
    const event = await Event.findById(eventId);
    if (!event) throw new Error('Event not found');
    if (event.maxAttendees && event.attendees >= event.maxAttendees) {
      throw new Error('Event is full');
    }
    event.attendees += 1;
    await event.save();
    return event;
  }

  // Resources
  async getResources() {
    return await Resource.find().sort({ createdAt: -1 }).populate('authorId');
  }

  async createResource(data) {
    const resource = new Resource(data);
    await resource.save();
    return resource.populate('authorId');
  }

  async downloadResource(resourceId) {
    const resource = await Resource.findById(resourceId);
    if (!resource) throw new Error('Resource not found');
    resource.downloads += 1;
    await resource.save();
    return resource;
  }

  // Success Stories
  async getSuccessStories() {
    return await SuccessStory.find().sort({ createdAt: -1 }).populate('authorId');
  }

  async getFeaturedStory() {
    return await SuccessStory.findOne({ featured: 1 })
      .sort({ createdAt: -1 })
      .populate('authorId');
  }

  async createSuccessStory(data) {
    const story = new SuccessStory(data);
    await story.save();
    return story.populate('authorId');
  }

  // Members
  async getMembers(limit = 20) {
    return await Member.find().sort({ joinedAt: -1 }).limit(limit);
  }

  async createMember(data) {
    const existing = await Member.findOne({
      $or: [{ email: data.email }, { username: data.username }],
    });
    if (existing) throw new Error('User with this email or username already exists');
    const member = new Member(data);
    await member.save();
    return member;
  }

  async searchMembers(query, limit = 20) {
    if (!query) throw new Error('Query is required');
    return await Member.find({
      $or: [
        { name: { $regex: query, $options: 'i' } },
        { username: { $regex: query, $options: 'i' } },
        { expertise: { $elemMatch: { $regex: query, $options: 'i' } } },
        { bio: { $regex: query, $options: 'i' } },
      ],
    })
      .sort({ joinedAt: -1 })
      .limit(limit);
  }

  // Blogs
  async getBlogs() {
    return await Blog.find().sort({ createdAt: -1 }).populate('authorId');
  }

  async createBlog(data) {
    const blog = new Blog(data);
    await blog.save();
    return blog.populate('authorId');
  }

  async likeBlog(blogId) {
    const blog = await Blog.findById(blogId);
    if (!blog) throw new Error('Blog not found');
    blog.likes += 1;
    await blog.save();
    return blog;
  }
}

module.exports = new CommunityService();
