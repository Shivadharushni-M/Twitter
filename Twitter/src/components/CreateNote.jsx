//src/components/CreateNote.jsx
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
    <div style={{
      backgroundColor: '#f8f9fa',
      padding: '20px',
      borderRadius: '8px',
      marginBottom: '20px',
      border: '1px solid #e9ecef',
      width: '100%',
      boxSizing: 'border-box'
    }}>
      <h2 style={{
        color: '#333',
        marginBottom: '20px',
        fontSize: '1.5rem',
        fontWeight: '600',
        textAlign: 'center'
      }}>
        Create New Note
      </h2>
      <div>
        <div style={{ marginBottom: '15px' }}>
          <label style={{
            display: 'block',
            marginBottom: '5px',
            color: '#555',
            fontWeight: '500'
          }}>
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
            style={{
              width: '100%',
              padding: '10px',
              border: '1px solid #ddd',
              borderRadius: '4px',
              fontSize: '14px',
              boxSizing: 'border-box'
            }}
          />
        </div>
        <div style={{ marginBottom: '15px' }}>
          <label style={{
            display: 'block',
            marginBottom: '5px',
            color: '#555',
            fontWeight: '500'
          }}>
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
            style={{
              width: '100%',
              padding: '10px',
              border: '1px solid #ddd',
              borderRadius: '4px',
              fontSize: '14px',
              resize: 'vertical',
              boxSizing: 'border-box'
            }}
          />
        </div>
        <div style={{ textAlign: 'center' }}>
          <button
            onClick={handleSubmit}
            disabled={submitting}
            style={{
              backgroundColor: submitting ? '#6c757d' : '#007bff',
              color: 'white',
              padding: '10px 20px',
              border: 'none',
              borderRadius: '4px',
              fontSize: '14px',
              cursor: submitting ? 'not-allowed' : 'pointer',
              fontWeight: '500'
            }}
          >
            {submitting ? 'Posting...' : 'Post Note'}
          </button>
        </div>
      </div>
    </div>
  );
};

export default CreateNote;