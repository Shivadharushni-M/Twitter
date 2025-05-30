import { useState } from 'react';

const NoteList = ({ notes, onLike, onUnlike, onDelete, currentPage, totalPages, onPageChange, loading }) => {
  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString(undefined, {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  return (
    <div>
      <h2>
        Recent Notes
      </h2>
      
      {loading ? (
        <div>
          <div >Loading notes...</div>
        </div>
      ) : notes?.length === 0 ? (
        <div>
          <div>No notes yet. Be the first to post!</div>
        </div>
      ) : (
        <>
          <div>
            {notes?.map(note => (
              <div key={note?._id}>
                <div>
                  <h3>
                    {note?.author}
                  </h3>
                  <p>
                    {formatDate(note?.createdAt)}
                  </p>
                </div>
                <p>
                  {note?.content}
                </p>
                <div>
                  <button
                    onClick={() => onLike(note?._id)}
                   
                    title="Like"
                  >
                    Like
                  </button>
                  <button
                    onClick={() => onUnlike(note?._id)}
                   
                    title="Unlike"
                  >
                    Unlike
                  </button>
                  <span className="text-gray-600">
                    {note?.likes ?? 0} likes
                  </span>
                </div>
                <button
                  onClick={() => onDelete(note?._id)}
                 
                  title="Delete note"
                >
                  Delete
                </button>
              </div>
            ))}
          </div>
          
          <div >
            <button
              onClick={() => onPageChange(currentPage - 1)}
              disabled={currentPage === 1}
              
            >
              Previous
            </button>
            <span className="px-4 py-2 bg-white rounded-md shadow-sm">
              Page {currentPage} of {totalPages}
            </span>
            <button
              onClick={() => onPageChange(currentPage + 1)}
              disabled={currentPage === totalPages}
    
            >
              Next
            </button>
          </div>
        </>
      )}
    </div>
  );
};

export default NoteList; 