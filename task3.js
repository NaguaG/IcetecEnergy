const fs = require('fs');
const name1 = './source data/Princeton(40.35,-74.66)-15min-e.json';
const name2 = './source data/Wilmington(39.74,-75.55).json';

const readByName = (name) => {
    var data = fs.readFileSync(name, 'utf-8');
    return JSON.parse(data);
}

const convert = async () => {
    const handler = (error) =>{
        if(error){
            console.log(error);
        }
    };
    const toDate = text => new Date(text);
    const toText = text => `${text.toLocaleDateString()} ${text.toLocaleTimeString()}`;
    fs.writeFile('./converted data/princeton.csv', 'validTimeUtc,irradianceGlobalHorizontal,irradianceDirectNormal\n', handler);
    readByName(name1).forecasts15Minute.validTimeUtc
      .map(toDate)
      .map(toText)
      .forEach((text, index) => {
        const igh = readByName(name1).forecasts15Minute.irradianceGlobalHorizontal[index];
        const idn = readByName(name1).forecasts15Minute.irradianceDirectNormal[index];
        fs.writeFile('./converted data/princeton.csv', `${text},${igh},${idn}\n`, { flag: 'a+' }, handler);
      });

    fs.writeFile('./converted data/wilmington.csv', 'validTimeLocal,temperature\n', handler);
    readByName(name2).validTimeLocal
      .map(toDate)
      .map(toText)
      .forEach((text, index) => {
        const temp = readByName(name2).temperature[index];
        fs.writeFile('./converted data/wilmington.csv', `${text},${temp}\n`, { flag: 'a+' }, handler);
      });
      console.log('Successfully converted.')
}
convert();

