document.getElementById("createButton").addEventListener("click", async () => {
    const title = document.getElementById("title").value;
    const description = document.getElementById("description").value;

    // Get the active tab URL
    const [tab] = await chrome.tabs.query({ active: true, currentWindow: true });
    const url = tab.url;

    // Send data to your backend API
    createIssue(title, description, url);
});

function createIssue(title, description, url) {
    fetch('http://localhost:3000/api/issues', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({
            title,
            description,
            url
        })
    }).then(response => {
        if (response.ok) {
            alert('Issue created successfully!');
        } else {
            alert('Failed to create issue.');
        }
    });
}
