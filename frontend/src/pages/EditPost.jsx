import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useParams, useNavigate } from 'react-router-dom';
import { Save } from 'lucide-react';

const EditPost = () => {
    const { id } = useParams();
    const [title, setTitle] = useState('');
    const [content, setContent] = useState('');
    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);
    const navigate = useNavigate();

    useEffect(() => {
        const fetchPost = async () => {
            try {
                const res = await axios.get(`http://localhost:5000/api/posts/${id}`);
                setTitle(res.data.title);
                setContent(res.data.content);
            } catch (err) {
                console.error(err);
            } finally {
                setLoading(false);
            }
        };
        fetchPost();
    }, [id]);

    const handleSubmit = async (e) => {
        e.preventDefault();
        setSaving(true);
        try {
            await axios.patch(`http://localhost:5000/api/posts/${id}`, { title, content });
            navigate(`/post/${id}`);
        } catch (err) {
            console.error(err);
        } finally {
            setSaving(false);
        }
    };

    if (loading) return <div style={{ textAlign: 'center', marginTop: '50px' }}>Loading...</div>;

    return (
        <div style={{ maxWidth: '800px', margin: '40px auto' }}>
            <h1 style={{ marginBottom: '30px' }}>Edit Story</h1>
            <form onSubmit={handleSubmit} className="card" style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
                <div>
                    <label style={{ display: 'block', marginBottom: '8px' }}>Title</label>
                    <input 
                        style={{ fontSize: '1.5rem', fontWeight: '700' }}
                        value={title} 
                        onChange={(e) => setTitle(e.target.value)} 
                        required 
                    />
                </div>
                <div>
                    <label style={{ display: 'block', marginBottom: '8px' }}>Content</label>
                    <textarea 
                        style={{ minHeight: '400px', resize: 'vertical', fontSize: '1.1rem' }}
                        value={content} 
                        onChange={(e) => setContent(e.target.value)} 
                        required 
                    />
                </div>
                <button type="submit" disabled={saving} className="btn btn-primary" style={{ alignSelf: 'flex-end' }}>
                    <Save size={20} /> {saving ? 'Saving...' : 'Save Changes'}
                </button>
            </form>
        </div>
    );
};

export default EditPost;
