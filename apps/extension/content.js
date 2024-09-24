// Capture the main heading of the page (h1 or fallback to title)

window.addEventListener("message", (event) => {
    console.log("there im i");
	if (event.source !== window) {
		return;
	}
    console.log("saj: ", event);
    console.log("saje: ", event.data);
	const jwt = event.data.token;

	if (jwt) {
		if (
			!(
				window.location.hostname === "localhost" ||
				window.location.hostname === "march.cat" ||
				window.location.hostname === "app.march.cat"
			)
		) {
			console.log(
				"JWT is only allowed to be used on localhost or supermemory.ai",
			);
			return;
		}

		chrome.storage.local.set({ jwt }, () => {});
	}
});
