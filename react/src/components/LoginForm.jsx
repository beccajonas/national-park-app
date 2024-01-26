// // SignIn component
// import React, { useState, useEffect } from 'react';

// function LoginForm({
// 	handleLogin,
// 	setLoginFailed,
// 	setUsername,
// 	setPassword,
// 	username,
// 	password,
// }) {
// 	function handleSubmit(e) {
// 		e.preventDefault();
// 		handleLogin({ username, password })
// 			.then(() => {
// 				setUsername('');
// 				setPassword('');
// 			})
// 			.catch(() => {
// 				setLoginFailed(true);
// 			});
// 	}

// 	return (
// 		<form onSubmit={handleSubmit}>
// 			<input
// 				type='text'
// 				placeholder='Username'
// 				className='input-field'
// 				name='username'
// 				value={username}
// 				onChange={(e) => setUsername(e.target.value)}
// 			/>
// 			<input
// 				type='password'
// 				placeholder='Password'
// 				className='input-field'
// 				name='password'
// 				value={password}
// 				onChange={(e) => setPassword(e.target.value)}
// 			/>
// 			<button
// 				type='submit'
// 				className='bg-green-700 hover:bg-yellow-500 text-white font-bold py-2 px-4 rounded-full mt-4'>
// 				Login
// 			</button>
// 		</form>
// 	);
// }

// export default LoginForm;
