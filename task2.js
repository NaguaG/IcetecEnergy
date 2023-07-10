const fs = require('fs');

const calculate = () => {
    var data = fs.readFileSync('./source data/rbhs-campus-load-april-2023-data.csv', 'utf8');
    const json = [];
    data.split('\n').splice(1).forEach(row => {
        const date = row.split(',')[0];
        const hour = +row.split(',')[1];
        const amount = +`${row.split(',')[2]}${row.split(',')[3]}`.replaceAll('\"', '').replace('\r', '');
        json.push({date, hour, amount});
    })

const sorted = json.sort((a,b)=> b.amount - a.amount);
const monthlyPeakDemand = {};

sorted.forEach(row => {
    const date = new Date(row.date);
    const month = date.getMonth() + 1; // Months are zero-based in JavaScript, so add 1

    const isOnPeak = date.getDay() >= 1 && date.getDay() <= 5 && date.getHours() >= 7 && date.getHours() <= 20;

    if (!isOnPeak) {
      return;
    }
    const key = `${month}-${row.hour}`;

    if (!monthlyPeakDemand[key] || row.amount > monthlyPeakDemand[key].amount) {
        monthlyPeakDemand[key] = {
        date: date,
        amount: row.amount,
        };
    }
  });

  const monthlyPeakDemandList = Object.values(monthlyPeakDemand);

  monthlyPeakDemandList.forEach((entry) => {
    console.log( `Month: ${entry.date.getMonth() + 1}, Hour: ${entry.date.getHours()}, Peak Demand: ${entry.amount}`);
  });
}

calculate();
