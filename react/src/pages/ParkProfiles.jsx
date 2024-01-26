// ParkProfiles.jsx

import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import CommentSection from '../components/CommentSection';
import Heart from 'react-animated-heart';

const ParkProfiles = ({ user }) => {
	const [parkData, setParkData] = useState(null);
	const [posts, setPosts] = useState([]);
	const [heartClicked, setHeartClicked] = useState({});
	const { id } = useParams();

	useEffect(() => {
		const fetchParkData = async () => {
			try {
				const response = await fetch(`/api/parks/${id}`);
				const data = await response.json();
				setParkData(data);
			} catch (error) {
				console.error('Error fetching park data:', error);
			}
		};

		const fetchPosts = async () => {
			try {
				const response = await fetch(`/api/posts/park/${id}`);
				const data = await response.json();

				const heartClickedInit = {};
				data.forEach((post) => {
					const liked = localStorage.getItem(`liked-${post.id}`) === 'true';
					heartClickedInit[post.id] = liked;
				});
				setHeartClicked(heartClickedInit);

				setPosts(data);
			} catch (error) {
				console.error('Error fetching posts:', error);
			}
		};

		fetchParkData();
		fetchPosts();
	}, [id]);

	const handleLike = async (postId) => {
		try {
			const post = posts.find((p) => p.id === postId);
			const isLiked = heartClicked[postId];
			const updatedLikes = post.likes + (isLiked ? -1 : 1);

			const response = await fetch(`/api/posts/${postId}`, {
				method: 'PATCH',
				headers: {
					'Content-Type': 'application/json',
				},
				body: JSON.stringify({ likes: updatedLikes }),
			});

			if (response.ok) {
				setPosts(
					posts.map((p) =>
						p.id === postId ? { ...p, likes: updatedLikes } : p
					)
				);
				setHeartClicked({ ...heartClicked, [postId]: !isLiked });

				localStorage.setItem(`liked-${postId}`, !isLiked);
			}
		} catch (error) {
			console.error('Error updating likes:', error);
		}
	};

	return (
		<div className='text-center'>
			{parkData ? (
				<div>
					<h3 className='photo-title text-2xl font-semibold mb-3'>
						{parkData.name}
					</h3>
					<p className='photo-description text-lg mb-4'>
						{parkData.description}
					</p>
					{parkData.imageUrl && (
						<img
							src={parkData.imageUrl}
							alt={parkData.name}
							className='w-full h-auto mb-4'
						/>
					)}
					<div className='posts-container'>
						{posts.map((post) => (
							<div
								key={post.id}
								className='post mb-6'>
								<div className='image-container'>
									<img
										src={post.photo_url}
										alt={post.caption}
										className='w-400 h-400 mb-2'
										style={{ width: '1000px', height: '500px' }}
									/>
								</div>
								<p className='photo-caption text-lg mb-2'>{post.caption}</p>
								<div className='flex items-center justify-center mb-2'>
									<Heart
										isClick={heartClicked[post.id]}
										onClick={() => handleLike(post.id)}
									/>
									<p className='ml-[1px] font-bold'>{post.likes} Likes</p>
								</div>
								<CommentSection
									postId={post.id}
									userId={post.user_id}
									user={user}
								/>
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
