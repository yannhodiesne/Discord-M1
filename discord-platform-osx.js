onHTMLTagChange(); // Call instantly

new MutationObserver(onHTMLTagChange).observe(document.documentElement, {
	attributes: true,
	childList: true,
});

function onHTMLTagChange() {
	if (document.documentElement.classList.contains('platform-web')) {
		document.documentElement.classList.remove('platform-web');
		document.documentElement.classList.add('platform-osx');
	}
}
