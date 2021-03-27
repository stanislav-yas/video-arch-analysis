process.on('uncaughtException', (err) => {
  console.error(`Произошла непредвиденная ошибка во время выполнения программы => ${err}`);
});

const path = require('path');
const { colours: cc, objectFromJsonFile } = require('./util');

const packageJson = objectFromJsonFile(path.resolve(process.cwd(), 'package.json'));
let config = require('../app.config');

if (process.argv.includes('MOCK', 2)) {
  process.MOCK = true; // use mock data
}

const curTime = process.MOCK ? new Date('2021-03-06T12:10:00') : new Date();

// конец предыдущего часа
const fromTime = new Date(
  curTime.getFullYear(),
  curTime.getMonth(),
  curTime.getDate(),
  curTime.getHours() - 1,
  59,
  59,
);

config = {
  appTitle: packageJson.description,
  appVersion: packageJson.version,
  appFullTitle: ` ${cc.reset + cc.bright + cc.fg.magenta}${packageJson.description} (v${packageJson.version})${cc.reset}`,
  fromTime,
  ...config,
};

function run() {
  console.clear();
  process.stdout.write(`${config.appFullTitle}\n\n`);
  const VideoArchive = require('./video-archive');
  const va = new VideoArchive(config);
  va.analize()
    .then((resultTables) => {
      // objectToFile(resultTables, './misc/result.json', true);
      // console.log(`Video archive analize started at ${curTime.toLocaleString()} is done`);
      const Interface = require('./interface');
      new Interface(config, resultTables).run();
    })
    .catch((err) => {
      console.error(`Analize was failed => ${err}`);
    })
    .finally(() => va.closeConnection());
}

run();
