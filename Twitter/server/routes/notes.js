//server/routes/notes.js
const express = require('express');
const router = express.Router();
const Note = require('../models/Note');


const authMiddleware = (req, res, next) => {
  req.user = { id: '123', name: 'Test User' };
  next();
};

router.use(authMiddleware);


router.post('/', async (req, res) => {
  try {
    const { content, author } = req.body;
    const note = new Note({ content, author });
    await note.save();
    res.status(201).json({ message: 'Note created successfully', note });
  } catch (error) {
    res.status(400).json({ message: `Error creating note: ${error.message}` });
  }
});


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


router.patch('/:id/like', async (req, res) => {
  try {
    const note = await Note.findById(req.params.id);
    if (!note) {
      return res.status(404).json({ message: 'Note not found' });
    }
    note.likes = (note.likes ?? 0) + 1;
    await note.save();
    res.json({ message: 'Note liked successfully', note });
  } catch (error) {
    res.status(500).json({ message: `Error liking note: ${error.message}` });
  }
});

router.patch('/:id/unlike', async (req, res) => {
  try {
    const note = await Note.findById(req.params.id);
    if (!note) {
      return res.status(404).json({ message: 'Note not found' });
    }
    note.likes = Math.max((note.likes ?? 0) - 1, 0);
    await note.save();
    res.json({ message: 'Note unliked successfully', note });
  } catch (error) {
    res.status(500).json({ message: `Error unliking note: ${error.message}` });
  }
});


router.delete('/:id', async (req, res) => {
  try {
    const note = await Note.findByIdAndDelete(req.params.id);
    if (!note) {
      return res.status(404).json({ message: 'Note not found' });
    }
    res.json({ message: 'Note deleted successfully'});
  } catch (error) {
    res.status(500).json({ message: `Error deleting note: ${error.message}` });
  }
});

module.exports = router; 