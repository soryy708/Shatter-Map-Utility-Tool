const fs = require('fs');
const path = require('path');
const electron = require('electron');
const encode = require('./encode');
const decode = require('./decode');

const [
    bmpOutputPathInput,
    bmpOutputPathBrowseButton,
    shatterMapInputElement,
    bmpOutputSubmitButton,
    bmpInputBrowseTextInput,
    bmpInputBrowseButton,
    shatterMapOutputElement,
    shatterMapOutputCopyButton,
] = [
        document.getElementById('bmpOutputPathInput'),
        document.getElementById('bmpOutputPathButton'),
        document.getElementById('shatterMapInput'),
        document.getElementById('bmpOutputSubmit'),
        document.getElementById('bmpInputTextInput'),
        document.getElementById('bmpInputButton'),
        document.getElementById('shatterMapOutput'),
        document.getElementById('shatterMapOutputCopyButton'),
    ];

bmpOutputPathBrowseButton.addEventListener('click', async () => {
    const { canceled, filePath: selectedPath } = await electron.remote.dialog.showSaveDialog({
        title: 'Bitmap file',
        buttonLabel: 'Save',
        filters: [{ name: 'Bitmaps', extensions: ['bmp', 'dib'] }],
        properties: ['openFile', 'createDirectory', 'showOverwriteConfirmation'],
        message: 'Select a bitmap file',
        defaultPath: bmpInputBrowseTextInput.value || process.cwd(),
    });
    if (canceled) {
        return;
    }
    bmpOutputPathInput.value = selectedPath;
});

bmpOutputSubmitButton.addEventListener('click', async () => {
    if (!bmpOutputPathInput.value || !shatterMapInputElement.value) {
        return;
    }
    await fs.promises.mkdir(path.dirname(bmpOutputPathInput.value), { recursive: true });
    const encodedData = encode(shatterMapInputElement.value.split('\n'));
    await fs.promises.writeFile(bmpOutputPathInput.value, encodedData.data);
});

bmpInputBrowseButton.addEventListener('click', async () => {
    const { canceled, filePaths: selectedPaths } = await electron.remote.dialog.showOpenDialog({
        title: 'Bitmap file',
        buttonLabel: 'Open',
        filters: [{ name: 'Bitmaps', extensions: ['bmp', 'dib'] }],
        properties: ['openFile'],
        message: 'Select a bitmap file',
        defaultPath: bmpInputBrowseTextInput.value || process.cwd(),
    });
    if (canceled || selectedPaths.length !== 1) {
        return;
    }
    const selectedPath = selectedPaths[0];
    if (!fs.existsSync(selectedPath)) {
        return;
    }
    bmpInputBrowseTextInput.value = selectedPath;
    const bitmapFile = await fs.promises.readFile(selectedPath);
    const decodedData = decode(bitmapFile);
    shatterMapOutputElement.value = decodedData.join('\n');
});

shatterMapOutputCopyButton.addEventListener('click', () => {
    shatterMapOutputElement.select();
    document.execCommand('copy');
});
