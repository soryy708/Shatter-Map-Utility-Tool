const bmp = require('bmp-js');

function decode(data) {
    const decodedBmp = bmp.decode(data);
    const { width, height } = decodedBmp;
    const decodedData = decodedBmp.getData();
    const charTable = [];
    for (let i = 0; i < width * height; ++i) {
        const column = i % width;
        const byte = decodedData.readUint8(i * 4 + 1);
        if (column === 0) {
            charTable.push([]);
        }
        const mappedValue = (() => {
            if (byte === 0x00) {
                return '##';
            } else if (byte === 0xFF) {
                return '--';
            } else {
                if (byte <= 0x0F) {
                    return '0' + Number(byte).toString(16).toUpperCase();
                } else {
                    return Number(byte).toString(16).toUpperCase();
                }
            }
        })();
        charTable[charTable.length - 1].push(mappedValue);
    }
    const mappedData = charTable.map(row => row.join(''));
    return mappedData;
}

module.exports = decode;
