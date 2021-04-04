//TODO delete this module after refactoring!
// @ts-check
/** @typedef {import('../lib/slave')} Slave видеосервер */
/** @typedef {import('../app.config')} Config параметры анализа */

const path = require('path');
const fs = require('fs');

const parseIndexFile = require('../lib/parse-index-file');
const AnalysisResult = require('../lib/analysis-result');
const { dateStrings, timeInts: ti } = require('./util');

const slavesMockDirPath = path.join(process.cwd(), 'mock-data', 'slaves');

/**
 * Вычисление непрерывной глубины видеоархива по индексным файлам
 * @param { Date } fromTime дата отсчёта глубины
 * @param { string } indexFolderPath путь к папке с индексными файлами
 * @returns { number } глубина непрерывного видеоархива в днях
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
 * Проанализировать видеоархив на видеосервере
 * @param {Slave} slave видеосервер
 * @param {Config} config параметры анализа
 * @returns {Promise<AnalysisResult>}
 */
async function analizeSlave(slave, config) {
  const { fromTime, deepInHours } = config;
  const indexFolderPath = process.env.videoData === 'mock'
    ? path.join(slavesMockDirPath, slave.id, 'INDEX') // use mock video data
    : path.join(`\\\\${slave.id}`, slave.vdrive, 'VIDEO', 'INDEX');

  const aResult = new AnalysisResult(slave, config);
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
        console.error(`Error was occurred in parseIndexFile function => ${err}`);
      }
    } else {
      console.warn(`${indexFilePath} doesn't exist`);
    }
  }
  return aResult;
}

/**
 * Проанализировать видеоархивы на видеосерверах
 * @param {Slave[]} slaves видеосерверы
 * @param {Config} config параметры анализа
 * @returns {Promise<AnalysisResult[]>}
 */
async function analize(slaves, config) {
  const aResults = [];

  // eslint-disable-next-line no-restricted-syntax
  for (const slave of slaves) {
    process.stdout.write(`анализ в/архива на ${slave.id} ...`);
    const aResult = await analizeSlave(slave, config);
    console.log(`выполнен => ${aResult.totalCheckedFragmentsCount} видеофрагментов обнаружено / непр.глубина ${aResult.continuousDepth} дня(дней)\n`);
    aResults.push(aResult);
  }

  return aResults;
}

module.exports = analize;
