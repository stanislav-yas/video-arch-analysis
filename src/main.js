const analize = require('./analize-share-folders');

const curTime = new Date('2021-02-16T14:50:00'); // new Date(); //   

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
  .then((resultTable) => {
    console.log(`Parsing is done => ${resultTable.totalCheckedFragmentsCount} fragments checked`);
  })
  .catch((err) => {
    console.error(`Parsing was failed => ${err}`);
  });
