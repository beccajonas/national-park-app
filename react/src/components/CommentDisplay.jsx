import { useState, useEffect } from 'react';

function CommentDisplay({ comment }) {
	console.log(comment);
	return (
		<>
			<p className='font-sans'>
				<strong>{comment.user.username} | </strong> {comment.comment_text}
			</p>
		</>
	);
}

export default CommentDisplay;
