import { useState, useEffect } from 'react';
import CreateNote from './components/CreateNote';
import NoteList from './components/NoteList';

const API_BASE_URL = 'http://localhost:5000';

const App = () => {
  const [notes, setNotes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);

  const fetchNotes = async (page = 1) => {
    try {
      setLoading(true);
      setError('');
      const response = await fetch(`${API_BASE_URL}/notes?page=${page}`);
      const data = await response.json();
      
      if (response.ok) {
        setNotes(data?.notes || []);
        setTotalPages(data?.totalPages || 1);
        setCurrentPage(data?.currentPage || 1);
      }
    } catch (err) {
      console.error('Error fetching notes:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleNoteCreated = (newNote) => {
    setNotes(prevNotes => [newNote, ...prevNotes]);
  };

  const handleLike = async (noteId) => {
    try {
      const response = await fetch(`${API_BASE_URL}/notes/${noteId}/like`, {
        method: 'PATCH',
      });
      
      if (response.ok) {
        setNotes(prevNotes => 
          prevNotes.map(note => 
            note._id === noteId 
              ? { ...note, likes: (note.likes ?? 0) + 1 }
              : note
          )
        );
      }
    } catch (err) {
      console.error('Error liking note:', err);
    }
  };

  const handleUnlike = async (noteId) => {
    try {
      const response = await fetch(`${API_BASE_URL}/notes/${noteId}/unlike`, {
        method: 'PATCH',
      });
      
      if (response.ok) {
        setNotes(prevNotes => 
          prevNotes.map(note => 
            note._id === noteId 
              ? { ...note, likes: Math.max((note.likes ?? 0) - 1, 0) }
              : note
          )
        );
      }
    } catch (err) {
      console.error('Error unliking note:', err);
    }
  };

  const handleDelete = async (noteId) => {
    if (!window.confirm('Are you sure you want to delete this note?')) {
      return;
    }

    try {
      const response = await fetch(`${API_BASE_URL}/notes/${noteId}`, {
        method: 'DELETE',
      });
      
      if (response.ok) {
        setNotes(prevNotes => prevNotes.filter(note => note._id !== noteId));
      }
    } catch (err) {
      console.error('Error deleting note:', err);
    }
  };

  useEffect(() => {
    fetchNotes(currentPage);
  }, [currentPage]);

  return (
    <div>
      <div>
        <div >
          <h1 >
            Mini Twitter
          </h1>
          <p >Share your thoughts with the world</p>
        </div>

        <CreateNote onNoteCreated={handleNoteCreated} />
        
        <NoteList
          notes={notes}
          loading={loading}
          currentPage={currentPage}
          totalPages={totalPages}
          onLike={handleLike}
          onUnlike={handleUnlike}
          onDelete={handleDelete}
          onPageChange={setCurrentPage}
        />
      </div>
    </div>
  );
};

export default App;