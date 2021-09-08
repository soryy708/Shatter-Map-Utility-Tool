const bmpConversion = require('./bmpConversion');
const toast = require('./toast');

toast.init();
bmpConversion.init();

window.onerror = (errorMessage, _s, _l, _c, error) => {
    console.error(error.stack);
    toast.showToast('error', errorMessage);
};
