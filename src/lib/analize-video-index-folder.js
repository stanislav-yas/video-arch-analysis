// @ts-check
/** @typedef {import('./slave')} Slave видеосервер */
/** @typedef {import('../app.config')} Config параметры анализа */
/** @typedef {import('./analysis-result')} AnalysisResult параметры анализа */

const path = require('path');
const fs = require('fs');

const parseIndexFile = require('./parse-index-file');
const { dateStrings, timeInts: ti } = require('../cli/util');

/**
 * Вычисление непрерывной глубины видеоархива по индексным файлам
 * @private
 * @param {Date} fromTime дата отсчёта глубины
 * @param {string} indexFolderPath путь к папке с индексными файлами
 * @returns {number} глубина непрерывного видеоархива в днях
 */
function countContinuousDepth(fromTime, indexFolderPath) {
  let depth = 0;
  let dayExists;
  do {
    dayExists = false;
    const archDate = new Date(fromTime.getTime() - (ti.day * depth));
    const ds = dateStrings(archDate);
    for (let hour = 23; hour >= 0; hour--) {
      const hourStr = hour.toString(10).padStart(2, '0');
      const indexFileBaseName = `${ds.DD}${ds.MM}${ds.YY}${hourStr}.idx`;
      const indexFilePath = path.join(indexFolderPath, indexFileBaseName);
      if (fs.existsSync(indexFilePath)) {
        dayExists = true;
        depth++;
        break;
      }
    }
  } while (dayExists);
  return depth;
}

/**
 * Проанализировать папку с видеоиндексами
 * @param {string} indexFolderPath путь к папке с видеоиндексами
 * @param {Date} fromTime время отсчёта анализа
 * @param {number} deepInHours глубина архива для анализа (в часах)
 * @param {AnalysisResult} aResult результат анализа видеоархива видеосервера
 * @returns {Promise<AnalysisResult>}
 */
async function analizeVideoIndexFolder(indexFolderPath, fromTime, deepInHours, aResult) {
  aResult.continuousDepth = countContinuousDepth(fromTime, indexFolderPath);
  for (let index = 0; index < deepInHours; index++) {
    const archDate = new Date(fromTime.getTime() - (ti.hour * index));
    const ds = dateStrings(archDate);
    const indexFileBaseName = `${ds.DD}${ds.MM}${ds.YY}${ds.hh}.idx`;
    const indexFilePath = path.join(indexFolderPath, indexFileBaseName);
    if (fs.existsSync(indexFilePath)) {
      try {
        await parseIndexFile(indexFilePath, aResult);
        // console.log(`${rt.totalCheckedFragmentsCount} fragments checked`);
      } catch (err) {
        throw new Error(`Произошла ошибка при обработке файла индекса "${indexFilePath}" => ${err.message}`);
      }
    } else {
      console.warn(`файла индекса "${indexFilePath}" не существует`);
    }
  }
  return aResult;
}

module.exports = analizeVideoIndexFolder;
