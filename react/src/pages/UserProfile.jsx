import { useState, useEffect } from 'react';
import '../../src/index.css';
import PhotoGridItem from '../components/PhotoGridItem';
import PostDetails from '../components/PostDetails';
import NewPhotoForm from '../components/NewPhotoForm';

function UserProfile({ user }) {
	const [userPosts, setUserPosts] = useState([]);
	const [selectedPost, setSelectedPost] = useState(null);
	const [addPhoto, setAddPhoto] = useState(false);

	useEffect(() => {
		fetch(`http://localhost:5555/users/${user.id}`)
			.then((res) => res.json())
			.then((data) => setUserPosts(data.posts))
			.catch((error) => console.error('Error fetching posts:', error));
	}, [selectedPost, addPhoto]);

	function handlePhotoClick(clickedPost) {
		setSelectedPost(clickedPost);
	}

	function handleAddPhotoClick() {
		console.log('click');
		setAddPhoto(!addPhoto);
	}

	return (
		<div className='mt-4 mx-auto max-w-4xl p-4'>
			<h1 className='text-2xl font-bold text-red-500'>
				{user.username}'s profile
			</h1>
			<button
				className='bg-green-700 hover:bg-yellow-500 text-white font-bold py-2 px-4 rounded-full'
				onClick={handleAddPhotoClick}>
				{addPhoto ? 'Go back' : 'Add photo'}
			</button>
			{addPhoto ? (
				<NewPhotoForm user={user} />
			) : selectedPost ? (
				<PostDetails
					post={selectedPost}
					setSelectedPost={setSelectedPost}
					user={user}
				/>
			) : (
				<div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 justify-center items-center'>
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
