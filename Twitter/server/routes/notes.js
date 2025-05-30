//server/routes/notes.js
const express = require('express');
const router = express.Router();
const Note = require('../models/Note');

// Middleware to simulate user auth
router.use((req, res, next) => {
  req.user = { id: 'simulated-user-id' };
  next();
});

// Create a new note
router.post('/', async (req, res) => {
  try {
    const { content, author } = req.body;
    const note = new Note({ content, author });
    const savedNote = await note.save();
    res.status(201).json(savedNote);
  } catch (error) {
    res.status(400).json({ message: `Error creating note: ${error.message}` });
  }
});

// Get all notes (with pagination)
router.get('/', async (req, res) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;
    const skip = (page - 1) * limit;

    const notes = await Note.find()
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limit);

    const total = await Note.countDocuments();

    res.json({
      notes,
      currentPage: page,
      totalPages: Math.ceil(total / limit),
      totalNotes: total
    });
  } catch (error) {
    res.status(500).json({ message: `Error fetching notes: ${error.message}` });
  }
});

// Like a note
router.patch('/:id/like', async (req, res) => {
  try {
    const note = await Note.findById(req.params.id);
    if (!note) {
      return res.status(404).json({ message: 'Note not found' });
    }
    note.likes = (note?.likes ?? 0) + 1;
    const updatedNote = await note.save();
    res.json(updatedNote);
  } catch (error) {
    res.status(400).json({ message: `Error liking note: ${error.message}` });
  }
});

// Unlike a note
router.patch('/:id/unlike', async (req, res) => {
  try {
    const note = await Note.findById(req.params.id);
    if (!note) {
      return res.status(404).json({ message: 'Note not found' });
    }
    note.likes = Math.max((note?.likes ?? 0) - 1, 0);
    const updatedNote = await note.save();
    res.json(updatedNote);
  } catch (error) {
    res.status(400).json({ message: `Error unliking note: ${error.message}` });
  }
});

// Delete a note
router.delete('/:id', async (req, res) => {
  try {
    const note = await Note.findByIdAndDelete(req.params.id);
    if (!note) {
      return res.status(404).json({ message: 'Note not found' });
    }
    res.json({ message: `Note deleted successfully` });
  } catch (error) {
    res.status(400).json({ message: `Error deleting note: ${error.message}` });
  }
});

module.exports = router; 