const bmp = require('bmp-js');

function encode(data) {
    const mappedData = data
        .map(line => Array.from(line)
            .map(char => {
                if (char === '#') {
                    return [0, 0, 0, 0];
                }
                if (char === '-') {
                    return [255, 255, 255, 255];
                }
                const possibleChars = ['0', '1', '2', '3', '4', '5', '6', '7', '8', '9', 'A', 'B', 'C', 'D', 'E', 'F'];
                const index = possibleChars.findIndex(ch => ch === char);
                const value = Math.floor(255 * index / possibleChars.length);
                return [value, value, value, value];
            })
            .reduce((prev, cur) => ([...prev, ...cur]))
        )
        .reduce((prev, cur) => ([...prev, ...cur]));
    
    const buf = Buffer.from(mappedData);
    const bmpData = {data: buf, width: data[0].length, height: data.length};
    return bmp.encode(bmpData);
}


module.exports = encode;
