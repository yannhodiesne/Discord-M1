new MutationObserver(function (mutationList) {
	mutationList.forEach((mutation) => {
		if (mutation.attributeName == 'class' && mutation.target.classList.contains('platform-web')) {
			mutation.target.classList.remove('platform-web');
			mutation.target.classList.add('platform-osx');
		}
	});
}).observe(document.documentElement, {
	attributes: true,
	characterData: false,
	childList: false
});
