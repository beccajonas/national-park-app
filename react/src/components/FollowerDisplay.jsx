function FollowerDisplay({ user, setSeeFollowers }) {
	console.log(user);

	return (
		<>
			<button
				className='bg-green-700 hover:bg-yellow-500 text-white font-bold py-2 px-4 rounded-full mb-4'
				onClick={() => setSeeFollowers(false)}>
				Go back
			</button>

			<div className='flex flex-col'>
				{user.followers.map((follower) => (
					<div
						key={follower.id}
						className='flex items-center m-4 hover:bg-green-700 hover:bg-opacity-25'>
						<div className='w-20 h-20 rounded-full overflow-hidden'>
							<img
								src={follower.profile_pic_url}
								alt={follower.username}
								className='w-full h-full object-cover'
							/>
						</div>
						<h3 className='ml-2 font-sans'>{follower.username}</h3>
					</div>
				))}
			</div>
		</>
	);
}

export default FollowerDisplay;
