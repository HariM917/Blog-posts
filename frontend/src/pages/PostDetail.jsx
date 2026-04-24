import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { Calendar, User, Edit2, Trash2, ChevronLeft } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import CommentSection from '../components/CommentSection';

const PostDetail = () => {
    const { id } = useParams();
    const [post, setPost] = useState(null);
    const [loading, setLoading] = useState(true);
    const { user } = useAuth();
    const navigate = useNavigate();

    useEffect(() => {
        const fetchPost = async () => {
            try {
                const res = await axios.get(`http://localhost:5000/api/posts/${id}`);
                setPost(res.data);
            } catch (err) {
                console.error(err);
            } finally {
                setLoading(false);
            }
        };
        fetchPost();
    }, [id]);

    const handleDelete = async () => {
        if (window.confirm('Are you sure you want to delete this post?')) {
            try {
                await axios.delete(`http://localhost:5000/api/posts/${id}`);
                navigate('/');
            } catch (err) {
                console.error(err);
            }
        }
    };

    if (loading) return <div style={{ textAlign: 'center', marginTop: '50px' }}>Loading...</div>;
    if (!post) return <div style={{ textAlign: 'center', marginTop: '50px' }}>Post not found</div>;

    const isAuthor = user && (user._id === post.author._id || user.id === post.author._id);

    return (
        <div style={{ maxWidth: '800px', margin: '40px auto' }}>
            <Link to="/" style={{ display: 'flex', alignItems: 'center', gap: '5px', color: 'var(--text-muted)', marginBottom: '30px' }}>
                <ChevronLeft size={18} /> Back to stories
            </Link>
            
            <header style={{ marginBottom: '40px' }}>
                <h1 style={{ fontSize: '3rem', marginBottom: '20px' }}>{post.title}</h1>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', color: 'var(--text-muted)' }}>
                    <div style={{ display: 'flex', gap: '20px' }}>
                        <span style={{ display: 'flex', alignItems: 'center', gap: '8px' }}><User size={18} /> {post.author.username}</span>
                        <span style={{ display: 'flex', alignItems: 'center', gap: '8px' }}><Calendar size={18} /> {new Date(post.createdAt).toLocaleDateString()}</span>
                    </div>
                    {isAuthor && (
                        <div style={{ display: 'flex', gap: '15px' }}>
                            <Link to={`/edit/${post._id}`} className="btn" style={{ padding: '8px' }}><Edit2 size={18} /></Link>
                            <button onClick={handleDelete} className="btn" style={{ padding: '8px', color: 'var(--accent)' }}><Trash2 size={18} /></button>
                        </div>
                    )}
                </div>
            </header>

            <article className="glass" style={{ padding: '40px', fontSize: '1.2rem', whiteSpace: 'pre-wrap', marginBottom: '60px' }}>
                {post.content}
            </article>

            <CommentSection postId={post._id} initialComments={post.comments} />
        </div>
    );
};

export default PostDetail;
