// This is the download app icon
function findDownloadAppsIconWrapper(stopElement) {
	let downloadAppsSVG = document.querySelector(
		'[data-list-item-id="guildsnav___app-download-button"]'
	);

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
	console.log('-> Started to search for download button');
	setTimeout(function () {
		// Getting the top element in the SideBar and using that as a stopper for the loops.
		// This will make sure that if we cant find the data, then it wont run forever.
		let sideBar = document.querySelector('[data-list-id="guildsnav"]');
		if (sideBar) {
			const foundDownloadIcon = findDownloadAppsIconWrapper(sideBar);
			const foundGuildSeperator = findGuildSepeartor(sideBar);

			foundDownloadIcon !== undefined
				? foundDownloadIcon.hidden = true
				: console.log('Download icon could not be found!');

			foundGuildSeperator !== undefined
				? foundGuildSeperator.hidden = true
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
	if (e.target) {
		// check if its the button that is clicked or if its the div inside the button
		const clicked =
			e.target.nodeName === 'BUTTON' ? e.target : e.target.parentElement;

		if (
			clicked &&
			clicked.nodeName === 'BUTTON' &&
			clicked.getAttribute('type') === 'submit' &&
			/^.*?\bbutton-\b.*?\blookFilled-\b.*?colorRed-\b.*?sizeMedium-\b.*?grow-\b.*?$/.test(
				clicked.className
			)
		) {
			removed = false;
			tryRemoveAppIcon();
		}
	}
});
