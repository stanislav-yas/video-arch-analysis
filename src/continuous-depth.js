const path = require('path');
const fs = require('fs');
const { dateStrings, timeInts: ti } = require('./util');

/**
 * Вычисление непрерывной глубины видеоархива по индексным файлам
 * @param { Date } fromTime Дата отсчёта глубины
 * @param { path } indexFolderPath Путь к папке с индексными файлами
 * @returns { number } Глубина непрерывного видеоархива в днях
 */
function continuousDepth (fromTime, indexFolderPath) {
  let depth = 0;
  for (;; depth++) {
    let archDate = new Date(fromTime.getTime() - (ti.day * depth));
    const ds = dateStrings(archDate);
    let foundInDay = false;
    for (let hour = 23; hour >= 0; hour--) {
      const indexFileBaseName = `${ds.DD}${ds.MM}${ds.YY}${hour}.idx`;
      const indexFilePath = path.join(indexFolderPath, indexFileBaseName);
      if (fs.existsSync(indexFilePath)) {
        foundInDay = true;
        break;
      }
    }
    if(!foundInDay) {
      break;
    }
    console.log(archDate);
  }
  return depth;
}

module.exports = continuousDepth;
