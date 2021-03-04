const {colours: cc, objectFromJsonFile} = require('./util');
const path = require('path');
const va = require('./video-archive');

const package = objectFromJsonFile(path.join(process.cwd(), 'package.json'));

const app = {
  title: package.description,
  version: package.version,
  fullTitle: ` ${cc.reset + cc.bright + cc.fg.magenta}${package.description} (v. ${package.version})${cc.reset}`
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

app.params = {
  fromTime,
  deepInHours: process.argv[2] || 12,
  intervalInMinutes: process.argv[3] || 15
}

function run () {
  console.clear();
  console.log(app.fullTitle);

  va.analize(app.params)
  .then((resultTables) => {
    // objectToFile(resultTables, './misc/result.json', true);
    console.log(`Video archive analize started at ${curTime.toLocaleString()} is done`);
    const Interface = require('./interface');
    new Interface(resultTables).run();
  })
  .catch((err) => {
    console.error(`Analize was failed => ${err}`);
  });
};

module.exports = { app };
run();