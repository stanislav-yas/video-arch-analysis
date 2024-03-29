/** @typedef {import('./slave')} Slave видеосервер */
/** @typedef {import('../app.config')} Config параметры анализа */
/** @typedef {import('./analysis-result')} AnalysisResult параметры анализа */

const path = require('path');
const fs = require('fs');

const parseIndexFile = require('./parse-index-file');
const { dateStrings, timeInts: ti } = require('./util');

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
 * @param {AnalysisResult} aResult результат анализа видеоархива видеосервера
 * @returns {Promise<AnalysisResult>}
 */
async function analizeVideoIndexFolder(indexFolderPath, aResult) {
  const { fromTime, deepInHours } = aResult.aParams;
  aResult.continuousDepth = countContinuousDepth(fromTime, indexFolderPath);
  for (let index = 0; index < deepInHours; index++) {
    const archDate = new Date(fromTime.getTime() - (ti.hour * index));
    const ds = dateStrings(archDate);
    const indexFileBaseName = `${ds.DD}${ds.MM}${ds.YY}${ds.hh}.idx`;
    const indexFilePath = path.join(indexFolderPath, indexFileBaseName);
    if (fs.existsSync(indexFilePath)) {
      try {
        await parseIndexFile(indexFilePath, aResult);
      } catch (err) {
        if (!aResult.addError(new Error(`Ошибка при обработке файла индекса "${indexFilePath}" => ${err.message}`))) {
          // прервать анализ из-за превышения допустимого кол-ва ошибок
          break;
        }
      }
    } else {
      console.warn(`индексный файл "${indexFilePath}" не существует`);
    }
  }
  // формирование массива идентификаторов видеокамер с отсутствующими видеофрагментами
  Object.keys(aResult.timeMap).forEach((camID) => {
    if (aResult.timeMap[camID].checkedFragmentsCount === 0) {
      aResult.alarmedCams.push(camID);
    }
  });
  return aResult;
}

module.exports = analizeVideoIndexFolder;
