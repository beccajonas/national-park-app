import React from "react";

function PostDetails({ post, setSelectedPost }) {
    
  return (
    <div>
    <button onClick={() => setSelectedPost(null)}>Go back</button>
      <h1 className="text-2xl font-bold text-red-500">{post.title}</h1>
      <img src={post.photo_url} alt={post.title} className="mt-4 rounded" />
      <p className="mt-4">{post.caption}</p>
      <p className="mt-4">{post.likes}</p>
      <p className="mt-4">{post.park.name}</p>
    </div>
  );
}

export default PostDetails;