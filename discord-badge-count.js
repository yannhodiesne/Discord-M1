function updateBadge() {
	let badges = document.querySelector('.scroller-1Bvpku').getElementsByClassName('numberBadge-2s8kKX');
	let total = 0;

	for (let i = 0; i < badges.length; i++) {
		total = total + parseInt(badges[i].innerHTML, 10);
	}

	if (total > 0) {
		window.electron.setBadge(total);
	} else {
		var pills = document.querySelector('.scroller-1Bvpku').getElementsByClassName('item-2hkk8m');
        
		var showDot = false;

		for (var j = 0; j < pills.length; j++) {
			if (pills[j].offsetHeight === 8) {
				showDot = true;
				break;
			}
		}

		if (showDot) {
			window.electron.setBadge('\u2022');
		} else {
			window.electron.setBadge('');
		}
	}
}

function periodicalCheck() {
	updateBadge();

	setTimeout(function () {
		periodicalCheck();
	}, 5000);
}

var mutationObserver = new MutationObserver(function () {
	updateBadge();
});

function onload() {
	const scroller = document.querySelector('.scroller-1Bvpku');

	mutationObserver.observe(scroller, {
		attributes: true,
		characterData: true,
		childList: true,
		subtree: true,
		attributeOldValue: true,
		characterDataOldValue: true
	});

	periodicalCheck();
}

function maybeLoad() {
	try {
		onload();
	} catch (error) {
		setTimeout(function () {
			maybeLoad();
		}, 1000);
	}
}

maybeLoad();
