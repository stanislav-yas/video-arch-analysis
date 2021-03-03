const {colours: cc, objectFromJsonFile} = require('./util');
const path = require('path');
const va = require('./video-archive');

const package = objectFromJsonFile(path.join(process.cwd(), 'package.json'));

const app = {
  title: package.description,
  version: package.version
}

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

app.options = {
  fromTime,
  deepInHours: process.argv[2] || 12,
  intervalInMinutes: process.argv[3] || 15
}

function run () {
  va.analize(app.options)
  .then((resultTables) => {
    require('./util').objectToFile(resultTables, './misc/result.json', true);
    console.log(`Video archive analize started at ${curTime.toLocaleString()} is done`);
  })
  .catch((err) => {
    console.error(`Analize was failed => ${err}`);
  });
};

// run();