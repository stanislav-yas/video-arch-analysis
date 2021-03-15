process.on('uncaughtException', (err) => {
  console.error(`Произошла ошибка во время выполнения программы => ${err}`);
})

const {colours: cc, objectFromJsonFile, objectToFile} = require('./util');
const path = require('path');
const package = objectFromJsonFile(path.join(process.cwd(), 'package.json'));
const config = require('./config');

//process.env.MOCK = true; // true if use mock data

const curTime = process.env.MOCK ?
  new Date('2021-03-06T12:10:00') :
  new Date();

// конец предыдущего часа
config.fromTime = new Date(
  curTime.getFullYear(),
  curTime.getMonth(),
  curTime.getDate(),
  curTime.getHours() - 1,
  59,
  59
);

const app = {
  config,
  title: package.description,
  version: package.version,
  fullTitle: ` ${cc.reset + cc.bright + cc.fg.magenta}${package.description} (v${package.version})${cc.reset}`
}

function run () {
  console.clear();
  console.log(app.fullTitle);
  const VideoArchive = require('./video-archive');
  const va = new VideoArchive(app.config);
  va.analize()
  .then((resultTables) => {
    // objectToFile(resultTables, './misc/result.json', true);
    console.log(`Video archive analize started at ${curTime.toLocaleString()} is done`);
    const Interface = require('./interface');
    new Interface(resultTables).run();
  })
  .catch((err) => {
    console.error(`Analize was failed => ${err}`);
  })
  .finally(() => va.closeConnection());
};

module.exports = app;
run();