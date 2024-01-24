import React from "react";
import "../App.css";


function PhotoGridItem({ post, handlePhotoClick }) {

  function handleDetailClick() {
    handlePhotoClick(post)
  }

  return (
    <div className="bg-gray-200 p-4 rounded h-80 w-80">
      <h2 className="text-lg font-semibold">{post.title}</h2>
      <img onClick={handleDetailClick} src={post.photo_url} alt={post.title} className="mt-2 rounded object-cover w-60 h-60" />
      <button>♥{post.likes}</button>
    </div>
  );
};

export default PhotoGridItem;