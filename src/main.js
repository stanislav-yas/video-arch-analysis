// const db = require('./db');
// db.run();
// db.exec();
// db.stop();

const va = require('./video-archive');

va.getSlaves()
  .then((result) => {
    console.log(`Result returns ${result.length}`);
  })
  .catch((err) => {
    console.error(`getSlaves() failed => ${err}`);
  })
  .finally (() => va.closeConnection());

return;

const analize = require('./analize-share-folders');

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

analize(options)
  .then((resultTables) => {
    console.log(`Video archive analize started at ${curTime.toLocaleString()} is done`);
  })
  .catch((err) => {
    console.error(`Analize was failed => ${err}`);
  });
