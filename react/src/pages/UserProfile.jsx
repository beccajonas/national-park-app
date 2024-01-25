// UserProfile

import { useState, useEffect } from "react";
import "../../src/index.css";
import PhotoGridItem from "../components/PhotoGridItem";
import PostDetails from "../components/PostDetails";

function UserProfile({ user }) {
  const [userPosts, setUserPosts] = useState([]);
  const [selectedPost, setSelectedPost] = useState(null);

  useEffect(() => {
    fetch(`http://localhost:5555/users/${user.id}`)
      .then((res) => res.json())
      .then((data) => setUserPosts(data.posts))
      .catch((error) => console.error("Error fetching posts:", error));
  }, []);

  console.log(addPhoto);

  useEffect(() => {
    fetch(`http://localhost:5555/users/${user.id}`)
      .then((res) => res.json())
      .then((data) => setUserPosts(data.posts))
      .catch((error) => console.error("Error fetching posts:", error));
  }, [selectedPost, addPhoto]);

  function handlePhotoClick(clickedPost) {
    setSelectedPost(clickedPost);
    console.log("click");
  }

  function handleAddPhotoClick() {
    console.log("click");
    setAddPhoto(!addPhoto);
    console.log(addPhoto);
  }

  function handleSubmit(e) {
    e.preventDefault();
    console.log("click");

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
      })
      .catch((error) => {
        console.error("Error uploading post:", error);
      });
  }

  return (
    <div>
      <h1 className="text-2xl font-bold text-red-500">
        {user.username}'s profile
      </h1>
      {selectedPost ? (
        <PostDetails
          post={selectedPost}
          setSelectedPost={setSelectedPost}
          user={user}
        />
      ) : (
        <div className="grid grid-cols-3 gap-4 mt-4">
          {userPosts.map((post) => (
            <PhotoGridItem
              key={post.id}
              post={post}
              handlePhotoClick={handlePhotoClick}
            />
          ))}
        </div>
      )}
    </div>
  );
}

export default UserProfile;
