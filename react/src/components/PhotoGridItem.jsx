import { useState } from 'react';
import '../App.css';

function PhotoGridItem({ post, handlePhotoClick }) {
	const [parkName, setParkName] = useState('');

	function handleDetailClick() {
		handlePhotoClick(post);
	}

	fetch(`/api/parks/${post.park_id}`)
		.then((res) => res.json())
		.then((data) => setParkName(data.name));

	return (
		<div>
			<img
				onClick={handleDetailClick}
				src={post.photo_url}
				alt={post.title}
				className='mt-2 rounded object-cover w-60 h-60'
			/>
			<p className='font-sans text-md font-semibold text-green-700'>💛 {post.likes} Likes</p>
			<></>
			<a
      href={`http://localhost:5173/parks/${post.park_id}`}
      className='font-sans text-xs font-semibold text-green-700 hover:underline'
      >
      {parkName}
      </a>
		</div>
	);
}

export default PhotoGridItem;
