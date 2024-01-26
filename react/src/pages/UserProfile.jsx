import { useState, useEffect } from 'react';
import '../../src/index.css';
import PhotoGridItem from '../components/PhotoGridItem';
import PostDetails from '../components/PostDetails';
import NewPhotoForm from '../components/NewPhotoForm';
import FollowerDisplay from '../components/FollowerDisplay';
import logo from '../../images/resized_nature_photography_logo_100x100 (2).png';

function UserProfile({ user }) {
	const [userPosts, setUserPosts] = useState([]);
	const [selectedPost, setSelectedPost] = useState(null);
	const [addPhoto, setAddPhoto] = useState(false);
	const [profilePic, setProfilePic] = useState('');
	const [bio, setBio] = useState('');
	const [followers, setFollowers] = useState([]);
	const [seeFollowers, setSeeFollowers] = useState(false);
	const [editMode, setEditMode] = useState(false);
	const [newBio, setNewBio] = useState('');

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

	function handleEditMode() {
		setEditMode(true);
	}

	function handleAddBio(e) {
		e.preventDefault();
		console.log('click');

		fetch(`/api/users/${user.id}`, {
			method: 'PATCH',
			headers: {
				'content-type': 'application/json',
			},
			body: JSON.stringify({ bio: newBio }),
		})
			.then((res) => res.json())
			.then((data) => {
				console.log(data);
				setBio(newBio); // Update the local state with the new bio
				setEditMode(false); // Exit edit mode after saving
			})
			.catch((error) => console.error('Error updating bio:', error));
	}

	return (
		<div className='mx-auto max-w-4xl'>
			<div className='mt-4 mx-auto max-w-4xl pb-4 flex items-center'>
				<img
					className='w-20 h-20 rounded-full object-cover'
					src={profilePic || logo}
					alt='Medium avatar'
				/>
				<h1 className='text-3xl font-bold text-green-700 ml-4'>
					📸 {user.username}'s Profile
				</h1>
			</div>
			<div className='flex items-center'>
				{bio ? (
					<p className='font-sans font-bold text-green-700 mb-4'>{bio} |</p>
				) : editMode ? (
					<>
						<input
							type='text'
							rows='2'
							className='block p-1 w-60 text-m font-sans text-gray-900 bg-gray-50 rounded-lg border border-gray-300 focus:ring-green-700'
							placeholder='Tell us about yourself...'
							value={newBio}
							onChange={(e) => setNewBio(e.target.value)}
						/>
						<></>
						<button
							className='bg-green-700 hover:bg-yellow-500 text-white font-bold py-2 px-4 rounded-full mb-3'
							onClick={handleAddBio}>
							Save
						</button>
					</>
				) : (
					<button
						className='bg-green-700 hover:bg-yellow-500 text-white font-bold py-2 px-4 rounded-full mb-3'
						onClick={handleEditMode}>
						Add bio
					</button>
				)}

				<p className='font-sans font-bold text-green-700 mb-4 ml-1'>
					{userPosts.length} posts |
				</p>
				<p
					onClick={() => handleFollowerListClick()}
					className='font-sans font-bold text-green-700 hover:text-yellow-500 cursor-pointer mb-4 ml-1'>
					{followers.length} followers
				</p>
			</div>
			{seeFollowers ? (
				<FollowerDisplay
					user={user}
					setSeeFollowers={setSeeFollowers}
				/>
			) : (
				<>
					{selectedPost ? null : (
						<button
							className='bg-green-700 hover:bg-yellow-500 text-white font-bold py-2 px-4 rounded-full mb-3'
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
						<div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 cursor-pointer justify-center items-center'>
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
