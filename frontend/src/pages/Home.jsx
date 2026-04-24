import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Link } from 'react-router-dom';
import { Calendar, User, ArrowRight, Search, Clock, ChevronRight } from 'lucide-react';

const Home = () => {
    const [posts, setPosts] = useState([]);
    const [loading, setLoading] = useState(true);


    useEffect(() => {
        const fetchPosts = async () => {
            try {
                const res = await axios.get('http://localhost:5000/api/posts');
                setPosts(res.data || []);
            } catch (err) {
                console.error('API Error:', err);
                setPosts([]);
            } finally {
                setLoading(false);
            }
        };
        fetchPosts();
    }, []);

    if (loading) return <div style={{ textAlign: 'center', marginTop: '100px', fontFamily: 'Playfair Display, serif', fontSize: '1.5rem' }}>Curating the latest stories...</div>;

    const featuredPost = posts[0];
    const remainingPosts = posts.slice(1);

    return (
        <div className="home-container">
            {/* Featured Post Hero */}
            {featuredPost && (
                <section className="featured-hero">
                    <div style={{ maxWidth: '800px', margin: '0 auto' }}>
                        <span style={{ fontSize: '0.8rem', fontWeight: '700', textTransform: 'uppercase', letterSpacing: '0.2em', color: 'var(--accent)', marginBottom: '20px', display: 'block' }}>Featured Story</span>
                        <h1 style={{ fontSize: '3.5rem', marginBottom: '25px' }}>{featuredPost.title}</h1>
                        <p style={{ fontSize: '1.2rem', color: 'var(--text-muted)', marginBottom: '30px', display: '-webkit-box', WebkitLineClamp: 3, WebkitBoxOrient: 'vertical', overflow: 'hidden' }}>
                            {featuredPost.content}
                        </p>
                        <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', gap: '20px', marginBottom: '30px', fontSize: '0.9rem', fontWeight: '500' }}>
                            <span style={{ display: 'flex', alignItems: 'center', gap: '5px' }}><User size={16} /> {featuredPost.author.username}</span>
                            <span style={{ display: 'flex', alignItems: 'center', gap: '5px' }}><Clock size={16} /> {new Date(featuredPost.createdAt).toLocaleDateString()}</span>
                        </div>
                        <Link to={`/post/${featuredPost._id}`} className="btn btn-primary">Read Full Story <ArrowRight size={18} /></Link>
                    </div>
                </section>
            )}

            <div className="main-layout">
                {/* Main Content: Post List */}
                <main>
                    <h3 style={{ fontSize: '1.5rem', marginBottom: '30px', borderBottom: '1px solid var(--border)', paddingBottom: '15px' }}>Latest Articles</h3>
                    <div className="post-list">
                        {remainingPosts.length > 0 ? (
                            remainingPosts.map(post => (
                                <article key={post._id} className="post-card">
                                    <div className="post-meta">
                                        <span><User size={14} /> {post.author.username}</span>
                                        <span><Calendar size={14} /> {new Date(post.createdAt).toLocaleDateString()}</span>
                                    </div>
                                    <Link to={`/post/${post._id}`}>
                                        <h2>{post.title}</h2>
                                    </Link>
                                    <p style={{ color: 'var(--text-muted)', marginBottom: '20px', display: '-webkit-box', WebkitLineClamp: 3, WebkitBoxOrient: 'vertical', overflow: 'hidden' }}>
                                        {post.content}
                                    </p>
                                    <Link to={`/post/${post._id}`} style={{ fontWeight: '700', display: 'flex', alignItems: 'center', gap: '5px', fontSize: '0.9rem' }}>
                                        Continue Reading <ChevronRight size={16} />
                                    </Link>
                                </article>
                            ))
                        ) : (
                            <p style={{ color: 'var(--text-muted)' }}>No more articles to show yet.</p>
                        )}
                    </div>
                </main>

                {/* Sidebar */}
                <aside>
                    <div className="sidebar-widget">
                        <h3>Search</h3>
                        <div style={{ position: 'relative' }}>
                            <input type="text" placeholder="Search the blog..." style={{ paddingRight: '40px' }} />
                            <Search size={18} style={{ position: 'absolute', right: '12px', top: '12px', color: 'var(--text-muted)' }} />
                        </div>
                    </div>

                    <div className="sidebar-widget">
                        <h3>About the Editor</h3>
                        <div style={{ background: 'var(--bg-secondary)', padding: '20px', borderRadius: '4px' }}>
                            <p style={{ fontSize: '0.95rem', color: 'var(--text-muted)', marginBottom: '15px' }}>
                                Welcome to our modern publication space. We curate the finest insights on technology, design, and culture.
                            </p>
                            <Link to="/register" style={{ fontWeight: '600', color: 'var(--primary)', fontSize: '0.9rem' }}>Join the community</Link>
                        </div>
                    </div>

                    <div className="sidebar-widget">
                        <h3>Categories</h3>
                        <ul style={{ listStyle: 'none' }}>
                            {['Technology', 'Lifestyle', 'Business', 'Creative'].map(cat => (
                                <li key={cat} style={{ padding: '10px 0', borderBottom: '1px solid var(--border)', fontSize: '0.9rem', display: 'flex', justifyContent: 'space-between' }}>
                                    <span>{cat}</span>
                                    <span style={{ color: 'var(--text-muted)' }}>(0)</span>
                                </li>
                            ))}
                        </ul>
                    </div>
                </aside>
            </div>
        </div>
    );
};

export default Home;
