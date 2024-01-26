import { useState, useEffect } from 'react';
import '../../src/index.css';
import PhotoGridItem from '../components/PhotoGridItem';
import PostDetails from '../components/PostDetails';
import NewPhotoForm from '../components/NewPhotoForm';
import FollowerDisplay from '../components/FollowerDisplay';

function UserProfile({ user }) {
	const [userPosts, setUserPosts] = useState([]);
	const [selectedPost, setSelectedPost] = useState(null);
	const [addPhoto, setAddPhoto] = useState(false);
	const [profilePic, setProfilePic] = useState('');
	const [bio, setBio] = useState('');
	const [followers, setFollowers] = useState([]);
	const [seeFollowers, setSeeFollowers] = useState(false);

	useEffect(() => {
		fetch(`/api/users/${user.id}`)
			.then((res) => res.json())
			.then((data) => {
				setUserPosts(data.posts);
				setProfilePic(data.profile_pic_url);
				setBio(data.bio);
				setFollowers(data.followers);
			})
			.catch((error) => console.error('Error fetching posts:', error));
	}, [selectedPost, addPhoto]);

	function handlePhotoClick(clickedPost) {
		setSelectedPost(clickedPost);
	}

	function handleFollowerListClick() {
		setSeeFollowers(true);
		console.log('click');
	}

	function handleAddPhotoClick() {
		console.log('click');
		setAddPhoto(!addPhoto);
	}

	return (
		<div className='mx-auto max-w-4xl'>
			<div className='mt-4 mx-auto max-w-4xl pb-4 flex items-center'>
				<img
					className='w-20 h-20 rounded object-cover'
					src={profilePic}
					alt='Medium avatar'
				/>
				<h1 className='text-3xl font-bold text-green-700 ml-4'>
					📸 {user.username}'s Profile
				</h1>
			</div>
			<div className='flex items-center'>
				<p className='font-sans font-bold text-green-700 mb-4'>{bio} |</p>
				<p className='font-sans font-bold text-green-700 mb-4 ml-1'>
					{userPosts.length} posts |
				</p>
				<p
					onClick={() => handleFollowerListClick()}
					className='font-sans font-bold text-green-700 mb-4 ml-1'>
					{followers.length} followers
				</p>
			</div>
			{seeFollowers ? (
				<FollowerDisplay
					followers={followers}
					setSeeFollowers={setSeeFollowers}
				/>
			) : (
				<>
					{selectedPost ? null : (
						<button
							className='bg-green-700 hover:bg-yellow-500 text-white font-bold py-2 px-4 rounded-full mb-4'
							onClick={handleAddPhotoClick}>
							{addPhoto ? 'Go back' : 'Add photo'}
						</button>
					)}
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
				</>
			)}
		</div>
	);
}
export default UserProfile;
