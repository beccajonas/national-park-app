// ParkProfiles.jsx

import React, { useState, useEffect } from "react";
import { useParams } from "react-router-dom";

const ParkProfiles = () => {
  const [parkData, setParkData] = useState(null);
  const [posts, setPosts] = useState([]);
  const { id } = useParams();

  useEffect(() => {
    // Fetch park data
    const fetchParkData = async () => {
      try {
        const response = await fetch(`http://localhost:5555/parks/${id}`);
        const data = await response.json();
        setParkData(data);
        console.log("Park data:", data);
      } catch (error) {
        console.error("Error fetching park data:", error);
      }
    };

    const fetchPosts = async () => {
      try {
        const response = await fetch(`http://localhost:5555/posts/park/${id}`);
        const data = await response.json();
        setPosts(data);
      } catch (error) {
        console.error("Error fetching posts:", error);
      }
    };

    fetchParkData();
    fetchPosts();
  }, [id]);

  // Render park data and related posts
  return (
    <div>
      {parkData ? (
        <div>
          <h3>{parkData.name}</h3>
          <p>{parkData.description}</p>
          {/* Optionally display an image if available */}
          {parkData.imageUrl && (
            <img
              src={parkData.imageUrl}
              alt={parkData.name}
              style={{ width: "100%", height: "auto" }}
            />
          )}
          <div className="posts-container">
            {posts.map((post) => (
              <div key={post.id} className="post">
                <img
                  src={post.photo_url}
                  alt={post.caption}
                  style={{ width: "100%", height: "auto" }}
                />
                <p>{post.caption}</p>
                <p>Likes: {post.likes}</p>
              </div>
            ))}
          </div>
        </div>
      ) : (
        <p>Loading park details...</p>
      )}
    </div>
  );
};

export default ParkProfiles;
