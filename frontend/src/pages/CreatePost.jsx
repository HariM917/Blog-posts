import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { Send } from 'lucide-react';

const CreatePost = () => {
    const [title, setTitle] = useState('');
    const [content, setContent] = useState('');
    const [loading, setLoading] = useState(false);
    const navigate = useNavigate();

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        try {
            await axios.post('http://localhost:5000/api/posts', { title, content });
            navigate('/');
        } catch (err) {
            console.error(err);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div style={{ maxWidth: '800px', margin: '40px auto' }}>
            <h1 style={{ marginBottom: '30px' }}>Create New Story</h1>
            <form onSubmit={handleSubmit} className="card" style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
                <div>
                    <label style={{ display: 'block', marginBottom: '8px' }}>Title</label>
                    <input 
                        style={{ fontSize: '1.5rem', fontWeight: '700' }}
                        placeholder="Give your story a title..."
                        value={title} 
                        onChange={(e) => setTitle(e.target.value)} 
                        required 
                    />
                </div>
                <div>
                    <label style={{ display: 'block', marginBottom: '8px' }}>Content</label>
                    <textarea 
                        style={{ minHeight: '400px', resize: 'vertical', fontSize: '1.1rem' }}
                        placeholder="Tell your story..."
                        value={content} 
                        onChange={(e) => setContent(e.target.value)} 
                        required 
                    />
                </div>
                <button type="submit" disabled={loading} className="btn btn-primary" style={{ alignSelf: 'flex-end' }}>
                    <Send size={20} /> {loading ? 'Publishing...' : 'Publish Post'}
                </button>
            </form>
        </div>
    );
};

export default CreatePost;
