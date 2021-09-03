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
            if (byte === 0) {
                return '0'; // Should be # but CodeWalker chokes on it
            } else if (byte === 255) {
                return '-';
            } else {
                const possibleChars = ['0', '1', '2', '3', '4', '5', '6', '7', '8', '9', 'A', 'B', 'C', 'D', 'E', 'F'];
                return possibleChars[Math.floor(byte / possibleChars.length)]
            }
        })();
        charTable[charTable.length - 1].push(mappedValue);
    }
    const mappedData = charTable.map(row => row.join(''));
    return mappedData;
}

module.exports = decode;
