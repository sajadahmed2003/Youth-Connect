import React, { useState, useEffect, useRef } from 'react';
import { Heart, MessageCircle, Share2, Trash2, Send, Image as ImageIcon, MoreHorizontal, Video, Film, FileText, Check, Plus, UserPlus, UserCheck, Trash } from 'lucide-react';
import toast from 'react-hot-toast';
import { API_BASE } from '../config';

const CLOUDINARY_UPLOAD_PRESET = 'pk1lq4vo';
const CLOUDINARY_CLOUD_NAME = 'dgdqw7ael';

const CommunityFeed = ({ user }) => {
  const [posts, setPosts] = useState([]);
  const [activeTab, setActiveTab] = useState('all'); // 'all', 'reel', 'video'
  const [newPostContent, setNewPostContent] = useState('');
  const [newPostImagePreview, setNewPostImagePreview] = useState('');
  const [newPostFile, setNewPostFile] = useState(null);
  const [newPostMediaType, setNewPostMediaType] = useState('post'); // 'post', 'reel', 'video'
  const [newPostVideoUrl, setNewPostVideoUrl] = useState('');
  const [isPosting, setIsPosting] = useState(false);
  
  // Follow/Connection tracking local state
  const [followingIds, setFollowingIds] = useState(new Set());

  // Interactive UI states for comments
  const [expandedComments, setExpandedComments] = useState({}); // { [postId]: boolean }
  const [commentInputs, setCommentInputs] = useState({}); // { [postId]: string }
  const [replyInputs, setReplyInputs] = useState({}); // { [commentId]: string }
  const [activeReplyId, setActiveReplyId] = useState(null); // commentId currently being replied to

  const fileInputRef = useRef(null);

  useEffect(() => {
    fetchPosts(activeTab);
  }, [activeTab]);

  // Sync followings list once user loads
  useEffect(() => {
    if (user?.following) {
      const ids = user.following.map(f => typeof f === 'object' ? f._id : f);
      setFollowingIds(new Set(ids));
    }
  }, [user]);

  const fetchPosts = async (type = 'all') => {
    try {
      const url = type === 'all' 
        ? `${API_BASE}/api/posts` 
        : `${API_BASE}/api/posts?type=${type}`;
      const res = await fetch(url);
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
    if (!newPostContent.trim() && !newPostFile && !newPostVideoUrl.trim()) return;
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
        body: JSON.stringify({ 
          content: newPostContent, 
          image: finalImageUrl,
          videoUrl: newPostVideoUrl,
          mediaType: newPostMediaType
        })
      });
      
      if (res.ok) {
        setNewPostContent('');
        setNewPostFile(null);
        setNewPostImagePreview('');
        setNewPostVideoUrl('');
        setNewPostMediaType('post');
        if (fileInputRef.current) fileInputRef.current.value = '';
        toast.success("Cyber post dispatched to the feed grid!");
        fetchPosts(activeTab);
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
      if (res.ok) fetchPosts(activeTab);
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
      if (res.ok) {
        toast.success("Post destroyed.");
        fetchPosts(activeTab);
      }
    } catch (err) { console.error(err); }
  };

  // Follow connections
  const handleFollowToggle = async (targetUserId) => {
    try {
      const token = localStorage.getItem('token');
      const res = await fetch(`${API_BASE}/api/users/${targetUserId}/follow`, {
        method: 'POST',
        headers: { 'Authorization': `Bearer ${token}` }
      });
      if (res.ok) {
        const data = await res.json();
        if (data.success) {
          toast.success(data.isFollowing ? "Connected/Following!" : "Disconnected/Unfollowed");
          setFollowingIds(prev => {
            const next = new Set(prev);
            if (data.isFollowing) next.add(targetUserId);
            else next.delete(targetUserId);
            return next;
          });
        }
      }
    } catch (err) { console.error(err); }
  };

  // Comments System Handlers
  const handleAddComment = async (postId) => {
    const text = commentInputs[postId];
    if (!text || !text.trim()) return;

    try {
      const token = localStorage.getItem('token');
      const res = await fetch(`${API_BASE}/api/posts/${postId}/comment`, {
        method: 'POST',
        headers: { 
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({ text })
      });
      if (res.ok) {
        toast.success("Comment added!");
        setCommentInputs(prev => ({ ...prev, [postId]: '' }));
        fetchPosts(activeTab);
      } else {
        toast.error("Failed to post comment.");
      }
    } catch (err) { console.error(err); }
  };

  const handleLikeComment = async (postId, commentId) => {
    try {
      const token = localStorage.getItem('token');
      const res = await fetch(`${API_BASE}/api/posts/${postId}/comment/${commentId}/like`, {
        method: 'PUT',
        headers: { 'Authorization': `Bearer ${token}` }
      });
      if (res.ok) {
        fetchPosts(activeTab);
      }
    } catch (err) { console.error(err); }
  };

  const handleReplyComment = async (postId, commentId) => {
    const text = replyInputs[commentId];
    if (!text || !text.trim()) return;

    try {
      const token = localStorage.getItem('token');
      const res = await fetch(`${API_BASE}/api/posts/${postId}/comment/${commentId}/reply`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({ text })
      });
      if (res.ok) {
        toast.success("Reply added!");
        setReplyInputs(prev => ({ ...prev, [commentId]: '' }));
        setActiveReplyId(null);
        fetchPosts(activeTab);
      } else {
        toast.error("Failed to post reply.");
      }
    } catch (err) { console.error(err); }
  };

  const handleDeleteComment = async (postId, commentId) => {
    if (!window.confirm("Erase this comment?")) return;
    try {
      const token = localStorage.getItem('token');
      const res = await fetch(`${API_BASE}/api/posts/${postId}/comment/${commentId}`, {
        method: 'DELETE',
        headers: { 'Authorization': `Bearer ${token}` }
      });
      if (res.ok) {
        toast.success("Comment deleted!");
        fetchPosts(activeTab);
      }
    } catch (err) { console.error(err); }
  };

  // Interactive share to clipboard
  const handleShare = async (post) => {
    try {
      const shareUrl = `${window.location.origin}/post/${post._id}`;
      await navigator.clipboard.writeText(shareUrl);
      toast.success("Link copied! Grid path synchronized.");
      
      // Update share count in backend
      const res = await fetch(`${API_BASE}/api/posts/${post._id}/share`, {
        method: 'POST'
      });
      if (res.ok) {
        fetchPosts(activeTab);
      }
    } catch (err) {
      toast.error("Clipboard copy failed.");
      console.error(err);
    }
  };

  // Parse video url helper
  const renderVideoPlayer = (url) => {
    if (!url) return null;
    const ytRegex = /(?:youtube\.com\/(?:[^\/]+\/.+\/|(?:v|e(?:mbed)?)\/|.*[?&]v=)|youtu\.be\/)([^"&?\/\s]{11})/;
    const ytMatch = url.match(ytRegex);
    if (ytMatch && ytMatch[1]) {
      return (
        <div style={{ position: 'relative', paddingBottom: '56.25%', height: 0, overflow: 'hidden', borderRadius: 'var(--radius-md)', border: '1px solid var(--border)', marginBottom: '16px' }}>
          <iframe
            src={`https://www.youtube.com/embed/${ytMatch[1]}`}
            title="YouTube video player"
            frameBorder="0"
            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
            allowFullScreen
            style={{ position: 'absolute', top: 0, left: 0, width: '100%', height: '100%' }}
          />
        </div>
      );
    }
    return (
      <div style={{ width: '100%', borderRadius: 'var(--radius-md)', border: '1px solid var(--border)', overflow: 'hidden', marginBottom: '16px', background: '#000' }}>
        <video src={url} controls style={{ width: '100%', maxHeight: '400px', display: 'block' }} />
      </div>
    );
  };

  return (
    <div style={{ minHeight: '100vh', background: 'var(--bg-base)', padding: '40px 24px', fontFamily: 'var(--font-body)' }}>
        
      {/* HEADER */}
      <div style={{ maxWidth: '640px', margin: '0 auto', marginBottom: '32px' }}>
        <div className="section-label" style={{ display: 'inline-flex', marginBottom: '12px' }}>Social Grid Engine</div>
        <h1 style={{ fontFamily: 'var(--font-heading)', fontSize: '2.2rem', fontWeight: '900', color: 'var(--text-primary)', letterSpacing: '-0.5px', margin: 0 }}>
          Interactive <span style={{ color: 'var(--primary-light)' }}>Feed</span>
        </h1>
        <p style={{ color: 'var(--text-secondary)', fontSize: '0.95rem', marginTop: '4px' }}>Broadcast posts, reels, and video clips in real time.</p>
      </div>

      {/* MEDIA FILTER TABS */}
      <div style={{ maxWidth: '640px', margin: '0 auto', display: 'flex', gap: '10px', marginBottom: '24px', background: 'rgba(255, 255, 255, 0.03)', padding: '6px', borderRadius: '30px', border: '1px solid var(--border)' }}>
        <button 
          onClick={() => setActiveTab('all')}
          style={{ flex: 1, padding: '10px 20px', borderRadius: '30px', border: 'none', background: activeTab === 'all' ? 'var(--primary)' : 'transparent', color: 'white', fontWeight: '800', cursor: 'pointer', transition: 'all 0.3s', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px', fontSize: '0.85rem' }}
        >
          <FileText size={16} /> All Posts
        </button>
        <button 
          onClick={() => setActiveTab('reel')}
          style={{ flex: 1, padding: '10px 20px', borderRadius: '30px', border: 'none', background: activeTab === 'reel' ? 'var(--gradient-primary)' : 'transparent', color: 'white', fontWeight: '800', cursor: 'pointer', transition: 'all 0.3s', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px', fontSize: '0.85rem' }}
        >
          <Film size={16} /> Reels
        </button>
      </div>

      <div style={{ maxWidth: '640px', margin: '0 auto', display: 'flex', flexDirection: 'column', gap: '24px' }}>
          
        {/* ✍️ ADVANCED POST CREATION WIDGET */}
        <div className="cyber-card" style={{ padding: '24px' }}>
          <div style={{ display: 'flex', gap: '16px' }}>
            <div style={{ width: '44px', height: '44px', borderRadius: '50%', background: 'var(--gradient-primary)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: '900', color: 'white', flexShrink: 0, fontSize: '1.1rem', boxShadow: '0 4px 12px rgba(124, 58, 237, 0.3)', overflow: 'hidden' }}>
              {user?.avatar ? (
                <img src={user.avatar} alt="Avatar" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
              ) : (
                user?.name?.[0]?.toUpperCase() || '?'
              )}
            </div>
            <div style={{ flex: 1 }}>
              
              {/* Media Type Indicator Selection */}
              <div style={{ display: 'flex', gap: '8px', marginBottom: '12px' }}>
                <span 
                  onClick={() => setNewPostMediaType('post')}
                  style={{ cursor: 'pointer', padding: '4px 12px', borderRadius: '12px', fontSize: '0.75rem', fontWeight: '700', background: newPostMediaType === 'post' ? 'rgba(124, 58, 237, 0.2)' : 'rgba(255,255,255,0.05)', color: newPostMediaType === 'post' ? 'var(--primary-light)' : 'var(--text-muted)', border: `1px solid ${newPostMediaType === 'post' ? 'var(--primary)' : 'transparent'}` }}
                >
                  📄 Standard Post
                </span>
                <span 
                  onClick={() => setNewPostMediaType('reel')}
                  style={{ cursor: 'pointer', padding: '4px 12px', borderRadius: '12px', fontSize: '0.75rem', fontWeight: '700', background: newPostMediaType === 'reel' ? 'rgba(236, 72, 153, 0.2)' : 'rgba(255,255,255,0.05)', color: newPostMediaType === 'reel' ? '#f472b6' : 'var(--text-muted)', border: `1px solid ${newPostMediaType === 'reel' ? '#ec4899' : 'transparent'}` }}
                >
                  🎬 Reel Clip
                </span>
              </div>

              <textarea 
                placeholder={newPostMediaType === 'post' ? "What's on your mind? Share your volunteer grid updates..." : "Share details for this reel clip..."}
                value={newPostContent}
                onChange={(e) => setNewPostContent(e.target.value)}
                rows="3"
                style={{ width: '100%', background: 'transparent', border: 'none', padding: '8px 0', color: 'var(--text-primary)', outline: 'none', resize: 'none', fontSize: '1.1rem', fontWeight: '500', fontFamily: 'inherit' }}
              />
              
              {/* VIDEO URL LINK INPUT */}
              {newPostMediaType === 'reel' && (
                <div style={{ marginTop: '8px', marginBottom: '16px' }}>
                  <input 
                    type="text"
                    placeholder="Enter Video Link (YouTube or MP4 absolute link)..."
                    value={newPostVideoUrl}
                    onChange={(e) => setNewPostVideoUrl(e.target.value)}
                    style={{ width: '100%', background: 'rgba(255,255,255,0.04)', border: '1px solid var(--border)', borderRadius: '8px', padding: '10px 14px', color: 'var(--text-primary)', fontSize: '0.9rem', outline: 'none', fontFamily: 'inherit' }}
                  />
                  {newPostVideoUrl && (
                    <div style={{ marginTop: '12px' }}>
                      <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)', marginBottom: '4px' }}>Cyber-Render Preview:</div>
                      {renderVideoPlayer(newPostVideoUrl)}
                    </div>
                  )}
                </div>
              )}

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
                
                <button onClick={handlePost} disabled={isPosting || (!newPostContent.trim() && !newPostFile && !newPostVideoUrl.trim())} className="btn btn-primary" style={{ padding: '10px 24px', borderRadius: 'var(--radius-full)', fontSize: '0.88rem' }}>
                  {isPosting ? 'Uploading...' : (newPostMediaType === 'reel' ? 'Share' : 'Post')} <Send size={14} />
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* 📱 FEED ITEMS */}
        {posts.map(post => {
          const isLiking = post.likes?.includes(user?._id);
          const isMyPost = post.userId === user?._id;
          const isFollowed = followingIds.has(post.userId);
          const hasComments = expandedComments[post._id];

          return (
            <div key={post._id} className="cyber-card animate-fadeIn" style={{ padding: '24px', borderLeft: post.mediaType === 'reel' ? '3px solid #ec4899' : post.mediaType === 'video' ? '3px solid #06b6d4' : '1px solid var(--border)' }}>
                
              {/* POST HEADER */}
              <div style={{ display: 'flex', alignItems: 'center', gap: '14px', marginBottom: '16px' }}>
                <div style={{ width: '44px', height: '44px', borderRadius: '50%', background: 'var(--gradient-accent)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: '900', color: 'white', fontSize: '1.1rem', overflow: 'hidden', flexShrink: 0 }}>
                  {post.userAvatar ? (
                    <img src={post.userAvatar} alt="Avatar" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                  ) : (
                    post.userName?.[0]?.toUpperCase()
                  )}
                </div>
                <div style={{ flex: 1, minWidth: 0 }}>
                  <div style={{ fontWeight: '800', fontSize: '1rem', color: 'var(--text-primary)', display: 'flex', alignItems: 'center', flexWrap: 'wrap', gap: '6px' }}>
                    <span style={{ textOverflow: 'ellipsis', overflow: 'hidden', whiteSpace: 'nowrap' }}>{post.userName}</span>
                    
                    {/* MEDIA TAG BADGES */}
                    {post.mediaType === 'reel' && (
                      <span className="badge" style={{ background: 'rgba(236, 72, 153, 0.15)', color: '#f472b6', fontSize: '0.62rem', border: '1px solid rgba(236, 72, 1 pink53, 0.3)', padding: '2px 6px' }}>🎬 Reel</span>
                    )}
                    {post.mediaType === 'video' && (
                      <span className="badge" style={{ background: 'rgba(6, 182, 212, 0.15)', color: '#22d3ee', fontSize: '0.62rem', border: '1px solid rgba(6, 182, 212, 0.3)', padding: '2px 6px' }}>🎥 Video</span>
                    )}

                    {/* CONNECT / FOLLOW BUTTON */}
                    {!isMyPost && (
                      <button 
                        onClick={() => handleFollowToggle(post.userId)}
                        style={{ display: 'inline-flex', alignItems: 'center', gap: '3px', background: isFollowed ? 'rgba(34, 197, 94, 0.1)' : 'rgba(124, 58, 237, 0.12)', border: `1px solid ${isFollowed ? 'rgba(34, 197, 94, 0.3)' : 'rgba(124, 58, 237, 0.3)'}`, color: isFollowed ? '#4ade80' : 'var(--primary-light)', borderRadius: '20px', padding: '3px 10px', fontSize: '0.68rem', fontWeight: '800', cursor: 'pointer', transition: '0.2s', marginLeft: '6px' }}
                      >
                        {isFollowed ? (
                          <>
                            <Check size={10} /> Grid Sync
                          </>
                        ) : (
                          <>
                            <Plus size={10} /> Link ID
                          </>
                        )}
                      </button>
                    )}
                  </div>
                  <div style={{ fontSize: '0.78rem', color: 'var(--text-muted)', marginTop: '2px' }}>
                    {new Date(post.createdAt).toLocaleDateString()} at {new Date(post.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                  </div>
                </div>
                
                {(isMyPost || user?.role === 'admin') ? (
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

              {/* VIDEO EMBED IF EXISTS */}
              {post.videoUrl && renderVideoPlayer(post.videoUrl)}

              {/* POST IMAGE */}
              {post.image && (
                <div style={{ width: '100%', maxHeight: '420px', overflow: 'hidden', borderRadius: 'var(--radius-md)', border: '1px solid var(--border)', marginBottom: '16px' }}>
                  <img src={post.image} alt="Post Attachment" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                </div>
              )}

              {/* SOCIAL ACTION ROW */}
              <div style={{ display: 'flex', gap: '30px', borderTop: '1px solid var(--border)', paddingTop: '14px', marginBottom: hasComments ? '16px' : '0' }}>
                <div onClick={() => handleLike(post._id)} style={{ display: 'flex', alignItems: 'center', gap: '8px', cursor: 'pointer', color: isLiking ? '#f87171' : 'var(--text-secondary)', transition: '0.2s', fontWeight: '700', fontSize: '0.85rem' }}>
                  <Heart size={18} fill={isLiking ? '#ef4444' : 'none'} style={{ color: isLiking ? '#ef4444' : 'inherit' }} /> 
                  {post.likes?.length || 0}
                </div>
                <div 
                  onClick={() => setExpandedComments(prev => ({ ...prev, [post._id]: !prev[post._id] }))}
                  style={{ display: 'flex', alignItems: 'center', gap: '8px', color: hasComments ? 'var(--primary-light)' : 'var(--text-secondary)', cursor: 'pointer', transition: '0.2s', fontWeight: '700', fontSize: '0.85rem' }}
                >
                  <MessageCircle size={18} /> 
                  {post.comments?.length || 0} Comments
                </div>
                <div 
                  onClick={() => handleShare(post)}
                  style={{ display: 'flex', alignItems: 'center', gap: '8px', color: 'var(--text-secondary)', cursor: 'pointer', transition: '0.2s', fontWeight: '700', fontSize: '0.85rem' }}
                >
                  <Share2 size={18} /> 
                  {post.shareCount || 0} Share
                </div>
              </div>

              {/* 💬 ADVANCED NESTED INLINE COMMENTS PANEL */}
              {hasComments && (
                <div className="comment-panel" style={{ borderTop: '1px solid var(--border)', paddingTop: '16px', display: 'flex', flexDirection: 'column', gap: '14px', animation: 'slideDown 0.3s ease-out' }}>
                  
                  {/* Read Comments Stream */}
                  {post.comments && post.comments.length > 0 ? (
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '16px', maxHeight: '360px', overflowY: 'auto', paddingRight: '4px' }}>
                      {post.comments.map(comment => {
                        const commentLiked = comment.likes?.includes(user?._id);
                        const isCommentMine = comment.userId === user?._id;
                        const isReplyActive = activeReplyId === comment._id;

                        return (
                          <div key={comment._id} style={{ display: 'flex', flexDirection: 'column', gap: '8px', background: 'rgba(255, 255, 255, 0.015)', padding: '12px', borderRadius: '12px', border: '1px solid rgba(255,255,255,0.03)' }}>
                            
                            {/* Comment Head Info */}
                            <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                              <div style={{ width: '28px', height: '28px', borderRadius: '50%', background: 'var(--gradient-accent)', overflow: 'hidden', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '0.8rem', fontWeight: 'bold' }}>
                                {comment.userAvatar ? (
                                  <img src={comment.userAvatar} alt="Avatar" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                                ) : (
                                  comment.userName?.[0]?.toUpperCase()
                                )}
                              </div>
                              <div style={{ flex: 1 }}>
                                <div style={{ fontSize: '0.85rem', fontWeight: '800', color: 'var(--text-primary)' }}>{comment.userName}</div>
                                <div style={{ fontSize: '0.7rem', color: 'var(--text-muted)' }}>{new Date(comment.createdAt).toLocaleDateString()}</div>
                              </div>

                              {/* Delete Comment Option */}
                              {(isCommentMine || isMyPost || user?.role === 'admin') && (
                                <button 
                                  onClick={() => handleDeleteComment(post._id, comment._id)}
                                  style={{ background: 'none', border: 'none', color: '#f87171', cursor: 'pointer', opacity: 0.7, padding: '2px' }}
                                >
                                  <Trash size={12} />
                                </button>
                              )}
                            </div>

                            {/* Comment Content */}
                            <div style={{ fontSize: '0.9rem', color: 'var(--text-primary)', marginLeft: '38px', lineHeight: '1.4' }}>
                              {comment.text}
                            </div>

                            {/* Comment Action Nodes (Likes & Reply Hooks) */}
                            <div style={{ display: 'flex', gap: '16px', marginLeft: '38px', marginTop: '4px', fontSize: '0.75rem', fontWeight: 'bold' }}>
                              <span 
                                onClick={() => handleLikeComment(post._id, comment._id)}
                                style={{ color: commentLiked ? '#ef4444' : 'var(--text-muted)', cursor: 'pointer', display: 'inline-flex', alignItems: 'center', gap: '4px' }}
                              >
                                {commentLiked ? '❤️' : '🤍'} {comment.likes?.length || 0}
                              </span>
                              <span 
                                onClick={() => setActiveReplyId(isReplyActive ? null : comment._id)}
                                style={{ color: 'var(--primary-light)', cursor: 'pointer' }}
                              >
                                Reply
                              </span>
                            </div>

                            {/* NESTED REPLIES RENDERING (INDENTED THREAD) */}
                            {comment.replies && comment.replies.length > 0 && (
                              <div className="reply-thread" style={{ marginLeft: '38px', marginTop: '10px', display: 'flex', flexDirection: 'column', gap: '10px', borderLeft: '2px solid rgba(124, 58, 237, 0.2)', paddingLeft: '12px' }}>
                                {comment.replies.map(reply => (
                                  <div key={reply._id} style={{ display: 'flex', gap: '8px', background: 'rgba(255, 255, 255, 0.01)', padding: '8px', borderRadius: '8px' }}>
                                    <div style={{ width: '22px', height: '22px', borderRadius: '50%', background: 'var(--gradient-primary)', overflow: 'hidden', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '0.7rem', fontWeight: 'bold' }}>
                                      {reply.userAvatar ? (
                                        <img src={reply.userAvatar} alt="Avatar" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                                      ) : (
                                        reply.userName?.[0]?.toUpperCase()
                                      )}
                                    </div>
                                    <div style={{ flex: 1 }}>
                                      <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                                        <span style={{ fontSize: '0.78rem', fontWeight: '800', color: 'var(--text-primary)' }}>{reply.userName}</span>
                                        <span style={{ fontSize: '0.62rem', color: 'var(--text-muted)' }}>{new Date(reply.createdAt).toLocaleDateString()}</span>
                                      </div>
                                      <div style={{ fontSize: '0.82rem', color: 'var(--text-secondary)', marginTop: '2px' }}>
                                        {reply.text}
                                      </div>
                                    </div>
                                  </div>
                                ))}
                              </div>
                            )}

                            {/* Inline Reply Input Form */}
                            {isReplyActive && (
                              <div style={{ marginLeft: '38px', marginTop: '8px', display: 'flex', gap: '8px' }}>
                                <input 
                                  type="text"
                                  placeholder="Post a nested reply link..."
                                  value={replyInputs[comment._id] || ''}
                                  onChange={(e) => setReplyInputs({ ...replyInputs, [comment._id]: e.target.value })}
                                  style={{ flex: 1, background: 'rgba(255,255,255,0.03)', border: '1px solid var(--border)', borderRadius: '6px', padding: '6px 10px', color: 'var(--text-primary)', fontSize: '0.8rem', outline: 'none' }}
                                />
                                <button 
                                  onClick={() => handleReplyComment(post._id, comment._id)}
                                  className="btn btn-primary"
                                  style={{ padding: '6px 12px', fontSize: '0.75rem', borderRadius: '6px' }}
                                >
                                  Reply
                                </button>
                              </div>
                            )}

                          </div>
                        );
                      })}
                    </div>
                  ) : (
                    <div style={{ textAlign: 'center', padding: '16px', color: 'var(--text-muted)', fontSize: '0.85rem' }}>No comments posted yet. Broadcast a reply grid!</div>
                  )}

                  {/* Top-Level Add Comment Form */}
                  <div style={{ display: 'flex', gap: '10px', marginTop: '8px' }}>
                    <input 
                      type="text"
                      placeholder="Write a cyber comment..."
                      value={commentInputs[post._id] || ''}
                      onChange={(e) => setCommentInputs({ ...commentInputs, [post._id]: e.target.value })}
                      style={{ flex: 1, background: 'rgba(255,255,255,0.04)', border: '1px solid var(--border)', borderRadius: '30px', padding: '10px 18px', color: 'var(--text-primary)', fontSize: '0.9rem', outline: 'none', fontFamily: 'inherit' }}
                    />
                    <button 
                      onClick={() => handleAddComment(post._id)}
                      className="btn btn-primary"
                      style={{ borderRadius: '50%', width: '40px', height: '40px', padding: 0, display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}
                    >
                      <Send size={14} />
                    </button>
                  </div>

                </div>
              )}

            </div>
          );
        })}
        
        {posts.length === 0 && (
          <div style={{ textAlign: 'center', padding: '60px 24px' }} className="cyber-card">
            <MessageCircle size={40} color="var(--text-muted)" style={{ marginBottom: '16px', margin: '0 auto' }} />
            <h3 style={{ fontFamily: 'var(--font-heading)', color: 'var(--text-primary)', fontSize: '1.25rem', margin: '0 0 8px 0' }}>Silence on this coordinate...</h3>
            <p style={{ color: 'var(--text-muted)', fontSize: '0.9rem', margin: 0 }}>Be the first one to deploy a broadcast to this feed!</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default CommunityFeed;
