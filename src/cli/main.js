process.on('uncaughtException', (err) => {
  console.error(`Произошла непредвиденная ошибка во время выполнения программы => ${err.stack}`);
});

const path = require('path');
const { colours: cc, objectFromJsonFile } = require('./util');
const VideoArchive = require('../lib/video-archive');
const VideoArchiveMock = require('../lib/mock/video-archive-mock');

const packageJson = objectFromJsonFile(path.resolve(process.cwd(), 'package.json'));
const appConfig = require('../app.config');

const config = {
  appTitle: packageJson.description,
  appVersion: packageJson.version,
  appFullTitle: ` ${cc.reset + cc.bright + cc.fg.magenta}${packageJson.description} (v${packageJson.version})${cc.reset}`,
  ...appConfig,
};

/** @type {VideoArchive | VideoArchiveMock} */
let va;

/** @type {Date} */
let fromTime;

if (process.argv.includes('MOCK', 2)) {
  process.env.videoData = 'mock'; // use mock video data
  va = new VideoArchiveMock(config);
  fromTime = new Date('2021-03-06T12:10:00'); // date of existing mock video data
} else {
  va = new VideoArchive(config);
  fromTime = new Date();
}

console.clear();
process.stdout.write(`${config.appFullTitle}\n\n`);
//TODO to refactor to await
va.analize(fromTime)
  .then((aResults) => {
    // objectToFile(resultTables, './misc/result.json', true);
    // console.log(`Video archive analize started at ${curTime.toLocaleString()} is done`);
    const Interface = require('./interface');
    new Interface(config, aResults).run();
  })
  .catch((err) => {
    console.error(`Analize was failed => ${err.stack}`);
  })
  .finally(() => {
    if (va instanceof VideoArchive) va.closeConnection();
  });
