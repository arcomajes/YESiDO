"use client"

import { useState, useEffect } from "react"
import axios from "axios"
import { useNavigate } from "react-router-dom"
import "src/styles.css"

export default function Admin() {
  const [memories, setMemories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedImage, setSelectedImage] = useState(null);
  const navigate = useNavigate();
  const API_BASE_URL = "https://ido-cvwh.onrender.com";

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (!token) navigate("/login");

    const fetchMemories = async () => {
      try {
        const res = await axios.get(`${API_BASE_URL}/api/memories`, {
          headers: { 
            Authorization: `Bearer ${token}`
          },
          withCredentials: true
        });
        
        const formattedMemories = res.data.map(memory => ({
          ...memory,
          images: memory.images.map(img => 
            `data:${img.contentType};base64,${img.data}`
          )
        }));
        
        setMemories(formattedMemories);
      } catch (error) {
        console.error("Fetch error:", error);
        navigate("/login");
      } finally {
        setLoading(false);
      }
    };

    fetchMemories();
    const interval = setInterval(fetchMemories, 30000);
    return () => clearInterval(interval);
  }, [navigate]);

  const handleDownload = (base64Data) => {
    try {
      const [header, data] = base64Data.split(',');
      const contentType = header.split(':')[1].split(';')[0];
      const filename = `memory-${Date.now()}.${contentType.split('/')[1]}`;
      
      const byteCharacters = atob(data);
      const byteArrays = [];
      
      for (let offset = 0; offset < byteCharacters.length; offset += 512) {
        const slice = byteCharacters.slice(offset, offset + 512);
        const byteNumbers = new Array(slice.length);
        
        for (let i = 0; i < slice.length; i++) {
          byteNumbers[i] = slice.charCodeAt(i);
        }
        
        byteArrays.push(new Uint8Array(byteNumbers));
      }
      
      const blob = new Blob(byteArrays, { type: contentType });
      const url = window.URL.createObjectURL(blob);
      
      const a = document.createElement('a');
      a.href = url;
      a.download = filename;
      document.body.appendChild(a);
      a.click();
      window.URL.revokeObjectURL(url);
      document.body.removeChild(a);
    } catch (error) {
      console.error("Download error:", error);
      alert('Error downloading image. Please try again.');
    }
  };

  const handleLogout = () => {
    localStorage.removeItem("token");
    navigate("/login");
  }

  const handleImageClick = (image) => {
    setSelectedImage(image)
  }

  const closeModal = () => {
    setSelectedImage(null)
  }

  if (loading) return <div className="loading">Loading...</div>

  return (
    <div className="main-container">
      <div className="header">
        <h1 className="title">Admin Dashboard</h1>
        <button onClick={handleLogout} className="logout-button">
          Log Out
        </button>
      </div>
      <div className="memory-grid">
        {memories.map((memory) =>
          memory.images.map((image, index) => (
            <div key={`${memory._id}-${index}`} className={`memory-card color-${index % 3}`}>
              <div className="image-container" onClick={() => handleImageClick(image)}>
              <img 
                src={image} 
                alt={`Memory ${index + 1}`} 
                className="memory-image" 
                onClick={() => handleImageClick(image)}
              />
              </div>
              <div className="card-content">
                <h2 className="memory-title">Memory {index + 1}</h2>
                <p className="memory-info">
                  <span className="info-icon">👤</span> Name: {memory.name || "Anonymous"}
                </p>
                <p className="memory-info">
                  <span className="info-icon">💬</span> Message: {memory.message || "No message provided"}
                </p>
                <div className="card-footer">
                  <div className="indicator-dots">
                    <span className="dot"></span>
                    <span className="dot"></span>
                    <span className="dot"></span>
                  </div>
                  <button onClick={() => handleDownload(image)} className="download-button">
                    Download
                  </button>
                </div>
              </div>
            </div>
          )),
        )}
      </div>

      {/* Image Modal */}
      {selectedImage && (
        <div className="modal-overlay" onClick={closeModal}>
          <div className="modal-content" onClick={(e) => e.stopPropagation()}>
            <button className="close-button" onClick={closeModal}>✖</button>
            <img src={selectedImage} alt="Selected Memory" className="modal-image" />
          </div>
        </div>
      )}
    </div>
  )
}
