const { ipcRenderer } = require('electron');

window.electron = {
	setBadge : (count) => ipcRenderer.send('updateBadgeCount', { count }),
};
