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
    toast,
    closeToastButton,
    toastText,
] = [
        document.getElementById('bmpOutputPathInput'),
        document.getElementById('bmpOutputPathButton'),
        document.getElementById('shatterMapInput'),
        document.getElementById('bmpOutputSubmit'),
        document.getElementById('bmpInputTextInput'),
        document.getElementById('bmpInputButton'),
        document.getElementById('shatterMapOutput'),
        document.getElementById('shatterMapOutputCopyButton'),
        document.getElementById('toast'),
        document.getElementById('closeToastButton'),
        document.getElementById('toastText'),
    ];

let toastDismissTimeout = null;

function dismissToast() {
    toast.classList.remove('success');
    toast.classList.remove('error');
    if (toastDismissTimeout) {
        clearTimeout(toastDismissTimeout);
        toastDismissTimeout = null;
    }
}

function showToast(type, text) {
    const desiredClass = (() => {
        switch (type) {
            case 'success':
                return 'success';
            case 'error':
                return 'error';
        }
    })();
    toast.classList.remove('success');
    toast.classList.remove('error');
    toast.classList.add(desiredClass);

    const toastDismissTime = 5000;
    if (toastDismissTimeout) {
        clearTimeout(toastDismissTimeout);
    }
    toastDismissTimeout = setTimeout(dismissToast, toastDismissTime);
    toastText.innerText = text;
}

closeToastButton.addEventListener('click', () => dismissToast());

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
    showToast('success', `Wrote BMP to ${bmpOutputPathInput.value} successfully.`);
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
        showToast('error', `File at ${selectedPath} doesn't exist.`);
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
    showToast('success', 'Copied to clipboard');
});

window.onerror = (errorMessage, _s, _l, _c, error) => {
    console.error(error.stack);
    showToast('error', errorMessage);
};
