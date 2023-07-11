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
    const toDate = text => new Date(text * 1000);
    const toText = text => `${text.toLocaleDateString()} ${text.toLocaleTimeString()}`;
    fs.writeFile('./converted data/princeton.csv', 'validTimeUtc,irradianceGlobalHorizontal,irradianceDirectNormal\n', handler);
    readByName(name1).forecasts15Minute.validTimeUtc
      .map(toDate)
      .map(toText)
      .forEach((text, index) => {
        const igh = readByName(name1).forecasts15Minute.irradianceGlobalHorizontal[index];
        const idn = readByName(name1).forecasts15Minute.irradianceDirectNormal[index];
        const proc = readByName(name1).metadata.procTime[index];
        const units = readByName(name1).metadata.units[index];
        const sTime = readByName(name1).metadata.serviceTime[index];
        const lat = readByName(name1).metadata.latitude[index];
        const long = readByName(name1).metadata.longitude[index];
        const it = readByName(name1).metadata.initTimeUtc[index];
        const el = readByName(name1).metadata.elevation[index];
        const lan = readByName(name1).metadata.landuse[index];
        const rec = readByName(name1).metadata.resource[index];
        const vs = readByName(name1).metadata.version[index];
        const req = readByName(name1).metadata.requestId[index];
      
        fs.writeFile('./converted data/princeton.csv', `${text},${igh},${idn},${proc},${units},${sTime},${lat},${long},${it},${el},${lan},${rec},${vs},${req}\n`, { flag: 'a+' }, handler);
      });

    fs.writeFile('./converted data/wilmington.csv', 'validTimeLocal,cloudCover, dayOfWeek, dayOrNight, expirationTimeUtc,iconCodeExtend,precipChance,precipType,pressureMeanSeaLevel,qpf,qpfSnow,relativeHumidity,temperature,temperatureDewPoint,temperatureHeatIndex,temperatureWindChill,uvDescription,uvIndex,validTimeUtc,visibility,windDirection,windDirectionCardinal,windGust,windSpeed,wxPhraseLong,wxPhraseShort,wxSeverity\n', handler);
    readByName(name2).validTimeLocal
      .map(toDate)
      .map(toText)
      .forEach((text, index) => {
        const temp = readByName(name2).temperature[index];
        const dayOfWeek = readByName(name2).dayOfWeek[index];
        const dayOrNight = readByName(name2).dayOrNight[index];
        const expTimeUtc = readByName(name2).expirationTimeUtc[index];
        const iconCodeExtend = readByName(name2).iconCodeExtend[index];
        const precipChance = readByName(name2).precipChance[index];
        const precipType = readByName(name2).precipType[index];
        const pressure = readByName(name2).pressureMeanSeaLevel[index];
        const qpf = readByName(name2).qpf[index];
        const qpfSnow = readByName(name2).qpfSnow[index];
        const humidity = readByName(name2).relativeHumidity[index];
        const tempDewPoint = readByName(name2).temperatureDewPoint[index];
        const tempHeatIndex = readByName(name2).temperatureHeatIndex[index];
        const tempWindChill = readByName(name2).temperatureWindChill[index];
        const uvDesc = readByName(name2).uvDescription[index];
        const uvIndex = readByName(name2).uvIndex[index];
        const validTimeUtc = readByName(name2).validTimeUtc[index];
        const visibl = readByName(name2).visibility[index];
        const windDir = readByName(name2).windDirection[index];
        const windDirCard = readByName(name2).windDirectionCardinal[index];
        const windGust = readByName(name2).windGust[index];
        const windSpeed = readByName(name2).windSpeed[index];
        const wxPhraseLong = readByName(name2).wxPhraseLong[index];
        const wxPhraseShort = readByName(name2).wxPhraseShort[index];
        const wxSeverity = readByName(name2).wxSeverity[index];
        fs.writeFile('./converted data/wilmington.csv', `${text},${temp},${dayOfWeek},${dayOrNight},${expTimeUtc},${iconCodeExtend},${precipChance},${precipType},${pressure},${qpf},${qpfSnow},${humidity},${tempDewPoint},${tempHeatIndex},${tempWindChill},${uvDesc},${uvIndex},${validTimeUtc},${visibl},${windDir},${windDirCard},${windGust},${windSpeed},${wxPhraseLong},${wxPhraseShort},${wxSeverity}\n`, { flag: 'a+' }, handler);
      });
      console.log('Successfully converted.')
}
convert();

