const fs = require('fs');
const filePaths = [
    './source data/Wilmington(39.74,-75.55).json',
    './source data/Princeton(40.35,-74.66)-15min-e.json'
];
const convertedFilePaths = [
    './converted data/wilmington.csv',
    './converted data/princeton.csv'
]
const handler = (error) => {
    if (error) {
        console.log(error);
    }
}
const timeZone = {
    timeZone: 'America/New_York',
    weekday: 'long',
    year: 'numeric',
    month: 'long',
    day: 'numeric',
    hour: 'numeric',
    minute: 'numeric',
    second: 'numeric'
};


const writeRowsToFile = (filePath, row, cols, arr) => {

    for (var i = 0; i < cols; i++) {
        const temp = new Array();
        for (var j = 0; j < row; j++) {
            temp.push(arr[j][i]);
        }
        temp.push('\n');
        const tempString = temp.join(',');
        fs.writeFileSync(filePath, tempString, { flag: 'a+' }, handler);
    }
};

const fileReadPromises = filePaths.map((filePath, index) => {
    return new Promise((resolve, reject) => {
        fs.readFile(filePath, 'utf8', (err, data) => {
            if (err) {
                reject(err);
            } else {
                const json = JSON.parse(data);
                if (json.hasOwnProperty('cloudCover')) {
                    console.log('Wilmington');
                    var row = Object.keys(json).length;
                    var cols = 360;
                    let arr = Array.from(Array(row), () => new Array(cols));
                    var rowIdx = 0;
                    const headers = new Array();
                    const keys = Object.keys(json);

                    //loop through keys in Wilmington
                    for (var keyIndex = 0; keyIndex< keys.length; keyIndex++) {
                        const currentKey = keys[keyIndex];
                        headers.push(currentKey);
                        dateCol = 0;
                        var val = json[currentKey];

                        //if key is validTimeUtc
                        if (currentKey === 'validTimeUtc') {
                            console.log('validTimeUtc');
                            for (var i = 0; i < val.length; i++) {
                                var date = new Date(val[i] * 1000);
                                var formattedDate = date.toLocaleString('en-US', timeZone).replace(/,/g, '');
                                arr[rowIdx][i] = formattedDate;
                                dateCol = rowIdx;
                            }
                        } 
                        //other keys
                        else {
                            console.log('Other keys');
                            for (var i = 0; i < val.length; i++) {
                                arr[rowIdx][i] = val[i];
                            }
                        }
                        rowIdx++;
                        console.log(arr);

                        //swap date column and first column
                        [arr[0], arr[dateCol]] = [arr[dateCol], arr[0]];
                        [headers[0], headers[dateCol]] = [headers[dateCol], headers[0]];
                    }
                    const headersString = headers.join(',');
                    fs.writeFileSync('./converted data/wilmington.csv', headersString, { flag: 'a+' }, handler);
                    writeRowsToFile('./converted data/wilmington.csv', row, cols, arr);
                    resolve(json);

                } else {
                    console.log('Princeton');
                    var row = 3;
                    var cols = 673;
                    let arr = Array.from(Array(row), () => new Array(cols));
                    let headers = new Array();

                    for (var key in json) {
                        if (key === 'forecasts15Minute') {
                            var rowIdx = 0;
                            for (var k in json[key]) {
                                headers.push(k);
                                var val = json[key][k];
                                for (var i = 0; i < val.length; i++) {
                                    if (k === 'validTimeUtc') {
                                        var date = new Date(val[i] * 1000);
                                        var formattedDate = date.toLocaleString('en-US', timeZone).replace(/,/g, '');
                                        arr[rowIdx][i] = formattedDate;
                                    } else {
                                        arr[rowIdx][i] = val[i];
                                    }
                                }
                                rowIdx++;
                            }
                            headers.push('\n');
                            // console.log(arr);
                        }
                    }
                    const headersString = headers.join(',');
                    // console.log(headersString);
                    fs.writeFileSync('./converted data/princeton.csv', headersString, { flag: 'a+' }, handler);
                    writeRowsToFile('./converted data/princeton.csv', row, cols, arr);
                    resolve(json);
                }
            }
        });
    });
});
