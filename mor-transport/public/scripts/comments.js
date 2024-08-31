document.addEventListener('DOMContentLoaded', function() {
    const commentBox = document.querySelector('.comment-box');
    const sendButton = document.querySelector('.send-button');
    const commentsList = document.querySelector('.comments-list');

    // Check if elements exist
    if (!commentBox || !sendButton || !commentsList) {
        console.error('One or more required elements are missing from the DOM');
        return; 
    }

    sendButton.addEventListener('click', function() {
        const commentText = commentBox.value.trim();
        if (commentText === '') {
            alert('Please write a comment before sending.');
            return;
        }

        const newComment = document.createElement('div');
        newComment.className = 'comment';
        newComment.textContent = commentText;

        commentsList.appendChild(newComment);
        commentBox.value = '';

        alert('Thanks for you Valuable Feedback, We always looking forward to your response.');
    });

    commentBox.addEventListener('keypress', function(e) {
        if (e.key === 'Enter') {
            sendButton.click();
        }
    });
});