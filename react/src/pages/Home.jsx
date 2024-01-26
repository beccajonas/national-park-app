import React, { useState } from 'react';
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
					return response.json().then((error) => {
						console.log(error);
						setSignupFail(true);
					});
				}
			})
			.catch((error) => {
				console.error(error.message);
				alert(error.message);
			});
	}

	return (
		<div className='home-container'>
			{user ? (
				<UserProfile user={user} />
			) : (
				<div className='authentication-container'>
					{isReturningUser ? (
						<form onSubmit={handleSubmit}>
							<input
								type='text'
								placeholder='Username'
								className='input-field'
								name='username'
								value={username}
								onChange={(e) => setUsername(e.target.value)}
							/>
							<input
								type='password'
								placeholder='Password'
								className='input-field'
								name='password'
								value={password}
								onChange={(e) => setPassword(e.target.value)}
							/>
							<button
								type='submit'
								className='bg-green-700 hover:bg-yellow-500 text-white font-bold py-2 px-4 rounded-full mt-4'>
								Login
							</button>
							<button
								onClick={handleReturningUser}
								className='bg-green-700 hover:bg-yellow-500 text-white font-bold py-2 px-4 rounded-full mt-4'>
								Create account
							</button>
						</form>
					) : (
						<form onSubmit={handleSignUp}>
							<input
								type='text'
								placeholder='First Name'
								className='input-field'
								name='firstName'
								value={firstName}
								onChange={(e) => setFirstName(e.target.value)}
							/>
							<input
								type='text'
								placeholder='Last Name'
								className='input-field'
								name='lastName'
								value={lastName}
								onChange={(e) => setLastName(e.target.value)}
							/>
							<input
								type='text'
								placeholder='Username'
								className='input-field'
								name='signupUsername'
								value={signupUsername}
								onChange={(e) => setSignupUsername(e.target.value)}
							/>
							<input
								type='password'
								placeholder='Password'
								className='input-field'
								name='signupPassword'
								value={signupPassword}
								onChange={(e) => setSignupPassword(e.target.value)}
							/>
							<button
								type='submit'
								className='bg-green-700 hover:bg-yellow-500 text-white font-bold py-2 px-4 rounded-full mt-4'>
								Signup
							</button>
							<button
								onClick={handleReturningUser}
								className='bg-green-700 hover:bg-yellow-500 text-white font-bold py-2 px-4 rounded-full mt-4'>
								Signin
							</button>
						</form>
					)}
				</div>
			)}
			{loginFailed && (
				<div className='login-failed-popup'>
					<p>Login failed. Please try again.</p>
				</div>
			)}
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
