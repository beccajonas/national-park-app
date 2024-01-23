import React, { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import "../App.css";

const ParkProfiles = () => {
  const [parkData, setParkData] = useState(null);
  const { id } = useParams(); // Extract the ID from URL

  useEffect(() => {
    // Function to fetch park data
    const fetchParkData = async () => {
      try {
        const response = await fetch(`http://localhost:5555/parks/${id}`);
        const data = await response.json();
        setParkData(data);
      } catch (error) {
        console.error("Error fetching park data:", error);
      }
    };

    fetchParkData();
  }, [id]);

  // Render park data or a loading message
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
        </div>
      ) : (
        <p>Loading park details...</p>
      )}
    </div>
  );
};

export default ParkProfiles;
