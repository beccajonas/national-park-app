import { useState, useEffect } from 'react';
import CommentDisplay from './CommentDisplay';

function PostDetails({ user, post, setSelectedPost }) {
	const [editMode, setEditMode] = useState(false);
	const [caption, setCaption] = useState(post.caption);
	const [editedPost, setEditedPost] = useState(post);
	const [comments, setComments] = useState(post.comments);
	const [deletedPost, setDeletedPost] = useState(null);

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

	function handleDeleteButtonClick(e) {
		e.preventDefault();

		fetch(`/api/posts/${post.id}`, {
			method: 'DELETE',
			headers: {
				'Content-type': 'application/json',
			},
		})
			.then((data) => console.log(data))
			.then(setDeletedPost(true));
	}

	return (
		<div>
			<button
				className='bg-green-700 hover:bg-yellow-500 text-white font-bold py-2 px-4 rounded-full mt-4'
				onClick={() => setSelectedPost(null)}>
				Go back
			</button>
			{deletedPost ? (
				<div>
					<h1>Post deleted 💔</h1>
				</div>
			) : (
				<div>
					<img
						src={post.photo_url}
						alt={post.caption}
						className='relative mt-2 rounded object-cover w-120 h-80 top-0 right-0'
					/>
					{editMode ? (
						<input
							type='text'
							rows='2'
							className='block p-1 w-full text-m font-sans text-gray-900 bg-gray-50 rounded-lg border border-gray-300 focus:ring-green-700'
							placeholder='Write your thoughts here...'
							value={caption}
							onChange={(e) => setCaption(e.target.value)}
						/>
					) : (
						<p className='mt-4 text-green-700 font-semibold font-sans'>
							{caption}
						</p>
					)}
					<p className='font-sans text-md font-semibold text-green-700'>
						💛 {post.likes} Likes
					</p>
					<div>
						<p className='font-sans text-green-900'>
							<em class='font-italic'>Comments:</em>
						</p>

						{comments.map((comment) => (
							<CommentDisplay
								key={comment.id}
								comment={comment}
							/>
						))}
					</div>
					<button
						className='bg-green-700 hover:bg-yellow-500 text-white font-bold py-2 px-4 rounded-full mt-4'
						onClick={handleEditButtonClick}>
						{editMode ? 'Save' : 'Edit'}
					</button>
					{editMode ? (
						<button
							className='bg-red-700 hover:bg-red-400 text-white hover:text-black font-bold py-2 px-4 rounded-full mt-4'
							onClick={handleDeleteButtonClick}>
							Delete
						</button>
					) : null}
				</div>
			)}
		</div>
	);
}

export default PostDetails;
