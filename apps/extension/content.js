// Capture the main heading of the page (h1 or fallback to title)
function getHeading() {
    const h1 = document.querySelector('h1');
    return h1 ? h1.innerText : document.title;
}

function getUrl() {
    return window.location.href;
}

chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
    if (request.action === 'getPageData') {
        const heading = getHeading();
        const url = getUrl();
        sendResponse({ heading, url });
    }
});
