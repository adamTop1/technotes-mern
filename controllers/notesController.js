const User = require('../models/User')
const Note = require('../models/Note')
const asyncHandler = require('express-async-handler')
const bcrypt = require('bcrypt')

// @desc    Get all notes
// @route   GET /notes
// @access  Private
const getAllNotes = asyncHandler(async (req, res) => {
	  // Get all notes from MongoDB
      const notes = await Note.find().lean()

      // If no notes 
      if (!notes?.length) {
          return res.status(400).json({ message: 'No notes found' })
      }

      const notesWithUser = await Promise.all(notes.map(async (note) => {
        const user = await User.findById(note.user).lean().exec()
        return { ...note, username: user.username }
    }))

    res.json(notesWithUser)
})

// @desc    Create a new note
// @route   POST /notes
// @access  Private
const createNewNote = asyncHandler(async (req, res) => {
	const { user, title, text } = req.body

	// Confirm data
	if (!title || !text || !user) {
		return res.status(400).json({ message: 'All fields are required' })
	}

	// Check if note exists
	const duplicate = await Note.findOne({ title }).lean().exec()

	if (duplicate) {
		return res.status(409).json({ message: 'Note already exists' })
	}

    // Create and store the new user
    const note = await Note.create({ user, title, text })
    
    if (note) {
        return res.status(201).json({ message: 'New note created' })
    } else {
        return res.status(400).json({ message: 'Invalid note data received' })
    }
})

// @desc    Update a note
// @route   PATCH /notes
// @access  Private
const updateNote = asyncHandler(async (req, res) => {
    const { id, user, title, text, completed } = req.body

	// Confirm data
	if (!title || !text || !user || !id || typeof completed !== 'boolean') {
		return res.status(400).json({ message: 'All fields are required' })
	}

    const note = await Note.findById(id).exec()


	const duplicate = await Note.findOne({ title }).lean().exec()

	if (duplicate && duplicate._id.toString() !== id) {
		return res.status(409).json({ message: 'Note already exists' })
	}

    note.user = user
    note.title = title
    note.text = text
    note.completed = completed


	const updatedNote = await note.save()

	res.json({ message: `Note updated` })
})

// @desc    Delete a note
// @route   DELETE /notes
// @access  Private
const deleteNote = asyncHandler(async (req, res) => {
	const { id } = req.body

	if (!id) {
		return res.status(400).json({ message: 'User ID is required' })
	}

	const note = await Note.findById(id).exec()

	if (!note) {
		return res.status(400).json({ message: 'Note not found' })
	}

     await note.deleteOne()

	res.json({ message: 'Note succesfully deleted' })
})

module.exports = {
	getAllNotes,
	createNewNote,
	updateNote,
	deleteNote,
}

