const { desktopCapturer, dialog, ipcRenderer } = require('electron');

desktopCapturer.getSources({ types: ['screen', 'window'] }).then((sources) => {
	const sourcesList = document.querySelector('.desktop-capturer-selection__list');

	sources.forEach(({ id, name, thumbnail }) => {
		const li = document.createElement('li');
		li.className = 'desktop-capturer-selection__item';

		const button = document.createElement('button');
		button.className = 'desktop-capturer-selection__btn';
		button.title = name;
		button.dataset.id = id;

		const img = document.createElement('img');
		img.className = 'desktop-capturer-selection__thumbnail';
		img.src = thumbnail.toDataURL();

		const span = document.createElement('span');
		span.className = 'desktop-capturer-selection__name';
		span.textContent = name;

		button.appendChild(img);
		button.appendChild(span);

		li.appendChild(button);

		sourcesList.appendChild(li);
	});

	document.querySelectorAll('.desktop-capturer-selection__btn')
		.forEach(button => {
			button.addEventListener('click', async () => {
				try {
					const id = button.getAttribute('data-id');
					const source = sources.find(source => source.id === id);

					if (!source) {
						throw new Error(`Source with id ${id} does not exist`);
					}

					ipcRenderer.send('resolve-desktop-stream', {
						audio: false,
						video: {
							mandatory: {
								chromeMediaSource: 'desktop',
								chromeMediaSourceId: source.id
							}
						}
					});

					window.close();
				} catch (err) {
					console.error('Error selecting desktop capture source:', err);
				}
			});
		});
}).catch((err) => {
	console.error(err);
	dialog.showErrorBox('Discord-M1', 'Unable to load desktop capture sources.\nThis is likely a bug, you can help by reporting it on Github.');
	window.close();
});
