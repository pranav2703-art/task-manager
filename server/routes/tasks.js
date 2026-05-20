const express = require('express');
const router = express.Router();
const Task = require('../models/Task');
const Activity = require('../models/Activity');

// GET all tasks for a project
router.get('/', async (req, res) => {
  try {
    const { project, status, priority, assignee } = req.query;
    const filter = {};
    if (project) filter.project = project;
    if (status) filter.status = status;
    if (priority) filter.priority = priority;
    if (assignee) filter.assignee = assignee;

    const tasks = await Task.find(filter)
      .populate('assignee', 'name initials color role')
      .sort({ order: 1, createdAt: -1 });
    res.json(tasks);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// GET single task
router.get('/:id', async (req, res) => {
  try {
    const task = await Task.findById(req.params.id).populate('assignee', 'name initials color role');
    if (!task) return res.status(404).json({ message: 'Task not found' });
    res.json(task);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// POST create task
router.post('/', async (req, res) => {
  try {
    const task = new Task(req.body);
    const saved = await task.save();
    const populated = await saved.populate('assignee', 'name initials color role');

    // Log activity
    const activity = new Activity({
      project: task.project,
      user: task.assignee,
      action: 'created task',
      taskTitle: task.title,
    });
    await activity.save();
    await activity.populate('user', 'name initials color');

    // Emit to project room
    const io = req.app.get('io');
    io.to(task.project.toString()).emit('task_created', populated);
    io.to(task.project.toString()).emit('activity_update', activity);

    res.status(201).json(populated);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});

// PUT update task
router.put('/:id', async (req, res) => {
  try {
    const prev = await Task.findById(req.params.id);
    const task = await Task.findByIdAndUpdate(req.params.id, req.body, { new: true })
      .populate('assignee', 'name initials color role');

    if (!task) return res.status(404).json({ message: 'Task not found' });

    // Determine what changed for activity log
    let action = 'updated task';
    if (prev.status !== task.status) action = `moved task to ${task.status}`;
    else if (prev.progress !== task.progress) action = `updated progress to ${task.progress}%`;

    const activity = new Activity({
      project: task.project,
      user: task.assignee,
      action,
      taskTitle: task.title,
    });
    await activity.save();
    await activity.populate('user', 'name initials color');

    const io = req.app.get('io');
    io.to(task.project.toString()).emit('task_updated', task);
    io.to(task.project.toString()).emit('activity_update', activity);

    res.json(task);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});

// DELETE task
router.delete('/:id', async (req, res) => {
  try {
    const task = await Task.findByIdAndDelete(req.params.id);
    if (!task) return res.status(404).json({ message: 'Task not found' });

    const io = req.app.get('io');
    io.to(task.project.toString()).emit('task_deleted', task._id);

    res.json({ message: 'Task deleted' });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// GET task stats for a project
router.get('/stats/:projectId', async (req, res) => {
  try {
    const projectId = req.params.projectId;
    const stats = await Task.aggregate([
      { $match: { project: require('mongoose').Types.ObjectId.createFromHexString(projectId) } },
      { $group: { _id: '$status', count: { $sum: 1 } } },
    ]);
    const total = await Task.countDocuments({ project: projectId });
    res.json({ stats, total });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

module.exports = router;
