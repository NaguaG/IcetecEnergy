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

/*
The order is OK now, but the Wilmington header is still bad. You have to check the file before pushing it to GitHub.
Here is a screenshot of even the GitHub web page telling us that the header is bad:

2. csv files should not have a dangling comma at the end of every line:
validTimeUtc,irradianceGlobalHorizontal,irradianceDirectNormal,
Thursday October 6 2022 at 1:00:00 PM,706.3,925.8,
Thursday October 6 2022 at 1:15:00 PM,705.3,924.8,
Thursday October 6 2022 at 1:30:00 PM,697.6,925.3,

Also, in the code I am finding strange row and column variables like this:
 var row = 3;
 var cols = 673;

Can you explain these, like are there really only 3 rows, why are they necessary, and what happens when JSON changes size?
*/

const writeRowsToFile = (filePath, headersString, arr) => {
    fs.writeFileSync(filePath, headersString, { flag: 'a+' }, handler);
    for (var i = 0; i < arr[0].length; i++) {
        const temp = new Array();
        for (var j = 0; j < arr.length; j++) {
            temp.push(arr[j][i]);
        }
        const tempString = temp.join(',') + '\n';
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

                    //2 dimensional array to keep JSON object value array
                    var rowSize = Object.keys(json).length;
                    let arr = new Array(rowSize);
                    for (let i = 0; i < rowSize; i++) { arr[i] = []; } 

                    var rowIdx = 0;
                    const headers = new Array();
                    const keys = Object.keys(json);

                    //loop through keys in Wilmington
                    for (var keyIndex = 0; keyIndex < keys.length; keyIndex++) {
                        const key = keys[keyIndex];
                        headers.push(key);
                        dateCol = 0;
                        var valueArray = json[key];

                        //validTimeUtc field
                        if (key === 'validTimeUtc') {
                            for (var i = 0; i < valueArray.length; i++) {
                                var date = new Date(valueArray[i] * 1000);
                                var formattedDate = date.toLocaleString('en-US', timeZone).replace(/,/g, '');
                                arr[rowIdx][i] = formattedDate;
                                dateCol = rowIdx;
                            }
                        }
                        //other fields
                        else {
                            for (var i = 0; i < valueArray.length; i++) {
                                arr[rowIdx][i] = valueArray[i];
                            }
                        }
                        rowIdx++;

                        //swap date column and first column
                        [arr[0], arr[dateCol]] = [arr[dateCol], arr[0]];
                        [headers[0], headers[dateCol]] = [headers[dateCol], headers[0]];
                    }
                    const headersString = headers.join(',') + '\n';                    
                    writeRowsToFile('./converted data/wilmington.csv', headersString, arr);
                    resolve(json);

                } else {
                    console.log('Princeton');
                    for (var outerKey in json) {

                        //ignore metadata, read 'forecasts15Minute' only
                        if (outerKey === 'forecasts15Minute') {
                            let headers = new Array();
                            
                            //2 dimensional array to keep JSON object value array
                            var rowsize = Object.keys(json[outerKey]).length;
                            let arr = new Array(rowsize);
                            for (let i = 0; i < rowsize; i++) { arr[i] = []; } 

                            var rowIdx = 0;
                            for (var key in json[outerKey]) {
                                headers.push(key);
                                var valueArray = json[outerKey][key];

                                //validTimeUtc field
                                if (key === 'validTimeUtc') {
                                    for (var i = 0; i < valueArray.length; i++) {
                                        var date = new Date(valueArray[i] * 1000);
                                        var formattedDate = date.toLocaleString('en-US', timeZone).replace(/,/g, '');
                                        arr[rowIdx].push(formattedDate);
                                    }
                                }

                                //other fields
                                else {
                                    for (var i = 0; i < valueArray.length; i++) {
                                        arr[rowIdx].push(valueArray[i]);
                                    }
                                }
                                rowIdx++;
                            }
                            const headersString = headers.join(',') + '\n';
                            writeRowsToFile('./converted data/princeton.csv', headersString, arr);
                            resolve(json);
                        }


                    }

                }
            }
        });
    });
});