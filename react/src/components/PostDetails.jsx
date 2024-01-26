import { useState, useEffect } from 'react';

function PostDetails({ user, post, setSelectedPost, handlePhotoClick }) {
	const [editMode, setEditMode] = useState(false);
	const [caption, setCaption] = useState(post.caption);
	const [editedPost, setEditedPost] = useState(post);

	useEffect(() => {
		fetch(`/api/posts/${post.id}`)
			.then((res) => res.json())
			.then((data) => setEditedPost(data));
	}, [caption]);

	function handleEditButtonClick() {
		setEditMode(!editMode);

		const updatedPost = {
			id: post.id,
			caption: caption,
			likes: post.likes,
			photo_url: post.photo_url,
			user_id: user.id,
			park_id: post.park_id,
		};

		fetch(`/api/posts/${post.id}`, {
			method: 'PATCH',
			headers: { 'content-type': 'application/json' },
			body: JSON.stringify(updatedPost),
		})
			.then((res) => res.json())
			.then((data) => console.log(data));
	}

	return (
		<div>
			<button
				className='bg-green-700 hover:bg-yellow-500 text-white font-bold py-2 px-4 rounded-full mt-4'
				onClick={() => setSelectedPost(null)}>
				Go back
			</button>
			<img
				src={post.photo_url}
				alt={post.caption}
				className='relative mt-2 rounded object-cover w-120 h-80 top-0 right-0'
			/>
			{editMode ? (
				<input
				type='text'
				rows="2" 
				className="block p-1 w-full text-m font-sans text-gray-900 bg-gray-50 rounded-lg border border-gray-300 focus:ring-green-700"
				placeholder="Write your thoughts here..."
				value={caption}
				onChange={(e) => setCaption(e.target.value)}
			  />
			) : (
				<p className='mt-4 text-green-700 font-semibold font-sans'>{caption}</p>
			)}
			<p className='font-sans text-md font-semibold text-green-700'>💛 {post.likes} Likes</p>
			<button
				className='bg-green-700 hover:bg-yellow-500 text-white font-bold py-2 px-4 rounded-full mt-4'
				onClick={handleEditButtonClick}>
				{editMode ? 'Save' : 'Edit'}
			</button>
		</div>
	);
}

export default PostDetails;
