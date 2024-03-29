// NewPhotoForm.js

import React, { useState } from 'react';

function NewPhotoForm({ user }) {
	const [selectedPark, setSelectedPark] = useState('');
	const [caption, setCaption] = useState('');
	const [file, setFile] = useState(null);
	const [successMessage, setSuccessMessage] = useState('');
	const [failMessage, setFailMessage] = useState('');
	const [loading, setLoading] = useState(false);

	const parks = [
		'Arches National Park',
		'Badlands National Park',
		'Big Bend National Park',
		'Biscayne National Park',
		'Black Canyon of the Gunnison National Park',
		'Bryce Canyon National Park',
		'Canyonlands National Park',
		'Capitol Reef National Park',
		'Carlsbad Caverns National Park',
		'Channel Islands National Park',
		'Congaree National Park',
		'Crater Lake National Park',
		'Cuyahoga Valley National Park',
		'Death Valley National Park',
		'Denali National Park',
		'Dry Tortugas National Park',
		'Everglades National Park',
		'Gates of the Arctic National Park',
		'Gateway Arch National Park',
		'Glacier Bay National Park',
		'Glacier National Park',
		'Grand Canyon National Park',
		'Grand Teton National Park',
		'Great Basin National Park',
		'Great Sand Dunes National Park',
		'Great Smoky Mountains National Park',
		'Guadalupe Mountains National Park',
		'Haleakalā National Park',
		'Hawaiʻi Volcanoes National Park',
		'Hot Springs National Park',
		'Indiana Dunes National Park',
		'Isle Royale National Park',
		'Joshua Tree National Park',
		'Katmai National Park',
		'Kenai Fjords National Park',
		'Kings Canyon National Park',
		'Kobuk Valley National Park',
		'Lake Clark National Park',
		'Lassen Volcanic National Park',
		'Mammoth Cave National Park',
		'Mesa Verde National Park',
		'Mount Rainier National Park',
		'National Park of American Samoa',
		'New River Gorge National Park and Preserve',
		'North Cascades National Park',
		'Olympic National Park',
		'Petrified Forest National Park',
		'Pinnacles National Park',
		'Redwood National Park',
		'Rocky Mountain National Park',
		'Saguaro National Park',
		'Sequoia National Park',
		'Shenandoah National Park',
		'Theodore Roosevelt National Park',
		'Virgin Islands National Park',
		'Voyageurs National Park',
		'White Sands National Park',
		'Wind Cave National Park',
		'Wrangell—St. Elias National Park',
		'Yellowstone National Park',
		'Yosemite National Park',
		'Zion National Park',
	];

	function handleSubmit(e) {
		e.preventDefault();
		setLoading(true);

		const formData = new FormData();
		formData.append('file', file);
		formData.append(
			'json_data',
			JSON.stringify({
				caption: caption,
				user_id: user.id,
				park_id: parks.indexOf(selectedPark) + 1,
			})
		);

		fetch('/api/upload', {
			method: 'POST',
			body: formData,
		})
			.then((response) => {
				if (!response.ok) {
					throw new Error(`HTTP error! Status: ${response.status}`);
				}

				return response.json();
			})
			.then((data) => {
				console.log('Post uploaded:', data);
				setSuccessMessage('Post successful!');
				setFailMessage('');
			})
			.catch((error) => {
				console.error('Error uploading post:', error);
				setFailMessage(
					'Post failed. File cannot be read. Must select a park. Try again.'
				);
				setSuccessMessage('');
			})
			.finally(() => {
				setLoading(false);
				setCaption('');
				setSelectedPark('');
				setFile(null);
			});
	}

	return (
		<div className='mt-4'>
			<form className='mt-4'>
				<input
					type='file'
					accept='image/png, image/jpeg'
					name='photo'
					className='block mb-3 text-sm text-green-700
					file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold
					file:bg-yellow-500 file:text-green-700 file:hover:bg-green-700 file:hover:text-yellow-500'
					onChange={(e) => setFile(e.target.files[0])}
				/>
				<input
					type='text'
					placeholder='Caption'
					rows='2'
					className='block p-1 w-full text-m font-sans text-gray-900 bg-gray-50 rounded-lg border border-gray-300 focus:ring-green-700'
					name='caption'
					value={caption}
					onChange={(e) => setCaption(e.target.value)}
				/>
				<select
					value={selectedPark}
					onChange={(e) => setSelectedPark(e.target.value)}
					className='block py-2.5 px-0 w-full text-sm text-green-700 bg-transparent border-0 border-b-2 border-gray-200 appearance-none dark:text-green-700 dark:border-gray-700 focus:outline-none focus:ring-0 focus:border-gray-200 peer'>
					<option
						value=''
						disabled>
						Select a park
					</option>
					{parks.map((park) => (
						<option
							key={park}
							value={park}>
							{park}
						</option>
					))}
				</select>
				<button
					type='submit'
					onClick={handleSubmit}
					disabled={loading}
					className='bg-green-700 hover:bg-yellow-500 text-white font-bold py-2 px-4 rounded-full mt-4'>
					{loading ? 'Posting...' : 'Post'}
				</button>
			</form>
			<h2>
				{successMessage && (
					<span className='text-green-500 font-sans'>{successMessage}</span>
				)}
			</h2>
			<h2>
				{failMessage && (
					<span className='text-red-500 font-sans'>{failMessage}</span>
				)}
			</h2>
		</div>
	);
}

export default NewPhotoForm;
