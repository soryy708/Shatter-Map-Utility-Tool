const [
    toast,
    closeToastButton,
    toastText,
] = [
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


function init() {
    closeToastButton.addEventListener('click', () => dismissToast());
}

module.exports = {
    init,
    showToast,
};
