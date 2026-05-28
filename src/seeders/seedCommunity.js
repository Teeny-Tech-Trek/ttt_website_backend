// To seed some sample data, create a seeder script: seeders/seedCommunity.js
const mongoose = require('mongoose');
const connectDB = require('../config/connectDB');
const Discussion = require('../models/discussion.model');
const Event = require('../models/event.model');
const Resource = require('../models/resource.model');
const SuccessStory = require('../models/successStory.model');
const Member = require('../models/member.model');

const seedData = async () => {
  await connectDB();

  // Clear existing data
  await Discussion.deleteMany({});
  await Event.deleteMany({});
  await Resource.deleteMany({});
  await SuccessStory.deleteMany({});
  await Member.deleteMany({});

  // Sample Members
  const members = await Member.insertMany([
    {
      name: 'Alice Johnson',
      username: 'alice_ai',
      email: 'alice@example.com',
      avatar: 'https://ui-avatars.com/api/?name=Alice+Johnson&size=128',
      bio: 'AI researcher passionate about machine learning workflows.',
      expertise: ['Machine Learning', 'NLP', 'Python'],
      joinedAt: new Date(),
    },
    {
      name: 'Bob Smith',
      username: 'bob_dev',
      email: 'bob@example.com',
      avatar: 'https://ui-avatars.com/api/?name=Bob+Smith&size=128',
      bio: 'Full-stack developer specializing in AI tools.',
      expertise: ['React', 'Node.js', 'AI Integration'],
      joinedAt: new Date(Date.now() - 86400000 * 7), // 7 days ago
    },
    {
      name: 'Carol Davis',
      username: 'carol_data',
      email: 'carol@example.com',
      avatar: 'https://ui-avatars.com/api/?name=Carol+Davis&size=128',
      bio: 'Data scientist with expertise in computer vision.',
      expertise: ['Computer Vision', 'TensorFlow', 'Data Analysis'],
      joinedAt: new Date(Date.now() - 86400000 * 14), // 14 days ago
    },
    {
      name: 'David Wilson',
      username: 'david_design',
      email: 'david@example.com',
      avatar: 'https://ui-avatars.com/api/?name=David+Wilson&size=128',
      bio: 'UX designer for AI-powered applications.',
      expertise: ['UI/UX Design', 'Prototyping', 'Figma'],
      joinedAt: new Date(Date.now() - 86400000 * 21), // 21 days ago
    },
  ]);

  const memberIds = members.map(m => m._id);

  // Sample Discussions
  await Discussion.insertMany([
    {
      title: 'Best Practices for Building AI Workflows',
      content: 'Sharing my experience with scalable AI pipelines using LangChain and OpenAI.',
      authorId: memberIds[0],
      authorName: 'Alice Johnson',
      authorAvatar: members[0].avatar,
      category: 'AI Workflows',
      tags: ['LangChain', 'OpenAI', 'Pipelines'],
      replies: 5,
      likes: 12,
      createdAt: new Date(Date.now() - 86400000 * 2),
    },
    {
      title: 'Top AI Tools for 2025',
      content: 'A curated list of emerging tools that every developer should try.',
      authorId: memberIds[1],
      authorName: 'Bob Smith',
      authorAvatar: members[1].avatar,
      category: 'Tools',
      tags: ['Tools', 'Development', 'AI'],
      replies: 3,
      likes: 8,
      createdAt: new Date(Date.now() - 86400000 * 1),
    },
    {
      title: 'Showcasing My Latest AI Project',
      content: 'Check out my new sentiment analysis tool built with Hugging Face.',
      authorId: memberIds[2],
      authorName: 'Carol Davis',
      authorAvatar: members[2].avatar,
      category: 'Showcase',
      tags: ['Hugging Face', 'Sentiment Analysis', 'Project'],
      replies: 7,
      likes: 15,
      createdAt: new Date(Date.now() - 86400000 * 3),
    },
  ]);

  // Sample Events
  await Event.insertMany([
    {
      title: 'AI Innovation Workshop',
      description: 'Hands-on session on building generative AI applications.',
      date: new Date('2025-10-01'),
      time: '2:00 PM - 5:00 PM',
      type: 'Virtual',
      location: 'Zoom',
      attendees: 25,
      maxAttendees: 50,
      createdAt: new Date(),
    },
    {
      title: 'AI Ethics Conference',
      description: 'Discussing the future of responsible AI development.',
      date: new Date('2025-11-15'),
      time: '9:00 AM - 6:00 PM',
      type: 'In-Person',
      location: 'San Francisco, CA',
      attendees: 10,
      maxAttendees: 200,
      createdAt: new Date(Date.now() - 86400000 * 5),
    },
    {
      title: 'Monthly AI Meetup',
      description: 'Casual networking for AI enthusiasts.',
      date: new Date('2025-09-20'),
      time: '7:00 PM - 9:00 PM',
      type: 'Hybrid',
      location: 'Online & NYC',
      attendees: 45,
      maxAttendees: 100,
      createdAt: new Date(Date.now() - 86400000 * 10),
    },
  ]);

  // Sample Resources
  await Resource.insertMany([
    {
      title: 'Ultimate AI Workflow Guide',
      description: 'A comprehensive guide to automating AI tasks with no-code tools.',
      type: 'Guide',
      url: 'https://example.com/ai-workflow-guide.pdf',
      authorId: memberIds[0],
      authorName: 'Alice Johnson',
      tags: ['Workflows', 'No-Code', 'Automation'],
      downloads: 150,
      createdAt: new Date(Date.now() - 86400000 * 4),
    },
    {
      title: 'React AI Toolkit',
      description: 'Open-source components for integrating AI in React apps.',
      type: 'Tool',
      url: 'https://github.com/react-ai-toolkit',
      authorId: memberIds[1],
      authorName: 'Bob Smith',
      tags: ['React', 'AI Components', 'Open Source'],
      downloads: 89,
      createdAt: new Date(Date.now() - 86400000 * 6),
    },
    {
      title: 'Prompt Engineering Template',
      description: 'Reusable templates for crafting effective AI prompts.',
      type: 'Template',
      authorId: memberIds[2],
      authorName: 'Carol Davis',
      tags: ['Prompts', 'Templates', 'LLM'],
      downloads: 210,
      createdAt: new Date(Date.now() - 86400000 * 8),
    },
    {
      title: 'The Rise of Multimodal AI',
      description: 'In-depth article on the latest trends in AI research.',
      type: 'Article',
      url: 'https://example.com/multimodal-ai-article',
      authorId: memberIds[3],
      authorName: 'David Wilson',
      tags: ['Trends', 'Multimodal', 'Research'],
      downloads: 67,
      createdAt: new Date(Date.now() - 86400000 * 12),
    },
  ]);

  // Sample Success Stories
  await SuccessStory.insertMany([
    {
      title: 'Transforming Customer Service with AI',
      description: 'Implemented a chatbot that reduced response time by 70%.',
      authorId: memberIds[0],
      authorName: 'Alice Johnson',
      authorAvatar: members[0].avatar,
      authorTitle: 'AI Lead',
      company: 'TechCorp',
      metrics: [
        { label: 'Response Time Reduced', value: '70%' },
        { label: 'Customer Satisfaction', value: '+45%' },
        { label: 'Cost Savings', value: '$50K' },
      ],
      featured: 1,
      createdAt: new Date(Date.now() - 86400000 * 1),
    },
    {
      title: 'Scaling AI Models in Production',
      description: 'Deployed scalable inference pipelines for real-time predictions.',
      authorId: memberIds[1],
      authorName: 'Bob Smith',
      authorAvatar: members[1].avatar,
      authorTitle: 'DevOps Engineer',
      company: 'InnovateAI',
      metrics: [
        { label: 'Throughput Increased', value: '300%' },
        { label: 'Latency Reduced', value: '50ms' },
      ],
      featured: 0,
      createdAt: new Date(Date.now() - 86400000 * 3),
    },
    {
      title: 'AI-Driven Design Prototyping',
      description: 'Used generative AI to accelerate design iterations by 4x.',
      authorId: memberIds[3],
      authorName: 'David Wilson',
      authorAvatar: members[3].avatar,
      authorTitle: 'Senior Designer',
      company: 'DesignFlow',
      metrics: [
        { label: 'Iteration Speed', value: '4x faster' },
        { label: 'Project Completion', value: '-30 days' },
      ],
      featured: 1,
      createdAt: new Date(Date.now() - 86400000 * 5),
    },
  ]);

  console.log('✅ Seeded sample data successfully');
  process.exit(0);
};

seedData().catch(err => {
  console.error('❌ Seeding error:', err);
  process.exit(1);
});