const { app, BrowserWindow, dialog, shell, ipcMain } = require('electron');
const windowStateKeeper = require('electron-window-state');
const {
	hasScreenCapturePermission,
	openSystemPreferences,
} = require('mac-screen-capture-permissions');
const { autoUpdater } = require('electron-updater');

const fs = require('fs');
const path = require('path');

// https://discuss.atom.io/t/how-to-catch-the-event-of-clicking-the-app-windows-close-button-in-electron-app/21425
let win;
let willQuitApp;

// Create window
function createWindow() {
	// Window state
	let mainWindowState = windowStateKeeper({
		defaultWidth: 1000,
		defaultHeight: 800,
	});

	// Create the browser window.
	win = new BrowserWindow({
		icon: path.join(__dirname, 'icon.icns'),
		x: mainWindowState.x,
		y: mainWindowState.y,
		width: mainWindowState.width,
		height: mainWindowState.height,
		minWidth: 350,
		minHeight: 100,
		titleBarStyle: 'hiddenInset',
		// hide until ready
		show: false,
		// Enables DRM
		webPreferences: {
			plugins: true,
			nodeIntegration: false,
			contextIsolation: false,
			sandbox: true,
		},
	});

	// Load the preloads scripts
	win.webContents.session.setPreloads([
		path.join(__dirname, 'preload-badge-count.js'),
		path.join(__dirname, 'preload-get-display-media-polyfill.js'),
	]);

	// Bypass browser permission checks
	win.webContents.session.setPermissionCheckHandler(async () => {
		return true;
	});

	win.webContents.session.setPermissionRequestHandler(
		async (webContents, permission, callback) => {
			callback(true);
		}
	);

	// Let us register listeners on the window, so we can update the state
	// automatically (the listeners will be removed when the window is closed)
	// and restore the maximized or full screen state
	mainWindowState.manage(win);
	// hides toolbar
	win.setMenuBarVisibility(false);
	// allows you to open toolbar by pressing alt
	win.setAutoHideMenuBar(true);

	win.loadURL('https://discord.com/app', {
		userAgent:
			'Mozilla/5.0 (Macintosh; Intel Mac OS X 11_6) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/95.0.4638.54 Safari/537.36',
	});

	// Inject custom JavaScript into Discord
	const filesToInject = [
		'discord-badge-count.js',
		'discord-context-menu.js',
		'discord-platform-osx.js',
		'discord-downloadapps-icon.js',
	];

	filesToInject.forEach((file) => {
		let injectFilePath = path.join(process.resourcesPath, file);

		if (!fs.existsSync(injectFilePath)) injectFilePath = `./${file}`;

		fs.readFile(injectFilePath, 'utf-8', (_, data) => {
			win.webContents.executeJavaScript(data);
		});
	});

	win.webContents.setWindowOpenHandler(({ url }) => {
		shell.openExternal(url);

		return {
			action: 'deny',
		};
	});

	// shows when ready
	win.once('ready-to-show', () => {
		win.show();
	});

	// Mirror behaviour of real app by only hiding the window
	win.on('close', (e) => {
		if (willQuitApp) {
			/* the user tried to quit the app */
			win = null;
		} else {
			/* the user only tried to close the window */
			e.preventDefault();
			win.hide();
		}
	});
}

let checkedForUpdate = false;

autoUpdater.on('update-available', ({ version }) => {
	if (checkedForUpdate) return;

	checkedForUpdate = true;

	setTimeout(() => {
		// Remind in 24 hours
		checkedForUpdate = false;
	}, 24 * 60 * 60 * 1000);

	dialog
		.showMessageBox(win, {
			type: 'info',
			buttons: ['Yes', 'Later'],
			defaultId: 0,
			cancelId: 1,
			title: 'Update available',
			detail: `A new version of Discord-M1 is available, would you like to check it out on GitHub ?\n\nCurrent version: ${app.getVersion()}\nLatest version: ${version}`,
		})
		.then(({ response }) => {
			if (response === 0)
				shell.openExternal(
					'https://github.com/yannhodiesne/Discord-M1/releases'
				);
		});
});

app.whenReady().then(() => {
	autoUpdater.autoDownload = false;
	autoUpdater.autoInstallOnAppQuit = false;

	autoUpdater.checkForUpdates();

	setInterval(() => {
		if (checkedForUpdate) return;

		autoUpdater.checkForUpdates();
	}, 60 * 60 * 1000);

	createWindow();
});

// Show the window again once user clicks on dock icon
app.on('activate', () => {
	win.show();
});

/* 'before-quit' is emitted when Electron receives
 * the signal to exit and wants to start closing windows */
app.on('before-quit', () => (willQuitApp = true));

ipcMain.on('checkScreenPermission', async () => {
	if (!hasScreenCapturePermission()) {
		await openSystemPreferences();
	}
});

ipcMain.on('updateBadgeCount', (e, args) => {
	app.dock.setBadge(String(args.count));
});
