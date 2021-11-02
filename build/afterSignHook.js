// See: https://medium.com/@TwitterArchiveEraser/notarize-electron-apps-7a5f988406db

require('dotenv').config();
const fs = require('fs');
const path = require('path');
const electron_notarize = require('electron-notarize');
const package = require('../package.json');

module.exports = async function (params) {
	// Only notarize the app on Mac OS.
	if (process.platform !== 'darwin') {
		return;
	}

	// Only notarize the app when APPLE_ID and APPLE_ID_PASSWORD env vars are set
	if (!process.env.APPLE_ID || !process.env.APPLE_ID_PASSWORD) {
		console.log('Apple credentials not found, skipping notarization');
		return;
	}

	const appId = package.build.appId;

	const appPath = path.join(params.appOutDir, `${params.packager.appInfo.productFilename}.app`);

	if (!fs.existsSync(appPath)) {
		throw new Error(`Cannot find application at: ${appPath}`);
	}

	console.log(`Notarizing ${appId} found at ${appPath}`);

	await electron_notarize.notarize({
		appBundleId: appId,
		appPath: appPath,
		appleId: process.env.APPLE_ID,
		appleIdPassword: process.env.APPLE_ID_PASSWORD,
	});

	console.log(`Done notarizing ${appId}`);
};
