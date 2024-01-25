import { useState } from 'react';
import '../App.css';

function PhotoGridItem({ post, handlePhotoClick }) {
	const [parkName, setParkName] = useState('');

	function handleDetailClick() {
		handlePhotoClick(post);
	}

	fetch(`http://localhost:5555/parks/${post.park_id}`)
		.then((res) => res.json())
		.then((data) => setParkName(data.name));

	return (
		<div>
			<h2 className='text-lg font-semibold'>{post.title}</h2>
			<img
				onClick={handleDetailClick}
				src={post.photo_url}
				alt={post.title}
				className='mt-2 rounded object-cover w-60 h-60'
			/>
			<button>♥{post.likes}</button>
			<></>
			<a href={`http://localhost:5173/parks/${post.park_id}`}>{parkName}</a>
		</div>
	);
}

export default PhotoGridItem;
