import {useState, useEffect} from "react";

function PostDetails({ user, post, setSelectedPost }) {
  const [editMode, setEditMode] = useState(false)
  const [caption, setCaption] = useState(post.caption)
  const [editedPost, setEditedPost] = useState(post)
  console.log(post.id);

  useEffect(() => {
    fetch(`http://localhost:5555/posts/${post.id}`)
    .then(res => res.json())
    .then(data => setEditedPost(data))
  }, [caption])

  function handleEditButtonClick() {
    setEditMode(!editMode)

    const updatedPost = {
      "id" : post.id,
      "caption" : caption,
      "likes": post.likes,
      "photo_url": post.photo_url,
      "user_id": user.id,
      "park_id": post.park_id
    }

    fetch(`http://localhost:5555/posts/${post.id}`, {
      method: 'PATCH',
      headers: {"content-type": "application/json"},
      body: JSON.stringify(updatedPost)
    })
    .then(res => res.json())
    .then(data => console.log(data))
  }

    
  return (
    <div>
    <button className="bg-green-700 hover:bg-yellow-500 text-white font-bold py-2 px-4 rounded-full mt-4" onClick={() => setSelectedPost(null)}>Go back</button>
      <h1 className="text-2xl font-bold text-red-500">{post.title}</h1>
      <img src={post.photo_url} alt={post.title} className="mt-4 rounded" />
      {editMode ? 
        <input
        type="text"
        className="textare" 
        value={caption}
        onChange={(e) => setCaption(e.target.value)}
      /> 
      : <p className="mt-4">{caption}</p>}
      <p className="mt-4">{post.likes}</p>
      <button className="bg-green-700 hover:bg-yellow-500 text-white font-bold py-2 px-4 rounded-full mt-4" onClick={handleEditButtonClick}>
      {editMode? 'Save' : 'Edit' }
  </button>
    </div>
  );
}

export default PostDetails;