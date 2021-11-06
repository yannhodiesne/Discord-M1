const { ipcRenderer, remote } = require('electron');

let promptWindow;

const openScreenSelection = async (resolve, reject) => {
	try {
		if (!promptWindow?.isDestroyed() ?? false) {
			promptWindow?.close();
		}

		const BrowserWindow = remote.BrowserWindow;

		promptWindow = new BrowserWindow({
			height: 400,
			width: 800,
			resizable: false,
			movable: false,
			minimizable: false,
			maximizable: false,
			alwaysOnTop: true,
			fullscreen: false,
			fullscreenable: false,
			show: false,
			backgroundColor: '#2F3136',
			titleBarStyle: 'hiddenInset',
			webPreferences: {
				nodeIntegration: true,
				contextIsolation: false,
				enableBlinkFeatures: 'CSSColorSchemeUARendering',
			},
		});

		promptWindow.loadFile('windows/getDisplayMedia/getDisplayMedia.html');

		remote.ipcMain.once('resolve-desktop-stream', async (e, source) => {
			console.log({ source });
			const stream = await window.navigator.mediaDevices.getUserMedia(source);

			resolve(stream);
		});

		// shows when ready
		promptWindow.once('ready-to-show', () => {
			promptWindow.show();
			promptWindow.focus();
		});
	} catch (err) {
		console.error('Error displaying desktop capture sources:', err);
		reject(err);
	}
};

if (window.navigator.mediaDevices) {
	window.navigator.mediaDevices.getDisplayMedia = () => {
		return new Promise((resolve, reject) => {
			ipcRenderer.send('checkScreenPermission', {});

			if (remote.systemPreferences.getMediaAccessStatus('screen') === 'granted') {
				openScreenSelection(resolve, reject);
			} else {
				reject(new Error('Discord does not have the permission to share the screen'));
			}
		});
	};
}
