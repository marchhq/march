const frontendURL ='http://localhost:3000'||'https://app.march.cat.com';

  const backendURL ='http://localhost:8080'||'https://sage.march.cat.com';


chrome.action.onClicked.addListener((tab) => {
  chrome.scripting.executeScript({
    target: { tabId: tab.id },
    func: getPageDetails,
  }, (results) => {
    if (results && results[0].result) {
      const { title, url } = results[0].result;
      createIssue(title, url);
    }
  });
});

function getPageDetails() {
  return { title: document.title, url: window.location.href };
}

function createIssue(title, url) {
  // chrome.cookies.get({ url: 'http://localhost:3000', name: '__MARCH_ACCESS_TOKEN__' }, (cookie) => {
  chrome.cookies.get({ url: frontendURL, name: '__MARCH_ACCESS_TOKEN__' }, (cookie) => {

    if (cookie) {
      // fetch("http://localhost:8080/api/items/create/", {
      fetch(`${backendURL}/api/items/create/`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${cookie.value}`
        },
        body: JSON.stringify({ 
          title: title,
          source: "marchClipper",
          type: "url",
          description: url,
          metadata: {
            url: url
        },

         })
      })
      .then(response => response.json())
      .then(data => {
        console.log('Issue created successfully:', data);
      })
      .catch(error => {
        console.error('Error creating issue:', error);
      });
    } else {
      console.error('No auth token found. Please log in.');
    }
  });
}


