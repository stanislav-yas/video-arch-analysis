// @ts-check
process.on('uncaughtException', (err) => {
  console.error(`Произошла непредвиденная ошибка во время выполнения программы => ${err.stack}`);
});

const path = require('path');
const { colours: cc, objectFromJsonFile } = require('./util');
const VideoArchive = require('../lib/video-archive');
const VideoArchiveMock = require('../lib/mock/video-archive-mock');

const packageJson = objectFromJsonFile(path.resolve(process.cwd(), 'package.json'));
const appConfig = require('../app.config');

if (process.argv.includes('MOCK', 2)) {
  process.env.videoData = 'mock'; // use mock video data
}

const curTime = process.env.videoData === 'mock'
  ? new Date('2021-03-06T12:10:00')
  : new Date();

// конец предыдущего часа
const fromTime = new Date(
  curTime.getFullYear(),
  curTime.getMonth(),
  curTime.getDate(),
  curTime.getHours() - 1,
  59,
  59,
);

const config = {
  appTitle: packageJson.description,
  appVersion: packageJson.version,
  appFullTitle: ` ${cc.reset + cc.bright + cc.fg.magenta}${packageJson.description} (v${packageJson.version})${cc.reset}`,
  /** @property {Date} время отсчёта анализа */
  fromTime,
  ...appConfig,
};

function run() {
  console.clear();
  process.stdout.write(`${config.appFullTitle}\n\n`);
  const va = process.env.videoData === 'mock'
    ? new VideoArchiveMock(config) : new VideoArchive(config);
  va.analize()
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
}

run();
