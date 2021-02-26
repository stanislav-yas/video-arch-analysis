const {colours: cc} = require('./util');

console.log(cc.fg.green, 'This is green message', cc.bg.green, 'This is magenta');

const va = require('./video-archive');

const curTime = new Date(); // new Date('2021-02-16T14:50:00'); // 

// конец предыдущего часа
const fromTime = new Date(
  curTime.getFullYear(),
  curTime.getMonth(),
  curTime.getDate(),
  curTime.getHours() - 1,
  59,
  59
);

const options = {
  fromTime,
  deepInHours: 12,
  intervalInMinutes: 15
}

// let beginTime = new Date('2021-02-16T09:45:59');
// let endTime = new Date('2021-02-16T09:59:59');

va.analize(options)
  .then((resultTables) => {
    require('./util').objectToFile(resultTables, 'result.txt', true);
    console.log(`Video archive analize started at ${curTime.toLocaleString()} is done`);
  })
  .catch((err) => {
    console.error(`Analize was failed => ${err}`);
  });
