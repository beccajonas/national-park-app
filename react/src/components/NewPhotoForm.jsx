// NewPhotoForm.js

import React, { useState } from "react";

function NewPhotoForm({ user }) {
  const [selectedPark, setSelectedPark] = useState("");
  const [caption, setCaption] = useState("");
  const [file, setFile] = useState(null);
  const [successMessage, setSuccessMessage] = useState("");
  const [failMessage, setFailMessage] = useState("");

  const parks = [
    "Arches National Park",
    "Badlands National Park",
    "Big Bend National Park",
    "Biscayne National Park",
    "Black Canyon of the Gunnison National Park",
    "Bryce Canyon National Park",
    "Canyonlands National Park",
    "Capitol Reef National Park",
    "Carlsbad Caverns National Park",
    "Channel Islands National Park",
    "Congaree National Park",
    "Crater Lake National Park",
    "Cuyahoga Valley National Park",
    "Death Valley National Park",
    "Denali National Park",
    "Dry Tortugas National Park",
    "Everglades National Park",
    "Gates of the Arctic National Park",
    "Gateway Arch National Park",
    "Glacier Bay National Park",
    "Glacier National Park",
    "Grand Canyon National Park",
    "Grand Teton National Park",
    "Great Basin National Park",
    "Great Sand Dunes National Park",
    "Great Smoky Mountains National Park",
    "Guadalupe Mountains National Park",
    "Haleakalā National Park",
    "Hawaiʻi Volcanoes National Park",
    "Hot Springs National Park",
    "Indiana Dunes National Park",
    "Isle Royale National Park",
    "Joshua Tree National Park",
    "Katmai National Park",
    "Kenai Fjords National Park",
    "Kings Canyon National Park",
    "Kobuk Valley National Park",
    "Lake Clark National Park",
    "Lassen Volcanic National Park",
    "Mammoth Cave National Park",
    "Mesa Verde National Park",
    "Mount Rainier National Park",
    "National Park of American Samoa",
    "New River Gorge National Park and Preserve",
    "North Cascades National Park",
    "Olympic National Park",
    "Petrified Forest National Park",
    "Pinnacles National Park",
    "Redwood National Park",
    "Rocky Mountain National Park",
    "Saguaro National Park",
    "Sequoia National Park",
    "Shenandoah National Park",
    "Theodore Roosevelt National Park",
    "Virgin Islands National Park",
    "Voyageurs National Park",
    "White Sands National Park",
    "Wind Cave National Park",
    "Wrangell—St. Elias National Park",
    "Yellowstone National Park",
    "Yosemite National Park",
    "Zion National Park"
  ]

  function handleSubmit(e) {
    e.preventDefault();

    const formData = new FormData();
    formData.append("file", file);
    formData.append(
      "json_data",
      JSON.stringify({
        caption: caption,
        user_id: user.id,
        park_id: parks.indexOf(selectedPark) + 1,
      })
    );

    fetch("http://localhost:5555/upload", {
      method: "POST",
      body: formData,
    })
      .then((response) => {
        if (!response.ok) {
          throw new Error(`HTTP error! Status: ${response.status}`);
        }
        return response.json();
      })
      .then((data) => {
        console.log("Post uploaded:", data);
        setSuccessMessage("Post successful!");
        setFailMessage("");
      })
      .catch((error) => {
        console.error("Error uploading post:", error);
        setFailMessage("Post failed. File cannot be read. Must select a park. Try again.");
        setSuccessMessage("");
      });
  }

  return (
    <div>
      <form className="mt-4">
        <input
          type="file"
          accept="image/png, image/jpeg"
          name="photo"
          className="mb-2"
          onChange={(e) => setFile(e.target.files[0])}
        />
        <input
          type="text"
          placeholder="Caption"
          className="input-field mb-2"
          name="caption"
          value={caption}
          onChange={(e) => setCaption(e.target.value)}
        />
        <select
          value={selectedPark}
          onChange={(e) => setSelectedPark(e.target.value)}
          className="input-field mb-2"
        >
          <option value="" disabled>
            Select a park
          </option>
          {parks.map((park) => (
            <option key={park} value={park}>
              {park}
            </option>
          ))}
        </select>
        <button
          type="submit"
          onClick={handleSubmit}
          className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded-full"
        >
          Post
        </button>
      </form>
      <h2>{successMessage && <span className="text-green-500">{successMessage}</span>}</h2>
      <h2>{failMessage && <span className="text-red-500">{failMessage}</span>}</h2>
    </div>
  );
}

export default NewPhotoForm;