import React, { useState, useEffect } from 'react';

const Comments = ({ postId }) => {
    const [comments, setComments] = useState([]);
    const [content, setContent] = useState('');
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        refreshComments();
    }, [postId]);

    const refreshComments = async () => {
        setLoading(true);
        try {
            const response = await fetch(`http://localhost:3000/comments/${postId}`, {
                method: 'GET',
                credentials: 'include'
            });
            const data = await response.json();
            if (data.success) {
                setComments(data.data || []);
            } else {
                setError('Failed to load comments. Please try again later.');
            }
        } catch (err) {
            setError('Failed to load comments. Please try again later.');
        } finally {
            setLoading(false);
        }
    };

    const submitComment = async () => {
        if (!content.trim()) return;

        setLoading(true);
        try {
            const response = await fetch('http://localhost:3000/comment', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ post_id: postId, content }),
                credentials: 'include'
            });
            const data = await response.json();
            if (data.success) {
                setContent('');
                refreshComments();
            } else {
                setError('Failed to submit comment. Please try again.');
            }
        } catch (err) {
            setError('Failed to submit comment. Please try again.');
        } finally {
            setLoading(false);
        }
    };

    const likeComment = async (commentId) => {
        try {
            const response = await fetch('http://localhost:3000/like-comment', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ comment_id: commentId }),
                credentials: 'include'
            });
            const data = await response.json();
            if (data.success) {
                refreshComments();
            } else {
                console.error('Error liking comment:', data.message);
            }
        } catch (err) {
            console.error('Error liking comment:', err);
        }
    };

    const deleteComment = async (commentId) => {
        setLoading(true);
        try {
            const response = await fetch(`http://localhost:3000/comment/${commentId}`, {
                method: 'DELETE',
                credentials: 'include'
            });
            const data = await response.json();
            if (data.success) {
                // Remove the comment from the local state
                setComments(prevComments => prevComments.filter(comment => comment.comment_id !== commentId));
            } else {
                setError('You can  delete only your comment');
            }
        } catch (err) {
            setError('You can  delete only your comment');
        } finally {
            setLoading(false);
        }
    };

    if (loading) return <div>Loading comments...</div>;
    if (error) return <div className="text-red-500">{error}</div>;

    return (
        <div className="comments-section text-black">
            <h3 className="text-lg font-semibold mb-4" style={{ color: 'white' }}>Comments</h3>
            {comments.length > 0 ? (
                comments.map(comment => (
                    <div key={comment.comment_id} className="comment bg-slate-700 p-3  px-2 mb-2 text-white rounded">
                        <p className='underline text-blue-400 rounded-lg '>{comment.user_id}</p>
                        <p className="mb-2 bg-slate-500 rounded-lg py-2 px-2">{comment.content}</p>
                        <button 
                            onClick={() => likeComment(comment.comment_id)}
                            className="text-blue-500 hover:text-blue-700"
                            style={{ color: 'red' }}
                        >
                            Like ({comment.like_user_id?.length || 0})
                        </button>
                        <button 
                            onClick={() => deleteComment(comment.comment_id)}
                            className="text-red-500 hover:text-red-700 ml-2"
                        >
                            Delete
                        </button>
                    </div>
                ))
            ) : (
                <p>No comments yet. Be the first to comment!</p>
            )}
            <div className="mt-4">
                <input 
                    type="text" 
                    value={content} 
                    onChange={(e) => setContent(e.target.value)} 
                    placeholder="Add a comment"
                    className="border p-2 w-full rounded"
                />
                <button 
                    onClick={submitComment} 
                    className="bg-blue-500 text-white p-2 mt-2 rounded hover:bg-blue-600"
                    disabled={!content.trim() || loading}
                >
                    {loading ? 'Submitting...' : 'Submit'}
                </button>
            </div>
        </div>
    );
};

export default Comments;