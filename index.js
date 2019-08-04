const {app, BrowserWindow, dialog} = require('electron');
const path = require('path');
const http = require('http');
const https = require('https');
const fs = require('fs');
const url = require("url");
let mainWindow;
const createWindow = () => {
    mainWindow = new BrowserWindow({
        width: 1920,
        height: 1080
    });
    mainWindow.loadFile('www/index.html');

    const out = dialog.showOpenDialogSync(mainWindow, {
        title: 'Select Media Dump Location...',
        defaultPath: require('os').homedir(),
        buttonLabel: 'Select',
        properties: ['openDirectory']
    })[0];

    const saveFile = URI => {
        (URI.startsWith('https://') ? https : http).get(URI, response => response.pipe(fs.createWriteStream(path.join(out, path.basename(url.parse(URI).pathname)))));
    };
    const onHeadersReceived = (details, c) => {
        if (details.responseHeaders['x-frame-options']) {
            delete details.responseHeaders['x-frame-options'];
        }
        if (details.responseHeaders['content-security-policy']) {
            delete details.responseHeaders['content-security-policy'];
        }
        c({cancel: false, responseHeaders: details.responseHeaders});
        switch (details.resourceType) {
            case 'image':
            case 'media':
                saveFile(details.url);
                break;
            case 'other':
                if (details.responseHeaders['content-type']) {
                    switch (details.responseHeaders['content-type'][0]) {
                        case 'video/mp4':
                        case 'video/x-flv':
                        case 'application/x-mpegURL':
                        case 'video/MP2T':
                        case 'video/3gpp':
                        case 'video/quicktime':
                        case 'video/x-msvideo':
                        case 'video/x-ms-wmv':
                        case 'application/vnd.amazon.ebook':
                        case 'text/csv':
                        case 'application/msword':
                        case 'application/vnd.openxmlformats-officedocument.wordprocessingml.document':
                        case 'application/epub+zip':
                        case 'text/calendar':
                        case 'application/java-archive':
                        case 'audio/midi':
                        case 'video/mpeg':
                        case 'application/vnd.oasis.opendocument.presentation':
                        case 'application/vnd.oasis.opendocument.spreadsheet':
                        case 'application/vnd.oasis.opendocument.text':
                        case 'audio/ogg':
                        case 'video/ogg':
                        case 'application/ogg':
                        case 'application/pdf':
                        case 'application/vnd.ms-powerpoint':
                        case 'application/vnd.openxmlformats-officedocument.presentationml.presentation':
                        case 'application/x-rar-compressed':
                        case 'application/rtf':
                        case 'image/svg+xml':
                        case 'application/x-shockwave-flash':
                        case 'application/x-tar':
                        case 'image/tiff':
                        case 'application/typescript':
                        case 'application/vnd.visio':
                        case 'audio/x-wav':
                        case 'audio/webm':
                        case 'video/webm':
                        case 'image/webp':
                        case 'application/vnd.ms-excel':
                        case 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet':
                        case 'application/zip':
                        case 'video/3gpp2':
                        case 'application/x-7z-compressed':
                            saveFile(details.url);
                    }
                }
                break;
            default:
                break;
        }
    };
    mainWindow.webContents.session.webRequest.onHeadersReceived({}, onHeadersReceived);
    mainWindow.on('closed', function () {
        mainWindow.removeAllListeners();
        mainWindow = null;
    });
};
app.on('ready', createWindow);
app.on('window-all-closed', () => {
    if (process.platform !== 'darwin') {
        app.quit();
    }
});
app.on('activate', () => {
    if (mainWindow === null) {
        createWindow();
    }
});


