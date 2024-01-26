import React, { useState } from 'react';

function SignUpForm({
	handleSignUp,
	setFirstName,
	setLastName,
	setSignupUsername,
	setSignupPassword,
	firstName,
	lastName,
	signupUsername,
	signupPassword,
	setSignupFail,
	setLoginFailed,
}) {
	function handleSignUpSubmit(e) {
		e.preventdefault();
		handleSignUp({ firstName, lastName, signupUsername, signupPassword });
	}

	return (
		<form onSubmit={handleSignUpSubmit}>
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
		</form>
	);
}

export default SignUpForm;
