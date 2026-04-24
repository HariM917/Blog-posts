import React, { useState, useEffect } from 'react';
import axios from 'axios';
import API_BASE_URL from '../api';
import { useAuth } from '../context/AuthContext';
import { MessageSquare, Trash2, Send } from 'lucide-react';

const CommentSection = ({ postId, initialComments }) => {
    const [comments, setComments] = useState(initialComments || []);
    const [newComment, setNewComment] = useState('');
    const { user, token } = useAuth();

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!newComment.trim()) return;

        try {
            const res = await axios.post(`${API_BASE_URL}/comments/${postId}`, { content: newComment });
            // Since the API returns the comment without the author username populated in a simple way,
            // we should ideally re-fetch or the API should return populated data.
            // For now, let's manually add it for UI responsiveness.
            const addedComment = {
                ...res.data,
                author: { username: user.username, _id: user._id }
            };
            setComments([...comments, addedComment]);
            setNewComment('');
        } catch (err) {
            console.error(err);
        }
    };

    const handleDelete = async (id) => {
        try {
            await axios.delete(`${API_BASE_URL}/comments/${id}`);
            setComments(comments.filter(c => c._id !== id));
        } catch (err) {
            console.error(err);
        }
    };

    return (
        <div style={{ borderTop: '1px solid var(--border)', paddingTop: '40px' }}>
            <h3 style={{ marginBottom: '30px', display: 'flex', alignItems: 'center', gap: '10px' }}>
                <MessageSquare size={24} /> Responses ({comments.length})
            </h3>

            {token ? (
                <form onSubmit={handleSubmit} style={{ marginBottom: '40px', display: 'flex', flexDirection: 'column', gap: '15px' }}>
                    <textarea 
                        placeholder="What are your thoughts?" 
                        value={newComment} 
                        onChange={(e) => setNewComment(e.target.value)} 
                        style={{ minHeight: '100px' }}
                        required 
                    />
                    <button type="submit" className="btn btn-primary" style={{ alignSelf: 'flex-end' }}>
                        <Send size={18} /> Respond
                    </button>
                </form>
            ) : (
                <p style={{ color: 'var(--text-muted)', marginBottom: '40px' }}>Please login to participate in the conversation.</p>
            )}

            <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
                {comments.map(comment => (
                    <div key={comment._id} className="glass" style={{ padding: '20px' }}>
                        <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '10px' }}>
                            <span style={{ fontWeight: '600', color: 'var(--primary)' }}>@{comment.author?.username || 'User'}</span>
                            <span style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>{new Date(comment.createdAt).toLocaleDateString()}</span>
                        </div>
                        <p>{comment.content}</p>
                        {user && (user._id === comment.author?._id || user.id === comment.author?._id) && (
                            <button 
                                onClick={() => handleDelete(comment._id)} 
                                style={{ background: 'none', border: 'none', color: 'var(--accent)', cursor: 'pointer', marginTop: '10px', fontSize: '0.8rem', display: 'flex', alignItems: 'center', gap: '5px' }}
                            >
                                <Trash2 size={14} /> Delete
                            </button>
                        )}
                    </div>
                ))}
            </div>
        </div>
    );
};

export default CommentSection;
