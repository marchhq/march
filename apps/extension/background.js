chrome.action.onClicked.addListener((tab) => {
    // Send a message to the content script to get the heading and URL
    chrome.tabs.sendMessage(tab.id, { action: 'getPageData' }, (response) => {
        if (response) {
            const { heading, url } = response;
            console.log("saju: ", response);
            // Send data to your backend to create an issue
            createIssue(heading, url);
        }
    });
});

function createIssue(title, url) {
    fetch('http://localhost:8080/api/issues', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({
            title,
            description: url
        })
    }).then(response => {
        if (response.ok) {
            console.log('Issue created successfully!');
        } else {
            console.error('Failed to create issue.');
        }
    });
}
