/**
 * Getting Date strings
 * @param {Date} date
 */
const dateStrings = (date) => {
  const MONTHS = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August',
    'September', 'October', 'November', 'December'];
  return {
    D: date.getDate().toString(),
    DD: (`0${date.getDate()}`).slice(-2),
    M: (date.getMonth() + 1).toString(),
    MM: (`0${date.getMonth() + 1}`).slice(-2),
    MMM: MONTHS[date.getMonth()].slice(0, 3),
    MMMM: MONTHS[date.getMonth()],
    YY: date.getFullYear().toString().slice(-2),
    YYYY: date.getFullYear().toString(),
    hh: (`0${date.getHours()}`).slice(-2),
    mm: (`0${date.getMinutes()}`).slice(-2),
    ss: (`0${date.getSeconds()}`).slice(-2),
    ampm: (date.getHours() >= 12 ? 'PM' : 'AM'),
  };
};

/**
 * Time intervals in milliseconds
 */
const timeInts = {
  sec: 1000,
  minute: 1000 * 60,
  hour: 1000 * 60 * 60,
  day: 1000 * 60 * 60 * 24,
};

/**
 * Saving any Object to file
 * @param {*} obj Object to be saved
 * @param {string | number | Buffer | URL} filePath A path to a file
 * @param {boolean} [isLogged = false] logging flag
 */
const objectToFile = (obj, filePath, isLogged = false) => {
  require('fs').writeFile(filePath, JSON.stringify(obj), (err) => {
    if (err) {
      if (isLogged) {
        console.error(`saving object failed => ${err}`);
      }
    }
    if (isLogged) {
      console.log(`The file ${filePath} has been saved!`);
    }
  });
};

/**
 * Creating JSON Object from file
 * @param {string | number | Buffer | URL} jsonFilePath
 * @param {string} [encoding = 'utf8']
 * @returns {object} JSON Object
 */
const objectFromJsonFile = (jsonFilePath, encoding = 'utf8') => {
  const loadedString = require('fs').readFileSync(jsonFilePath, encoding);
  return JSON.parse(loadedString);
};

const colours = {
  reset: '\x1b[0m',
  bright: '\x1b[1m',
  dim: '\x1b[2m',
  underscore: '\x1b[4m',
  blink: '\x1b[5m',
  reverse: '\x1b[7m',
  hidden: '\x1b[8m',

  fg: {
    black: '\x1b[30m',
    red: '\x1b[31m',
    green: '\x1b[32m',
    yellow: '\x1b[33m',
    blue: '\x1b[34m',
    magenta: '\x1b[35m',
    cyan: '\x1b[36m',
    white: '\x1b[37m',
    crimson: '\x1b[38m', // Scarlet
  },
  bg: {
    black: '\x1b[40m',
    red: '\x1b[41m',
    green: '\x1b[42m',
    yellow: '\x1b[43m',
    blue: '\x1b[44m',
    magenta: '\x1b[45m',
    cyan: '\x1b[46m',
    white: '\x1b[47m',
    crimson: '\x1b[48m',
  },
};

/**
 * Function to view the info about key pressed (Ctr+c to exit)
 */
function checkKeyPress() {
  const readline = require('readline');
  readline.emitKeypressEvents(process.stdin);
  process.stdin.setRawMode(true);
  process.stdin.on('keypress', (str, key) => {
    if (key.ctrl && key.name === 'c') {
      process.exit(0);
    } else {
      console.log(`You pressed the "${str}" key`);
      console.log();
      console.log(key);
      console.log();
    }
  });
  console.log('Press any key to view the key info (Ctr+c to exit)');
}

module.exports = {
  dateStrings,
  timeInts,
  objectToFile,
  objectFromJsonFile,
  colours,
  checkKeyPress,
};
