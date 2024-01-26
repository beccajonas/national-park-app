// Home.jsx

import { useState, useEffect } from 'react';
import UserProfile from './UserProfile';

function Home({ user, handleLogin, isLoggedin, loginFailed, setLoginFailed }) {
	const [username, setUsername] = useState('');
	const [password, setPassword] = useState('');
	const [firstName, setFirstName] = useState('');
	const [lastName, setLastName] = useState('');
	const [signupUsername, setSignupUsername] = useState('');
	const [signupPassword, setSignupPassword] = useState('');
	const [isReturningUser, setIsReturningUser] = useState(true);
	const [signupFail, setSignupFail] = useState(false);

	function handleSubmit(e) {
		e.preventDefault();
		handleLogin({ username, password })
			.then(() => {
				setUsername('');
				setPassword('');
			})
			.catch(() => {
				setLoginFailed(true);
			});
	}

	function handleReturningUser(e) {
		e.preventDefault();
		setIsReturningUser(!isReturningUser);
	}

	function handleSignUp(e) {
		e.preventDefault();

		const newUser = {
			first_name: firstName,
			last_name: lastName,
			username: signupUsername,
			password: signupPassword,
		};

		fetch('/api/users', {
			method: 'POST',
			headers: {
				'Content-Type': 'application/json',
			},
			body: JSON.stringify(newUser),
		})
			.then((response) => {
				if (response.ok) {
					handleLogin({ username: signupUsername, password: signupPassword })
						.then(() => {
							setFirstName('');
							setLastName('');
							setSignupUsername('');
							setSignupPassword('');
						})
						.catch(() => {
							setLoginFailed(true);
						});
				} else {
					return res.json().then((error) => {
						console.log(error);
						setSignupFail(true);
					});
				}
			})
			.catch((error) => {
				console.error(error.message);
				setSignupFail(true);
			});
	}

	return user ? (
		<div>
			<UserProfile user={user} />
		</div>
	) : isReturningUser ? (
		<div>
			<h1 className='font-black text-green-800 '>Welcome to Park Lens!</h1>
			<form onSubmit={handleSubmit}>
				<input
					type='text'
					placeholder='Username'
					className='block p-1 w-50 text-m font-sans text-green-800 rounded-lg border border-gray-300 focus:ring-green-700'
					name='username'
					value={username}
					onChange={(e) => setUsername(e.target.value)}
				/>
				<input
					type='password'
					placeholder='Password'
					className='block p-1 w-50 text-m font-sans text-green-800 rounded-lg border border-gray-300 focus:ring-green-700'
					name='password'
					value={password}
					onChange={(e) => setPassword(e.target.value)}
				/>
				<button
					type='submit'
					className='bg-green-700 hover:bg-yellow-500 text-white font-sans py-2 px-4 rounded-full'>
					Login
				</button>
				<button
					onClick={handleReturningUser}
					className='bg-green-700 hover:bg-yellow-500 text-white font-sans py-2 px-4 rounded-full'>
					Create account
				</button>
			</form>
			{loginFailed && (
				<div className='login-failed-popup'>
					<p>Login failed. Please try again.</p>
				</div>
			)}
		</div>
	) : (
		<div>
			<h1 className='font-sans'>Welcome to Park Lens!</h1>
			<form onSubmit={handleSignUp}>
				<input
					type='text'
					placeholder='First Name'
					className='block p-1 w-50 text-m font-sans text-green-800 rounded-lg border border-gray-300 focus:ring-green-700'
					name='firstName'
					value={firstName}
					onChange={(e) => setFirstName(e.target.value)}
				/>
				<input
					type='text'
					placeholder='Last Name'
					className='block p-1 w-50 text-m font-sans text-green-800 rounded-lg border border-gray-300 focus:ring-green-700'
					name='lastName'
					value={lastName}
					onChange={(e) => setLastName(e.target.value)}
				/>
				<input
					type='text'
					placeholder='Username'
					className='block p-1 w-50 text-m font-sans text-green-800 rounded-lg border border-gray-300 focus:ring-green-700'
					name='username'
					value={signupUsername}
					onChange={(e) => setSignupUsername(e.target.value)}
				/>
				<input
					type='password'
					placeholder='Password'
					className='block p-1 w-50 text-m font-sans text-green-800 rounded-lg border border-gray-300 focus:ring-green-700'
					name='password'
					value={signupPassword}
					onChange={(e) => setSignupPassword(e.target.value)}
				/>
			</form>
			<button
				onClick={handleSignUp}
				type='submit'
				className='bg-green-700 hover:bg-yellow-500 text-white font-sans py-2 px-4 rounded-full mt-4'>
				Signup
			</button>
			<button
				onClick={handleReturningUser}
				className='bg-green-700 hover:bg-yellow-500 text-white font-sans py-2 px-4 rounded-full m-4'>
				Signin
			</button>
			{signupFail && (
				<div className='login-failed-popup'>
					<p>
						Username must be unique and password cannot be empty. Please try
						again.
					</p>
				</div>
			)}
		</div>
	);
}

export default Home;
