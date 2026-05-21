import React, { useState, useEffect, useRef } from 'react';
import { Heart, MessageCircle, Share2, Trash2, Send, Image as ImageIcon, MoreHorizontal } from 'lucide-react';
import toast from 'react-hot-toast';
import { API_BASE } from '../config';

const CLOUDINARY_UPLOAD_PRESET = 'pk1lq4vo'; // Unsigned preset from user
const CLOUDINARY_CLOUD_NAME = 'dgdqw7ael'; // Updated from user

const CommunityFeed = ({ user }) => {
  const [posts, setPosts] = useState([]);
  const [newPostContent, setNewPostContent] = useState('');
  const [newPostImagePreview, setNewPostImagePreview] = useState('');
  const [newPostFile, setNewPostFile] = useState(null);
  const [isPosting, setIsPosting] = useState(false);
  const fileInputRef = useRef(null);

  useEffect(() => {
    fetchPosts();
  }, []);

  const fetchPosts = async () => {
    try {
      const res = await fetch(`${API_BASE}/api/posts`);
      if (res.ok) {
        const data = await res.json();
        setPosts(data);
      }
    } catch (err) { console.error(err); }
  };

  const handleImageUpload = (e) => {
    const file = e.target.files[0];
    if (file) {
        if (file.size > 10 * 1024 * 1024) {
            alert("Image is too large! Please upload an image smaller than 10MB.");
            return;
        }
        setNewPostFile(file);
        setNewPostImagePreview(URL.createObjectURL(file));
    }
  };

  const handlePost = async () => {
    if (!newPostContent.trim() && !newPostFile) return;
    setIsPosting(true);
    
    try {
        let finalImageUrl = '';

        // 1. Upload to Cloudinary if a file is selected
        if (newPostFile) {
            const formData = new FormData();
            formData.append('file', newPostFile);
            formData.append('upload_preset', CLOUDINARY_UPLOAD_PRESET);
            
            const cloudRes = await fetch(`https://api.cloudinary.com/v1_1/${CLOUDINARY_CLOUD_NAME}/image/upload`, {
                method: 'POST',
                body: formData
            });
            const cloudData = await cloudRes.json();
            
            if(cloudData.secure_url) {
                finalImageUrl = cloudData.secure_url;
            } else {
                console.error("Cloudinary Error Details:", cloudData);
                toast.error(`Upload failed: ${cloudData.error?.message || "Check console"}`);
                setIsPosting(false);
                return;
            }
        }

        // 2. Send data to our Node Backend
        const token = localStorage.getItem('token');
        const res = await fetch(`${API_BASE}/api/posts`, {
            method: 'POST',
            headers: { 
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${token}` 
            },
            body: JSON.stringify({ content: newPostContent, image: finalImageUrl })
        });
        
        if (res.ok) {
            setNewPostContent('');
            setNewPostFile(null);
            setNewPostImagePreview('');
            if(fileInputRef.current) fileInputRef.current.value = '';
            toast.success("Image or Post successfully uploaded!");
            fetchPosts();
        } else {
            toast.error("Failed to post update to the database.");
        }
    } catch (err) { console.error(err); }
    setIsPosting(false);
  };

  const handleLike = async (id) => {
    try {
        const token = localStorage.getItem('token');
        const res = await fetch(`${API_BASE}/api/posts/${id}/like`, {
            method: 'POST',
            headers: { 'Authorization': `Bearer ${token}` }
        });
        if (res.ok) fetchPosts();
    } catch (err) { console.error(err); }
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Are you sure you want to delete this post?')) return;
    try {
        const token = localStorage.getItem('token');
        const res = await fetch(`${API_BASE}/api/posts/${id}`, {
            method: 'DELETE',
            headers: { 'Authorization': `Bearer ${token}` }
        });
        if (res.ok) fetchPosts();
    } catch (err) { console.error(err); }
  };

  return (
    <div style={{ minHeight: '100vh', background: '#f8fafc', padding: '40px 20px', fontFamily: 'Inter, sans-serif' }}>
        
        {/* HEADER */}
        <div style={{ maxWidth: '650px', margin: '0 auto', marginBottom: '30px' }}>
            <h1 style={{ fontSize: '2.5rem', fontWeight: '900', color: '#1e293b', letterSpacing: '-1px', margin: 0 }}>
                Activity <span style={{ color: '#0ca6a6' }}>Feed</span>
            </h1>
            <p style={{ color: '#64748b', fontSize: '1.1rem', marginTop: '5px' }}>What's happening in the community right now?</p>
        </div>

        <div style={{ maxWidth: '650px', margin: '0 auto', display: 'flex', flexDirection: 'column', gap: '25px' }}>
            
            {/* ✍️ POST CREATION WIDGET (SMOOTH & LIGHT) */}
            <div style={{ background: '#ffffff', borderRadius: '24px', padding: '25px', boxShadow: '0 10px 40px rgba(0,0,0,0.03)', border: '1px solid #f1f5f9', transition: 'all 0.3s ease' }}>
                <div style={{ display: 'flex', gap: '15px' }}>
                    <div style={{ width: '48px', height: '48px', borderRadius: '50%', background: 'linear-gradient(135deg, #0ca6a6, #4ade80)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: '900', color: 'white', flexShrink: 0, fontSize: '1.2rem', boxShadow: '0 4px 10px rgba(12, 166, 166, 0.2)' }}>
                        {user?.name?.[0]?.toUpperCase() || '?'}
                    </div>
                    <div style={{ flex: 1 }}>
                        <textarea 
                            placeholder="What's on your mind? Share your volunteer experience..." 
                            value={newPostContent}
                            onChange={(e) => setNewPostContent(e.target.value)}
                            rows="3"
                            style={{ width: '100%', background: 'transparent', border: 'none', padding: '10px 0', color: '#1e293b', outline: 'none', resize: 'none', fontSize: '1.2rem', fontWeight: '500', fontFamily: 'inherit' }}
                        />
                        
                        {/* IMAGE PREVIEW */}
                        {newPostImagePreview && (
                            <div style={{ marginTop: '15px', position: 'relative', display: 'inline-block' }}>
                                <img src={newPostImagePreview} alt="Preview" style={{ maxHeight: '300px', borderRadius: '16px', border: '1px solid #e2e8f0', objectFit: 'cover' }} />
                                <button onClick={() => { setNewPostFile(null); setNewPostImagePreview(''); if(fileInputRef.current) fileInputRef.current.value = ''; }} style={{ position: 'absolute', top: '10px', right: '10px', background: 'rgba(15, 23, 42, 0.7)', color: 'white', border: 'none', borderRadius: '50%', width: '30px', height: '30px', cursor: 'pointer', fontWeight: 'bold', display: 'flex', alignItems: 'center', justifyContent: 'center', backdropFilter: 'blur(4px)', transition: '0.2s' }} onMouseOver={e=>e.target.style.background='rgba(239, 68, 68, 0.9)'} onMouseOut={e=>e.target.style.background='rgba(15, 23, 42, 0.7)'}>✕</button>
                            </div>
                        )}
                        
                        <input 
                            type="file" 
                            accept="image/*"
                            ref={fileInputRef}
                            onChange={handleImageUpload}
                            style={{ display: 'none' }}
                        />
                        
                        {/* ACTION BAR */}
                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: '20px', paddingTop: '15px', borderTop: '1px solid #f1f5f9' }}>
                            <button onClick={() => fileInputRef.current.click()} style={{ background: '#f0fdfa', border: 'none', color: '#0ca6a6', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '8px', fontWeight: 'bold', padding: '8px 16px', borderRadius: '30px', transition: '0.2s' }} onMouseOver={e=>e.target.style.background='#ccfbf1'} onMouseOut={e=>e.target.style.background='#f0fdfa'}>
                                <ImageIcon size={18} /> Add Photo
                            </button>
                            
                            <button onClick={handlePost} disabled={isPosting || (!newPostContent.trim() && !newPostFile)} style={{ background: (!newPostContent.trim() && !newPostFile) ? '#cbd5e1' : '#0ca6a6', color: 'white', border: 'none', padding: '12px 30px', borderRadius: '30px', fontWeight: 'bold', cursor: (!newPostContent.trim() && !newPostFile) ? 'not-allowed' : 'pointer', display: 'flex', alignItems: 'center', gap: '8px', fontSize: '1rem', transition: '0.2s', boxShadow: (!newPostContent.trim() && !newPostFile) ? 'none' : '0 4px 15px rgba(12, 166, 166, 0.3)' }}>
                                {isPosting ? 'Uploading...' : 'Post'} <Send size={16} />
                            </button>
                        </div>
                    </div>
                </div>
            </div>

            {/* 📱 FEED ITEMS */}
            {posts.map(post => (
                <div key={post._id} style={{ background: '#ffffff', borderRadius: '24px', padding: '25px', boxShadow: '0 10px 40px rgba(0,0,0,0.03)', border: '1px solid #f1f5f9', transition: 'transform 0.2s ease', cursor: 'pointer' }} onMouseOver={e=>e.currentTarget.style.transform='translateY(-2px)'} onMouseOut={e=>e.currentTarget.style.transform='translateY(0)'}>
                    
                    {/* POST HEADER */}
                    <div style={{ display: 'flex', alignItems: 'center', gap: '15px', marginBottom: '15px' }}>
                        <div style={{ width: '48px', height: '48px', borderRadius: '50%', background: 'linear-gradient(135deg, #0ca6a6, #4ade80)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: '900', color: 'white', fontSize: '1.2rem' }}>
                            {post.userName?.[0]?.toUpperCase()}
                        </div>
                        <div style={{flex: 1}}>
                            <div style={{ fontWeight: '800', fontSize: '1.1rem', color: '#1e293b', display: 'flex', alignItems: 'center', gap: '8px' }}>
                                {post.userName} 
                                <span style={{ color: '#0ca6a6', background: '#f0fdfa', fontSize: '0.7rem', padding: '2px 8px', borderRadius: '10px' }}>Verified</span>
                            </div>
                            <div style={{ fontSize: '0.85rem', color: '#94a3b8', marginTop: '2px' }}>
                                {new Date(post.createdAt).toLocaleDateString()} at {new Date(post.createdAt).toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'})}
                            </div>
                        </div>
                        
                        {(post.userId === user?._id || user?.role === 'admin') ? (
                            <button onClick={() => handleDelete(post._id)} style={{ background: '#fef2f2', border: 'none', color: '#ef4444', cursor: 'pointer', padding: '8px', borderRadius: '50%', transition: '0.2s' }} onMouseOver={e=>e.target.style.background='#fee2e2'} onMouseOut={e=>e.target.style.background='#fef2f2'}>
                                <Trash2 size={18} />
                            </button>
                        ) : (
                            <button style={{ background: 'none', border: 'none', color: '#cbd5e1', cursor: 'pointer' }}>
                                <MoreHorizontal size={20} />
                            </button>
                        )}
                    </div>

                    {/* POST CONTENT */}
                    <div style={{ color: '#334155', fontSize: '1.15rem', lineHeight: '1.6', whiteSpace: 'pre-wrap', marginBottom: '20px' }}>
                        {post.content}
                    </div>

                    {/* POST IMAGE */}
                    {post.image && (
                        <div style={{ width: '100%', maxHeight: '500px', overflow: 'hidden', borderRadius: '20px', border: '1px solid #f1f5f9', marginBottom: '20px' }}>
                            <img src={post.image} alt="Post Attachment" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                        </div>
                    )}

                    {/* SOCIAL ACTIONS */}
                    <div style={{ display: 'flex', gap: '40px', borderTop: '1px solid #f1f5f9', paddingTop: '15px' }}>
                        <div onClick={() => handleLike(post._id)} style={{ display: 'flex', alignItems: 'center', gap: '8px', cursor: 'pointer', color: post.likes?.includes(user?._id) ? '#ef4444' : '#64748b', transition: '0.2s', fontWeight: '600' }} onMouseOver={e=>e.currentTarget.style.color='#ef4444'} onMouseOut={e=>e.currentTarget.style.color=post.likes?.includes(user?._id) ? '#ef4444' : '#64748b'}>
                            <Heart size={22} fill={post.likes?.includes(user?._id) ? '#ef4444' : 'none'} style={{ transition: '0.3s' }} /> 
                            {post.likes?.length || 0}
                        </div>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '8px', color: '#64748b', cursor: 'pointer', transition: '0.2s', fontWeight: '600' }} onMouseOver={e=>e.currentTarget.style.color='#0ca6a6'} onMouseOut={e=>e.currentTarget.style.color='#64748b'}>
                            <MessageCircle size={22} /> 
                            Comment
                        </div>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '8px', color: '#64748b', cursor: 'pointer', transition: '0.2s', fontWeight: '600' }} onMouseOver={e=>e.currentTarget.style.color='#3b82f6'} onMouseOut={e=>e.currentTarget.style.color='#64748b'}>
                            <Share2 size={22} /> 
                            Share
                        </div>
                    </div>
                </div>
            ))}
            
            {posts.length === 0 && (
                <div style={{ textAlign: 'center', padding: '80px 20px', background: '#ffffff', borderRadius: '24px', border: '1px dashed #cbd5e1' }}>
                    <MessageCircle size={50} color="#cbd5e1" style={{ marginBottom: '20px' }} />
                    <h3 style={{ color: '#1e293b', fontSize: '1.5rem', margin: '0 0 10px 0' }}>It's quiet here...</h3>
                    <p style={{ color: '#64748b', fontSize: '1.1rem', margin: 0 }}>Be the first one to share an update with the community!</p>
                </div>
            )}
        </div>
    </div>
  );
};

export default CommunityFeed;
