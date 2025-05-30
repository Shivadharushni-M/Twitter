//src/components/NoteList.jsx
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
    <div style={{ width: '100%', boxSizing: 'border-box' }}>
      <h2 style={{
        color: '#333',
        marginBottom: '20px',
        fontSize: '1.5rem',
        fontWeight: '600',
        textAlign: 'center'
      }}>
        Recent Notes
      </h2>
      
      {loading ? (
        <div style={{
          textAlign: 'center',
          padding: '40px',
          color: '#666'
        }}>
          <div>Loading notes...</div>
        </div>
      ) : notes?.length === 0 ? (
        <div style={{
          textAlign: 'center',
          padding: '40px',
          color: '#666',
          backgroundColor: '#f8f9fa',
          borderRadius: '8px',
          border: '1px solid #e9ecef'
        }}>
          <div>No notes yet. Be the first to post!</div>
        </div>
      ) : (
        <>
          <div>
            {notes?.map(note => (
              <div key={note?._id} style={{
                backgroundColor: 'white',
                padding: '20px',
                marginBottom: '15px',
                borderRadius: '8px',
                border: '1px solid #e9ecef',
                boxShadow: '0 2px 4px rgba(0,0,0,0.1)',
                width: '100%',
                boxSizing: 'border-box'
              }}>
                <div style={{
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'center',
                  marginBottom: '10px'
                }}>
                  <h3 style={{
                    color: '#333',
                    margin: '0',
                    fontSize: '1.1rem',
                    fontWeight: '600'
                  }}>
                    {note?.author}
                  </h3>
                  <p style={{
                    color: '#666',
                    margin: '0',
                    fontSize: '0.9rem'
                  }}>
                    {formatDate(note?.createdAt)}
                  </p>
                </div>
                <p style={{
                  color: '#444',
                  lineHeight: '1.5',
                  marginBottom: '15px'
                }}>
                  {note?.content}
                </p>
                <div style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '10px',
                  marginBottom: '10px'
                }}>
                  <button
                    onClick={() => onLike(note?._id)}
                    title="Like"
                    style={{
                      backgroundColor: '#28a745',
                      color: 'white',
                      padding: '5px 12px',
                      border: 'none',
                      borderRadius: '4px',
                      fontSize: '12px',
                      cursor: 'pointer'
                    }}
                  >
                    Like
                  </button>
                  <button
                    onClick={() => onUnlike(note?._id)}
                    title="Unlike"
                    style={{
                      backgroundColor: '#ffc107',
                      color: 'black',
                      padding: '5px 12px',
                      border: 'none',
                      borderRadius: '4px',
                      fontSize: '12px',
                      cursor: 'pointer'
                    }}
                  >
                    Unlike
                  </button>
                  <span style={{
                    color: '#666',
                    fontSize: '14px'
                  }}>
                    {note?.likes ?? 0} likes
                  </span>
                </div>
                <button
                  onClick={() => onDelete(note?._id)}
                  title="Delete note"
                  style={{
                    backgroundColor: '#dc3545',
                    color: 'white',
                    padding: '5px 12px',
                    border: 'none',
                    borderRadius: '4px',
                    fontSize: '12px',
                    cursor: 'pointer'
                  }}
                >
                  Delete
                </button>
              </div>
            ))}
          </div>
          
          <div style={{
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center',
            gap: '10px',
            marginTop: '20px'
          }}>
            <button
              onClick={() => onPageChange(currentPage - 1)}
              disabled={currentPage === 1}
              style={{
                backgroundColor: currentPage === 1 ? '#6c757d' : '#007bff',
                color: 'white',
                padding: '8px 16px',
                border: 'none',
                borderRadius: '4px',
                cursor: currentPage === 1 ? 'not-allowed' : 'pointer'
              }}
            >
              Previous
            </button>
            <span style={{
              padding: '8px 16px',
              backgroundColor: 'white',
              borderRadius: '4px',
              boxShadow: '0 1px 3px rgba(0,0,0,0.1)',
              color: '#333'
            }}>
              Page {currentPage} of {totalPages}
            </span>
            <button
              onClick={() => onPageChange(currentPage + 1)}
              disabled={currentPage === totalPages}
              style={{
                backgroundColor: currentPage === totalPages ? '#6c757d' : '#007bff',
                color: 'white',
                padding: '8px 16px',
                border: 'none',
                borderRadius: '4px',
                cursor: currentPage === totalPages ? 'not-allowed' : 'pointer'
              }}
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