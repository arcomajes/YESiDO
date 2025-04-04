import { Card, CardContent } from "src/components/cards";
import { MapPin, Heart, Calendar } from "lucide-react";
import 'src/styles.css';
import React, { useState, useEffect } from "react";
import axios from "axios";
//test push
export default function Dashboard() {
  const [name, setName] = useState("");
  const [images, setImages] = useState([]);
  const [message, setMessage] = useState("");
  const [validationError, setValidationError] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [notification, setNotification] = useState({ show: false, message: "", type: "" });
  const API_BASE_URL = "https://yesido.onrender.com"; // Ensure this is correct

  // Auto-hide notification after 5 seconds
  useEffect(() => {
    if (notification.show) {
      const timer = setTimeout(() => {
        setNotification({ ...notification, show: false });
      }, 5000);
      return () => clearTimeout(timer);
    }
  }, [notification]);
  
  // Create falling elements (hearts and leaves)
  useEffect(() => {
    const createFallingElement = () => {
      const element = document.createElement('div');
      const isHeart = Math.random() > 0.5;
      
      if (isHeart) {
        element.innerHTML = '❤️';
        element.style.fontSize = `${Math.random() * 20 + 10}px`;
      } else {
        // Create a leaf element with brownish-yellowish color
        element.innerHTML = '🍂'; // Using a brown leaf emoji
        element.style.fontSize = `${Math.random() * 15 + 8}px`;
        // Add a filter to make it more brownish-yellowish
        element.style.filter = 'sepia(100%) hue-rotate(320deg) saturate(150%)';
      }
      
      element.style.position = 'fixed';
      element.style.top = '-20px';
      element.style.left = `${Math.random() * 100}vw`;
      element.style.opacity = '0';
      element.style.zIndex = '10';
      element.style.pointerEvents = 'none';
      element.style.animation = `float ${Math.random() * 10 + 10}s linear forwards`;
      element.style.animationDelay = `${Math.random() * 5}s`;
      
      document.body.appendChild(element);
      
      // Remove the element after animation completes
      setTimeout(() => {
        document.body.removeChild(element);
      }, 15000);
    };
    
    // Create elements at intervals
    const interval = setInterval(createFallingElement, 300);
    
    return () => clearInterval(interval);
  }, []);
  
  const handleSubmit = async (e) => {
    e.preventDefault();
    
    // Reset validation error
    setValidationError("");
    
    // Only validate that images are uploaded
    if (images.length === 0) {
      setValidationError("Please upload at least one image");
      return;
    }
    
    // Set submitting state to true
    setIsSubmitting(true);
  
    const formData = new FormData();
    // Use "Anonymous" if name is blank, otherwise use the provided name
    formData.append("name", name.trim() || "Anonymous");
    images.forEach((image) => formData.append("images", image.file));
    // Use empty string if message is blank
    formData.append("message", message.trim() || "");
  
    try {
      await axios.post(`${API_BASE_URL}/upload`, formData, {
        headers: { 
          "Content-Type": "multipart/form-data",
        },
      });
      // Show success notification
      setNotification({
        show: true,
        message: "Memory uploaded successfully!",
        type: "success"
      });
      setName("");
      setImages([]);
      setMessage("");
    } catch (err) {
      // Show error notification
      setNotification({
        show: true,
        message: "Upload failed. Please try again.",
        type: "error"
      });
    } finally {
      // Reset submitting state
      setIsSubmitting(false);
    }
  };
  
  // Update image state management
  const handleImageUpload = (e) => {
    const files = Array.from(e.target.files).map(file => ({
      file,
      preview: URL.createObjectURL(file)
    }));
    
    if (files.length + images.length > 10) {
      setNotification({
        show: true,
        message: "Maximum 10 images allowed",
        type: "error"
      });
      return;
    }
    
    setImages(prev => [...prev, ...files]);
  };
  

  const weddingDetails = {
    couple: {
      name1: "Kevin",
      name2: "Estrel",
    },
    date: "April 6, 2025",
    day: "Saturday",
    time: "2:30 PM",
    ceremonyLocation: "St. Mary's Cathedral",
    ceremonyAddress: "123 Wedding Lane, Cityville",
    receptionLocation: "Grand Ballroom, Luxury Hotel",
    receptionAddress: "456 Celebration Ave, Cityville",
  };

  return (
    <div className="min-h-screen bg-red-800 text-white">
      {/* Falling Elements Container */}
      <div id="falling-elements" style={{ 
        position: 'fixed', 
        top: 0, 
        left: 0, 
        width: '100%', 
        height: '100%', 
        pointerEvents: 'none', 
        zIndex: 10,
        overflow: 'hidden'
      }}></div>
      
      {/* Notification Component */}
      {notification.show && (
        <div 
          style={{
            position: 'fixed',
            top: '20px',
            right: '20px',
            padding: '15px 20px',
            borderRadius: '5px',
            backgroundColor: notification.type === 'success' ? '#10b981' : '#ef4444',
            color: 'white',
            boxShadow: '0 4px 6px rgba(0, 0, 0, 0.1)',
            zIndex: 1000,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            minWidth: '300px',
            maxWidth: '500px',
            animation: 'slideIn 0.3s ease-out'
          }}
        >
          <span>{notification.message}</span>
          <button 
            onClick={() => setNotification({ ...notification, show: false })}
            style={{ 
              background: 'none', 
              border: 'none', 
              color: 'white', 
              cursor: 'pointer',
              fontSize: '18px',
              marginLeft: '10px'
            }}
          >
            ×
          </button>
        </div>
      )}
      
      {/* Main Content */}
      <div className="p-6 md:p-10 overflow-auto w-full" style={{ position: 'relative', zIndex: 1 }}>
        <div className="max-w-5xl mx-auto">
          
          {/* Hero Section */}
          <section id="overview" className="mb-16">
  <div className="overview-hero">   
    <img
      src="/images/bg.jpg"
      alt="Wedding Background"
      className="overview-hero-image"
    />
    <div className="hero-gradient">
      <div className="hero-content">
        <h1>Join Our Greatest Adventure</h1>
        <p>We invite you to celebrate our wedding day</p>
        <div className="overlay-text">Kevin & Estrel</div>
        
      </div>
    </div>
  </div>

            {/* Photos Section */}
<section id="photos" className="mb-16">
  <div className="section-header">
  <div className="divider"></div>
    <h2>Photos</h2>
    <div className="divider"></div>
  </div>
  <div className="photo-upload-card">
    <p className="text-center text-gray-700">
      Share your photos from our special day using our wedding hashtag:
    </p>
    <div className="hashtag-display">#KevinAndEstrelWedding</div>
    <div className="upload-form">
      <h2>Upload Memories</h2>
      <form onSubmit={handleSubmit}>
        {validationError && (
          <div className="validation-error" style={{ color: 'red', marginBottom: '15px', textAlign: 'center' }}>
            {validationError}
          </div>
        )}
        <div className="form-group" style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-start' }}>
          <label style={{ marginBottom: '5px' }}>Name:</label>
          <input 
            type="text" 
            className="form-control" 
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="Leave blank for Anonymous"
            style={{ width: '100%' }}
          />
        </div>
        <div className="form-group" style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-start' }}>
          <label style={{ marginBottom: '5px' }}>Message/wishes:</label>
          <textarea 
            className="form-control" 
            rows="3"
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            placeholder="Leave blank if no message"
            style={{ width: '100%' }}
          ></textarea>
        </div>
        <div className="form-group" style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-start' }}>
          <label style={{ marginBottom: '5px' }}>Upload Images: <span style={{ color: 'red' }}>*</span></label>
          <div className="file-input-container" style={{ width: '100%' }}>
            <label className="file-input-label">
              Click to select photos
              <input 
                type="file" 
                className="file-input" 
                multiple 
                onChange={handleImageUpload}
              />
            </label>
          </div>
          <div className="image-preview-grid">
            {images.map((img, index) => (
              <img 
                key={index} 
                src={img.preview} 
                className="image-preview" 
                alt={`Preview ${index + 1}`}
                onLoad={() => URL.revokeObjectURL(img.preview)}
              />
            ))}
          </div>
        </div>
        
        <button 
          type="submit" 
          className="submit-btn" 
          disabled={isSubmitting}
          style={{ 
            backgroundColor: isSubmitting ? '#b91c1c' : '#7f1d1d',
            transition: 'background-color 0.3s ease',
            cursor: isSubmitting ? 'not-allowed' : 'pointer',
            opacity: isSubmitting ? 0.8 : 1
          }}
        >
          {isSubmitting ? 'Uploading...' : 'Upload Memory'}
        </button>
      </form>
    </div>
  </div>
</section>

  <div className="grid-container">
    {/* Wedding Date Card */}
    <Card id="schedule" className="card">
      <CardContent className="card-content">
        <Calendar className="card-icon" />
        <h3>Wedding Date</h3>
        <p>{weddingDetails.date}</p>
        <p>{weddingDetails.day}</p>
      </CardContent>
    </Card>

    {/* Locations Card */}
    <Card className="card">
      <CardContent className="card-content">
        <MapPin className="card-icon" />
        <h3>Locations</h3>
        <p>Ceremony & Reception</p>
        <p className="text-sm">See details below</p>
      </CardContent>
    </Card>
  </div>
</section>

          {/* Footer */}
          <footer className="footer">
            <div className="footer-hearts"></div>
            <p>Kevin & Estrel Wedding</p>
            <p>April 6, 2025 | Cityville</p>
            <p>
              Made with <Heart className="heart-icon" /> for our special day
            </p>
          </footer>
        </div>
      </div>
      
      {/* Add CSS for the falling animation */}
      <style jsx>{`
        @keyframes float {
          0% { transform: translateY(0) rotate(0deg); opacity: 0; }
          10% { opacity: 0.8; }
          100% { transform: translateY(100vh) rotate(360deg); opacity: 0; }
        }
      `}</style>
    </div>
  );
}