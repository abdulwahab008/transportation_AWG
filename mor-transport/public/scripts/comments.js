document.addEventListener('DOMContentLoaded', function() {
    // Select elements
    const commentBox = document.querySelector('.comment-box');
    const sendButton = document.querySelector('.send-button');
    const commentsList = document.querySelector('.comments-list');

    // Add click event listener to the "Send" button
    sendButton.addEventListener('click', function() {
        // Get the comment text
        const commentText = commentBox.value.trim();

        // Validate input
        if (commentText === '') {
            alert('Please write a comment before sending.');
            return;
        }

        // Create a new comment element
        const newComment = document.createElement('div');
        newComment.className = 'comment';
        newComment.textContent = commentText;

        // Append the new comment to the comments list
        commentsList.appendChild(newComment);

        // Clear the comment box
        commentBox.value = '';

        // Optionally, provide feedback to the user
        alert('Your comment has been added!');
    });

    // Optional: Handle Enter key press for comment submission
    commentBox.addEventListener('keypress', function(e) {
        if (e.key === 'Enter') {
            sendButton.click();
        }
    });
});
