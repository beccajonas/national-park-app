function FollowerDisplay({ followers, setSeeFollowers }) {
	return (
		<button
			className='bg-green-700 hover:bg-yellow-500 text-white font-bold py-2 px-4 rounded-full mb-4'
			onClick={() => setSeeFollowers(false)}>
			Go back
		</button>
	);
}

export default FollowerDisplay;
