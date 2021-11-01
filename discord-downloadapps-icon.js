// This is the download app icon
function findDownloadAppsIconWrapper(stopElement) {
	let downloadAppsSVG = document.querySelector('[aria-label="Download Apps"]');

	while (
		downloadAppsSVG !== null &&
		downloadAppsSVG.parentElement !== null &&
		downloadAppsSVG.parentElement !== stopElement
	) {
		if (
			downloadAppsSVG.parentElement.nodeName === 'DIV' &&
			downloadAppsSVG.parentElement.className.includes('listItem-')
		) {
			return downloadAppsSVG.parentElement;
		}
		downloadAppsSVG = downloadAppsSVG.parentElement;
	}
}

// This is the small line above download apps.
function findGuildSepeartor(startElement) {
	let parentOfGuildSeperator = null;
	for (let i = 0; i < startElement.children.length; i++) {
		const child = startElement.children[i];

		if (child.className.includes('scroller-')) {
			parentOfGuildSeperator = child;
			break;
		}
	}

	if (parentOfGuildSeperator) {
		for (let i = 0; i < parentOfGuildSeperator.children.length; i++) {
			const child = parentOfGuildSeperator.children[i];
			if (
				child.firstChild &&
				child.firstChild.className.includes('guildSeparator-')
			) {
				return child;
			}
		}
	}
	return undefined;
}

let removed = false;
function tryRemoveAppIcon() {
	setTimeout(function () {
		// Getting the top element in the SideBar and using that as a stopper for the loops.
		// This will make sure that if we cant find the data, then it wont run forever.
		let sideBar = document.querySelector('[data-list-id="guildsnav"]');
		if (sideBar) {
			const foundDownloadIcon = findDownloadAppsIconWrapper(sideBar);
			const foundGuildSeperator = findGuildSepeartor(sideBar);

			foundDownloadIcon !== undefined
				? foundDownloadIcon.remove()
				: console.log('Download icon could not be found!');

			foundGuildSeperator !== undefined
				? foundGuildSeperator.remove()
				: console.log('Guild Seperator could not be found!');

			if (
				foundDownloadIcon === undefined &&
				foundGuildSeperator === undefined
			) {
				removed = true;
			}
		}

		if (!removed) {
			tryRemoveAppIcon();
		}
	}, 250);
}

tryRemoveAppIcon();

document.addEventListener('click', (e) => {
	// when the user clicks log out then start searching again!
	if (
		e.target &&
		e.target.getAttribute('type') === 'submit' &&
		e.target.innerText.trim() === 'Log Out'
	) {
		removed = false;
		tryRemoveAppIcon();
	}
});
