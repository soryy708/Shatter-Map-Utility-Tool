const bmp = require('bmp-js');

function chunk(arr) {
    return arr.reduce(function (result, value, index, array) {
        if (index % 2 === 0) {
            result.push(array.slice(index, index + 2));
        }
        return result;
    }, []);
}

function encode(data) {
    const mappedData = data
        .map(line => chunk(Array.from(line))
            .map(chars => {
                const str = chars.join('');
                if (str === '##') {
                    return [0, 0, 0, 0];
                }
                if (str === '--') {
                    return [255, 255, 255, 255];
                }
                const value = parseInt(str, 16);
                return [value, value, value, value];
            })
            .reduce((prev, cur) => ([...prev, ...cur]))
        )
        .reduce((prev, cur) => ([...prev, ...cur]));

    const buf = Buffer.from(mappedData);
    const bmpData = { data: buf, width: data[0].length / 2, height: data.length };
    return bmp.encode(bmpData);
}

module.exports = encode;
