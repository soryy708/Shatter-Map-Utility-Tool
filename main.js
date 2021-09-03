const { app, BrowserWindow } = require('electron')

function createWindow() {
    const mainWindow = new BrowserWindow({
        width: 852,
        height: 480,
        webPreferences: {
            nodeIntegration: true,
            contextIsolation: false,
            enableRemoteModule: true,
        },
        resizable: true,
        title: 'Shatter Map Utility Tool',
    });

    mainWindow.setMenu(null);
    mainWindow.loadFile('index.html');
}

app.whenReady().then(() => {
    createWindow();

    app.on('activate', function () {
        if (BrowserWindow.getAllWindows().length === 0) {
            createWindow();
        }
    })
});

app.on('window-all-closed', function () {
    if (process.platform !== 'darwin') {
        app.quit();
    }
});
