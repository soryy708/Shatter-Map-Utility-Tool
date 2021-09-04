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

    // The game has some sort of compression that requires the longest continuous substring of `FF`s to be turned in to `--`s
    // There can be only one continuous `--` substring per line
    const optimizedData = mappedData.map(line => {
        const matches = line.match(/F+/gu);
        if (!matches || matches.length === 0) {
            return line;
        }
        const sortedMatches = matches.sort((a, b) => b.length - a.length);
        const longestMatch = sortedMatches[0];
        const index = line.indexOf(longestMatch);

        // Make sure we don't replace half a pixel with a `-`, at the start and the end of the substring
        const offsetIndex = index % 2 === 0 ? index : index + 1;
        const substringLength = longestMatch.length % 2 === 0 ? longestMatch.length : longestMatch.length - 1;

        return [
            line.slice(0, offsetIndex),
            '-'.repeat(substringLength),
            line.slice(offsetIndex + substringLength),
        ].join('');
    });
    return optimizedData;
}

module.exports = decode;
