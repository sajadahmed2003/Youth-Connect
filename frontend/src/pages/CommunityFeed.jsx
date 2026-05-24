import React, { useState, useEffect, useRef } from 'react';
import { Heart, MessageCircle, Share2, Trash2, Send, Image as ImageIcon, MoreHorizontal } from 'lucide-react';
import toast from 'react-hot-toast';
import { API_BASE } from '../config';

const CLOUDINARY_UPLOAD_PRESET = 'pk1lq4vo';
const CLOUDINARY_CLOUD_NAME = 'dgdqw7ael';

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

      if (newPostFile) {
        const formData = new FormData();
        formData.append('file', newPostFile);
        formData.append('upload_preset', CLOUDINARY_UPLOAD_PRESET);
        
        const cloudRes = await fetch(`https://api.cloudinary.com/v1_1/${CLOUDINARY_CLOUD_NAME}/image/upload`, {
          method: 'POST',
          body: formData
        });
        const cloudData = await cloudRes.json();
        
        if (cloudData.secure_url) {
          finalImageUrl = cloudData.secure_url;
        } else {
          console.error("Cloudinary Error Details:", cloudData);
          toast.error(`Upload failed: ${cloudData.error?.message || "Check console"}`);
          setIsPosting(false);
          return;
        }
      }

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
        if (fileInputRef.current) fileInputRef.current.value = '';
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
    <div style={{ minHeight: '100vh', background: 'var(--bg-base)', padding: '40px 24px', fontFamily: 'var(--font-body)' }}>
        
      {/* HEADER */}
      <div style={{ maxWidth: '640px', margin: '0 auto', marginBottom: '32px' }}>
        <div className="section-label" style={{ display: 'inline-flex', marginBottom: '12px' }}>Social Timeline</div>
        <h1 style={{ fontFamily: 'var(--font-heading)', fontSize: '2.2rem', fontWeight: '900', color: 'var(--text-primary)', letterSpacing: '-0.5px', margin: 0 }}>
          Activity <span style={{ color: 'var(--primary-light)' }}>Feed</span>
        </h1>
        <p style={{ color: 'var(--text-secondary)', fontSize: '0.95rem', marginTop: '4px' }}>What's happening in the community right now?</p>
      </div>

      <div style={{ maxWidth: '640px', margin: '0 auto', display: 'flex', flexDirection: 'column', gap: '24px' }}>
          
        {/* ✍️ POST CREATION WIDGET */}
        <div className="cyber-card" style={{ padding: '24px' }}>
          <div style={{ display: 'flex', gap: '16px' }}>
            <div style={{ width: '44px', height: '44px', borderRadius: '50%', background: 'var(--gradient-primary)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: '900', color: 'white', flexShrink: 0, fontSize: '1.1rem', boxShadow: '0 4px 12px rgba(124, 58, 237, 0.3)' }}>
              {user?.name?.[0]?.toUpperCase() || '?'}
            </div>
            <div style={{ flex: 1 }}>
              <textarea 
                placeholder="What's on your mind? Share your volunteer experience..." 
                value={newPostContent}
                onChange={(e) => setNewPostContent(e.target.value)}
                rows="3"
                style={{ width: '100%', background: 'transparent', border: 'none', padding: '8px 0', color: 'var(--text-primary)', outline: 'none', resize: 'none', fontSize: '1.1rem', fontWeight: '500', fontFamily: 'inherit' }}
              />
              
              {/* IMAGE PREVIEW */}
              {newPostImagePreview && (
                <div style={{ marginTop: '16px', position: 'relative', display: 'inline-block' }}>
                  <img src={newPostImagePreview} alt="Preview" style={{ maxHeight: '280px', borderRadius: 'var(--radius-md)', border: '1px solid var(--border)', objectFit: 'cover' }} />
                  <button onClick={() => { setNewPostFile(null); setNewPostImagePreview(''); if(fileInputRef.current) fileInputRef.current.value = ''; }} style={{ position: 'absolute', top: '10px', right: '10px', background: 'rgba(10, 10, 18, 0.75)', color: 'white', border: 'none', borderRadius: '50%', width: '28px', height: '28px', cursor: 'pointer', fontWeight: 'bold', display: 'flex', alignItems: 'center', justifyContent: 'center', backdropFilter: 'blur(4px)', transition: '0.2s' }}>✕</button>
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
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: '16px', paddingTop: '16px', borderTop: '1px solid var(--border)' }}>
                <button onClick={() => fileInputRef.current.click()} className="btn btn-ghost" style={{ padding: '8px 16px', borderRadius: 'var(--radius-full)', background: 'rgba(124, 58, 237, 0.08)', color: 'var(--primary-light)', border: '1px solid rgba(124, 58, 237, 0.15)', fontSize: '0.85rem' }}>
                  <ImageIcon size={16} /> Add Photo
                </button>
                
                <button onClick={handlePost} disabled={isPosting || (!newPostContent.trim() && !newPostFile)} className="btn btn-primary" style={{ padding: '10px 24px', borderRadius: 'var(--radius-full)', fontSize: '0.88rem' }}>
                  {isPosting ? 'Uploading...' : 'Post'} <Send size={14} />
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* 📱 FEED ITEMS */}
        {posts.map(post => (
          <div key={post._id} className="cyber-card animate-fadeIn" style={{ padding: '24px' }}>
              
            {/* POST HEADER */}
            <div style={{ display: 'flex', alignItems: 'center', gap: '14px', marginBottom: '16px' }}>
              <div style={{ width: '44px', height: '44px', borderRadius: '50%', background: 'var(--gradient-accent)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: '900', color: 'white', fontSize: '1.1rem' }}>
                {post.userName?.[0]?.toUpperCase()}
              </div>
              <div style={{ flex: 1, minWidth: 0 }}>
                <div style={{ fontWeight: '800', fontSize: '1rem', color: 'var(--text-primary)', display: 'flex', alignItems: 'center', gap: '6px' }}>
                  <span style={{ textOverflow: 'ellipsis', overflow: 'hidden', whiteSpace: 'nowrap' }}>{post.userName}</span>
                  <span className="badge badge-primary" style={{ fontSize: '0.6rem', padding: '2px 8px' }}>Verified</span>
                </div>
                <div style={{ fontSize: '0.78rem', color: 'var(--text-muted)', marginTop: '2px' }}>
                  {new Date(post.createdAt).toLocaleDateString()} at {new Date(post.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                </div>
              </div>
              
              {(post.userId === user?._id || user?.role === 'admin') ? (
                <button onClick={() => handleDelete(post._id)} style={{ background: 'rgba(239, 68, 68, 0.08)', border: 'none', color: '#f87171', cursor: 'pointer', padding: '8px', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', border: '1px solid rgba(239, 68, 68, 0.15)', transition: '0.2s' }}>
                  <Trash2 size={16} />
                </button>
              ) : (
                <button style={{ background: 'none', border: 'none', color: 'var(--text-muted)', cursor: 'pointer' }}>
                  <MoreHorizontal size={18} />
                </button>
              )}
            </div>

            {/* POST CONTENT */}
            <div style={{ color: 'var(--text-primary)', fontSize: '1.05rem', lineHeight: '1.6', whiteSpace: 'pre-wrap', marginBottom: '16px' }}>
              {post.content}
            </div>

            {/* POST IMAGE */}
            {post.image && (
              <div style={{ width: '100%', maxHeight: '420px', overflow: 'hidden', borderRadius: 'var(--radius-md)', border: '1px solid var(--border)', marginBottom: '16px' }}>
                <img src={post.image} alt="Post Attachment" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
              </div>
            )}

            {/* SOCIAL ACTIONS */}
            <div style={{ display: 'flex', gap: '30px', borderTop: '1px solid var(--border)', paddingTop: '14px' }}>
              <div onClick={() => handleLike(post._id)} style={{ display: 'flex', alignItems: 'center', gap: '8px', cursor: 'pointer', color: post.likes?.includes(user?._id) ? '#f87171' : 'var(--text-secondary)', transition: '0.2s', fontWeight: '700', fontSize: '0.85rem' }}>
                <Heart size={18} fill={post.likes?.includes(user?._id) ? '#ef4444' : 'none'} style={{ color: post.likes?.includes(user?._id) ? '#ef4444' : 'inherit' }} /> 
                {post.likes?.length || 0}
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px', color: 'var(--text-secondary)', cursor: 'pointer', transition: '0.2s', fontWeight: '700', fontSize: '0.85rem' }}>
                <MessageCircle size={18} /> 
                Comment
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px', color: 'var(--text-secondary)', cursor: 'pointer', transition: '0.2s', fontWeight: '700', fontSize: '0.85rem' }}>
                <Share2 size={18} /> 
                Share
              </div>
            </div>
          </div>
        ))}
        
        {posts.length === 0 && (
          <div style={{ textAlign: 'center', padding: '60px 24px' }} className="cyber-card">
            <MessageCircle size={40} color="var(--text-muted)" style={{ marginBottom: '16px', margin: '0 auto' }} />
            <h3 style={{ fontFamily: 'var(--font-heading)', color: 'var(--text-primary)', fontSize: '1.25rem', margin: '0 0 8px 0' }}>It's quiet here...</h3>
            <p style={{ color: 'var(--text-muted)', fontSize: '0.9rem', margin: 0 }}>Be the first one to share an update with the community!</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default CommunityFeed;
