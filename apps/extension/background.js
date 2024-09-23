chrome.runtime.onInstalled.addListener(() => {
    chrome.contextMenus.create({
        id: "createIssue",
        title: "Create Issue from Selection",
        contexts: ["selection"]
    });
});

chrome.contextMenus.onClicked.addListener((info) => {
    const selectedText = info.selectionText;

    // Optionally, open the popup with the selected text as the title
    chrome.tabs.create({ url: chrome.runtime.getURL("popup/popup.html") });
});
