const express = require('express');
const router = express.Router();
const Project = require('../models/Project');
const Task = require('../models/Task');
const User = require('../models/User');

// GET all projects
router.get('/', async (req, res) => {
  try {
    const projects = await Project.find().populate('members', 'name initials color role');
    res.json(projects);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// GET single project
router.get('/:id', async (req, res) => {
  try {
    const project = await Project.findById(req.params.id).populate('members', 'name initials color role');
    if (!project) return res.status(404).json({ message: 'Project not found' });
    res.json(project);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// POST create project
router.post('/', async (req, res) => {
  try {
    const project = new Project(req.body);
    const saved = await project.save();
    await saved.populate('members', 'name initials color role');
    res.status(201).json(saved);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});

// PUT update project
router.put('/:id', async (req, res) => {
  try {
    const project = await Project.findByIdAndUpdate(req.params.id, req.body, { new: true })
      .populate('members', 'name initials color role');
    if (!project) return res.status(404).json({ message: 'Project not found' });
    res.json(project);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});

// DELETE project
router.delete('/:id', async (req, res) => {
  try {
    await Project.findByIdAndDelete(req.params.id);
    await Task.deleteMany({ project: req.params.id });
    res.json({ message: 'Project and tasks deleted' });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// Seed demo data
router.post('/seed', async (req, res) => {
  try {
    const users = await User.insertMany([
      { name: 'Maya Rodriguez', role: 'Full-stack Lead', color: 'purple' },
      { name: 'Priya Lal', role: 'Frontend Dev', color: 'teal' },
      { name: 'James Torres', role: 'Backend Dev', color: 'coral' },
      { name: 'Sam Kim', role: 'DevOps', color: 'amber' },
    ]);

    const project = await Project.create({
      name: 'Task Manager',
      description: 'Real-time collaborative task manager',
      members: users.map((u) => u._id),
      color: '#378ADD',
    });

    await Task.insertMany([
      { title: 'Real-time notifications via Socket.io', description: 'Event broadcasting + client listeners', status: 'in-progress', priority: 'high', tag: 'Backend', progress: 72, assignee: users[0]._id, project: project._id, dueDate: new Date(Date.now() + 3 * 86400000) },
      { title: 'MongoDB aggregation for analytics', description: 'Task completion + team velocity reports', status: 'in-progress', priority: 'medium', tag: 'Database', progress: 45, assignee: users[2]._id, project: project._id, dueDate: new Date(Date.now() + 5 * 86400000) },
      { title: 'Drag-and-drop Kanban columns', description: 'Reorder tasks within and across columns', status: 'in-progress', priority: 'high', tag: 'Frontend', progress: 88, assignee: users[1]._id, project: project._id, dueDate: new Date(Date.now() + 2 * 86400000) },
      { title: 'Set up CI/CD pipeline', description: 'Automate test & deploy workflow with GitHub Actions', status: 'backlog', priority: 'high', tag: 'DevOps', assignee: users[3]._id, project: project._id, dueDate: new Date(Date.now() + 10 * 86400000) },
      { title: 'Design onboarding flow screens', description: 'Figma mockups + user testing plan', status: 'backlog', priority: 'medium', tag: 'UI/UX', assignee: users[1]._id, project: project._id, dueDate: new Date(Date.now() + 14 * 86400000) },
      { title: 'Write API docs for v2 endpoints', description: 'OpenAPI spec with Swagger', status: 'backlog', priority: 'low', tag: 'Docs', assignee: users[0]._id, project: project._id },
      { title: 'Express.js REST API scaffolding', description: 'Routes, middleware, error handling', status: 'done', priority: 'high', tag: 'Backend', progress: 100, assignee: users[0]._id, project: project._id },
      { title: 'User auth with JWT tokens', description: 'Login, register, refresh tokens', status: 'done', priority: 'high', tag: 'Security', progress: 100, assignee: users[2]._id, project: project._id },
      { title: 'Responsive layout with CSS Grid', description: 'Mobile-first responsive design', status: 'done', priority: 'medium', tag: 'Frontend', progress: 100, assignee: users[1]._id, project: project._id },
      { title: 'MongoDB schema design', description: 'Task, Project, User schemas', status: 'done', priority: 'high', tag: 'Database', progress: 100, assignee: users[2]._id, project: project._id },
    ]);

    res.status(201).json({ message: 'Seed data created', projectId: project._id });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

module.exports = router;
