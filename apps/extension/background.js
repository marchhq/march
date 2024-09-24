chrome.action.onClicked.addListener((tab) => {
    // Check if auth token exists in local storage
    chrome.storage.local.get(["authToken"], (result) => {
      const authToken = result.authToken;
      console.log("authToken: ", authToken);
  
      if (!authToken) {
        console.log("hry");
        // If no token
        chrome.tabs.create({ url: "http://localhost:8080/login" });
      } else {
        // If token exists, proceed with creating the issue
        chrome.scripting.executeScript(
          {
            target: { tabId: tab.id },
            function: getPageInfo,
          },
          (results) => {
            if (results && results[0].result) {
              const { url, title } = results[0].result;
              createIssue(url, title, authToken);
            }
          }
        );
      }
    });
  });
  
  // Function to get the current page's URL and title
  function getPageInfo() {
    return {
      url: window.location.href,
      title: document.title,
    };
  }
  
  // Function to create the issue using the stored auth token
  async function createIssue(url, title, authToken) {
    try {
      const response = await fetch("http://localhot:8080/item/create", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${authToken}`,
        },
        body: JSON.stringify({
          title: title,
          url: url,
          content: `Captured URL: ${url}`,
        }),
      });
  
      if (response.ok) {
        console.log("Issue created successfully");
      } else {
        console.error("Failed to create issue:", response.statusText);
        // Handle invalid token (e.g., if the token has expired)
        if (response.status === 401) {
          chrome.storage.local.remove("authToken", () => {
            alert("Authentication expired. Please log in again.");
            chrome.tabs.create({ url: "https://your-app.com/login" });
          });
        }
      }
    } catch (error) {
      console.error("Error creating issue:", error);
    }
  }
