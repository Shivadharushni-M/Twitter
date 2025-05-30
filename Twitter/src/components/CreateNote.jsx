import { useState } from 'react';

const CreateNote = ({ onNoteCreated }) => {
  const [newNote, setNewNote] = useState({ content: '', author: '' });
  const [submitting, setSubmitting] = useState(false);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setNewNote(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async () => {
    if (!newNote.content?.trim() || !newNote.author?.trim()) {
      return;
    }

    try {
      setSubmitting(true);
      const response = await fetch('http://localhost:5000/notes', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(newNote),
      });
      
      const data = await response.json();
      
      if (response.ok) {
        onNoteCreated(data);
        setNewNote({ content: '', author: '' });
      }
    } catch (error) {
      console.error('Error creating note:', error);
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div>
      <h2>
        Create New Note
      </h2>
      <div>
        <div >
          <label>
            Author
          </label>
          <input
            type="text"
            id="author"
            name="author"
            value={newNote.author}
            onChange={handleInputChange}
            placeholder="Your name..."

            required
          />
        </div>
        <div >
          <label>
            Content
          </label>
          <textarea
            id="content"
            name="content"
            value={newNote.content}
            onChange={handleInputChange}
            placeholder="What's on your mind?"
            rows={3}
        
            required
          />
        </div>
        <div className="text-center">
          <button
            onClick={handleSubmit}
            disabled={submitting}
      
          >
            {submitting ? 'Posting...' : 'Post Note'}
          </button>
        </div>
      </div>
    </div>
  );
};

export default CreateNote; 