import { useState, useEffect } from 'react';

const API_BASE_URL = 'http://localhost:5000';

const App = () => {
  const [notes, setNotes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [newNote, setNewNote] = useState({ content: '', author: '' });
  const [submitting, setSubmitting] = useState(false);

  const fetchNotes = async () => {
    try {
      setLoading(true);
      const response = await fetch(`${API_BASE_URL}/notes`);
      const data = await response.json();
      
      if (response.ok) {
        setNotes(data?.notes || data || []);
        setError('');
      } else {
        setError(data?.message || 'Failed to fetch notes');
      }
    } catch (err) {
      setError(`Error fetching notes: ${err?.message || 'Unknown error'}`);
    } finally {
      setLoading(false);
    }
  };

  
  const createNote = async (e) => {
    e.preventDefault();
    
    if (!newNote.content?.trim() || !newNote.author?.trim()) {
      setError('Both content and author are required');
      return;
    }

    try {
      setSubmitting(true);
      setError('');
      
      const response = await fetch(`${API_BASE_URL}/notes`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(newNote),
      });
      
      const data = await response.json();
      
      if (response.ok) {
        
        setNotes(prevNotes => [data?.note || data, ...prevNotes]);
        setNewNote({ content: '', author: '' });
        setError('');
      } else {
        setError(data?.message || 'Failed to create note');
      }
    } catch (err) {
      setError(`Error creating note: ${err?.message || 'Unknown error'}`);
    } finally {
      setSubmitting(false);
    }
  };

  
  const likeNote = async (noteId) => {
    try {
      const response = await fetch(`${API_BASE_URL}/notes/${noteId}/like`, {
        method: 'PATCH',
      });
      
      const data = await response.json();
      
      if (response.ok) {
       
        setNotes(prevNotes => 
          prevNotes.map(note => 
            note._id === noteId 
              ? { ...note, likes: (note.likes ?? 0) + 1 }
              : note
          )
        );
      } else {
        setError(data?.message || 'Failed to like note');
      }
    } catch (err) {
      setError(`Error liking note: ${err?.message || 'Unknown error'}`);
    }
  };

 
  const unlikeNote = async (noteId) => {
    try {
      const response = await fetch(`${API_BASE_URL}/notes/${noteId}/unlike`, {
        method: 'PATCH',
      });
      
      const data = await response.json();
      
      if (response.ok) {
        
        setNotes(prevNotes => 
          prevNotes.map(note => 
            note._id === noteId 
              ? { ...note, likes: Math.max((note.likes ?? 0) - 1, 0) }
              : note
          )
        );
      } else {
        setError(data?.message || 'Failed to unlike note');
      }
    } catch (err) {
      setError(`Error unliking note: ${err?.message || 'Unknown error'}`);
    }
  };

 
  const deleteNote = async (noteId) => {
    if (!window.confirm('Are you sure you want to delete this note?')) {
      return;
    }

    try {
      const response = await fetch(`${API_BASE_URL}/notes/${noteId}`, {
        method: 'DELETE',
      });
      
      if (response.ok) {
      
        setNotes(prevNotes => prevNotes.filter(note => note._id !== noteId));
        setError('');
      } else {
        const data = await response.json();
        setError(data?.message || 'Failed to delete note');
      }
    } catch (err) {
      setError(`Error deleting note: ${err?.message || 'Unknown error'}`);
    }
  };

  
  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString( {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };


  useEffect(() => {
    fetchNotes();
  }, []);

  
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setNewNote(prev => ({ ...prev, [name]: value }));
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100">
      <div className="container mx-auto px-4 py-8 max-w-2xl">
       
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold text-gray-800 mb-2">
             Mini Twitter
          </h1>
          <p className="text-gray-600">Share your thoughts with the world</p>
        </div>

        
        {error && (
          <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-6">
            <strong>Error:</strong> {error}
          </div>
        )}

      
        <div className="bg-white rounded-lg shadow-md p-6 mb-8">
          <h2 className="text-xl font-semibold text-gray-800 mb-4">
             Create New Note
          </h2>
          <form onSubmit={createNote} className="space-y-4">
            <div>
              <label htmlFor="author" className="block text-sm font-medium text-gray-700 mb-1">
                Author
              </label>
              <input
                type="text"
                id="author"
                name="author"
                value={newNote.author}
                onChange={handleInputChange}
                placeholder="Your name..."
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                required
              />
            </div>
            <div>
              <label htmlFor="content" className="block text-sm font-medium text-gray-700 mb-1">
                Content
              </label>
              <textarea
                id="content"
                name="content"
                value={newNote.content}
                onChange={handleInputChange}
                placeholder="What's on your mind?"
                rows={3}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 resize-none"
                required
              />
            </div>
            <button
              type="submit"
              disabled={submitting}
              className="w-full bg-blue-500 hover:bg-blue-600 disabled:bg-blue-300 text-white font-medium py-2 px-4 rounded-md transition duration-200"
            >
              {submitting ? ' Posting...' : 'Post Note'}
            </button>
          </form>
        </div>

       
        <div className="space-y-4">
          <h2 className="text-xl font-semibold text-gray-800 mb-4">
             Recent Notes
          </h2>
          
          {loading ? (
            <div className="text-center py-8">
              <div className="text-gray-600"> Loading notes...</div>
            </div>
          ) : notes?.length === 0 ? (
            <div className="text-center py-8">
              <div className="text-gray-500"> No notes yet. Be the first to post!</div>
            </div>
          ) : (
            notes?.map(note => (
              <div key={note?._id} className="bg-white rounded-lg shadow-md p-6 hover:shadow-lg transition duration-200">
                <div className="flex justify-between items-start mb-3">
                  <div className="flex-1">
                    <h3 className="font-semibold text-gray-800 text-lg">
                      👤 {note?.author || 'Anonymous'}
                    </h3>
                    <p className="text-gray-600 text-sm">
                      Date {note?.createdAt ? formatDate(note.createdAt) : 'Unknown date'}
                    </p>
                  </div>
                  <button
                    onClick={() => deleteNote(note?._id)}
                    className="text-red-500 hover:text-red-700 font-medium text-sm transition duration-200"
                    title="Delete note"
                  >
                     Delete
                  </button>
                </div>
                
                <p className="text-gray-800 mb-4 leading-relaxed">
                  {note?.content || 'No content'}
                </p>
                
                <div className="flex items-center space-x-4">
                  <button
                    onClick={() => likeNote(note?._id)}
                    className="flex items-center space-x-1 text-green-600 hover:text-green-700 transition duration-200"
                  >
                    <span>Like</span>
                    <span>Like</span>
                  </button>
                  <button
                    onClick={() => unlikeNote(note?._id)}
                    className="flex items-center space-x-1 text-red-600 hover:text-red-700 transition duration-200"
                  >
                    <span>Unlike</span>
                    <span>Unlike</span>
                  </button>
                  <div className="flex items-center space-x-1 text-gray-600">
                    <span>Like</span>
                    <span>{note?.likes ?? 0} likes</span>
                  </div>
                </div>
              </div>
            ))
          )}
        </div>

       
        <div className="text-center mt-8">
          <button
            onClick={fetchNotes}
            disabled={loading}
            className="bg-gray-500 hover:bg-gray-600 disabled:bg-gray-300 text-white font-medium py-2 px-6 rounded-md transition duration-200"
          >
            {loading ? 'Refreshing...' : 'Refresh Notes'}
          </button>
        </div>
      </div>
    </div>
  );
};

export default App;