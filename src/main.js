process.on('uncaughtException', (err) => {
  console.error(`Произошла непредвиденная ошибка во время выполнения программы => ${err}`);
})

const {colours: cc, objectFromJsonFile, objectToFile} = require('./util');
const path = require('path');
const package = objectFromJsonFile(path.join(process.cwd(), 'package.json'));
let config = require('./config');

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

config = {
  appTitle: package.description,
  appVersion: package.version,
  appFullTitle: ` ${cc.reset + cc.bright + cc.fg.magenta}${package.description} (v${package.version})${cc.reset}`,
  ...config
}

function run () {
  console.clear();
  console.log(config.appFullTitle, '\n');
  const VideoArchive = require('./video-archive');
  const va = new VideoArchive(config);
  va.analize()
  .then((resultTables) => {
    // objectToFile(resultTables, './misc/result.json', true);
    console.log(`Video archive analize started at ${curTime.toLocaleString()} is done`);
    const Interface = require('./interface');
    new Interface(config, resultTables).run();
  })
  .catch((err) => {
    console.error(`Analize was failed => ${err}`);
  })
  .finally(() => va.closeConnection());
};

run();