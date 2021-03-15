const path = require('path');
const fs = require('fs');

const { parseIndexFile } = require('./index-file');
const { ResultTable } = require('./result-table');
const { dateStrings, timeInts: ti } = require('./util');

const slavesMockDirPath = path.join(process.cwd(), 'mock-data', 'slaves');

/**
 * Вычисление непрерывной глубины видеоархива по индексным файлам
 * @param { Date } fromTime дата отсчёта глубины
 * @param { path } indexFolderPath путь к папке с индексными файлами
 * @returns { number } глубина непрерывного видеоархива в днях
 */
 function countContinuousDepth (fromTime, indexFolderPath) {
  let depth = 0, dayExists;
  do {
    dayExists = false;
    let archDate = new Date(fromTime.getTime() - (ti.day * depth));
    const ds = dateStrings(archDate);
    for (let hour = 23; hour >= 0; hour--) {
      const hourStr = new String(hour).padStart(2, '0');
      const indexFileBaseName = `${ds.DD}${ds.MM}${ds.YY}${hourStr}.idx`;
      const indexFilePath = path.join(indexFolderPath, indexFileBaseName);
      if (fs.existsSync(indexFilePath)) {
        dayExists = true;
        depth++;
        break;
      }
    }
  } while(dayExists)
  return depth;
}

async function analizeSlave(slave, config) {
  const { fromTime, deepInHours } = config;
  const indexFolderPath = process.env.MOCK ?
    path.join(slavesMockDirPath, slave.id, 'INDEX') :
    path.join(`\\\\${slave.id}`, slave.vdrive, 'VIDEO', 'INDEX');

  const resultTable = new ResultTable(slave, config);
  resultTable.continuousDepth = countContinuousDepth(fromTime, indexFolderPath);

  for (let index = 0; index < deepInHours; index++) {
    const archDate = new Date(fromTime.getTime() - (ti.hour * index));
    const ds = dateStrings(archDate);
    const indexFileBaseName = `${ds.DD}${ds.MM}${ds.YY}${ds.hh}.idx`;
    const indexFilePath = path.join(indexFolderPath, indexFileBaseName);
    if (fs.existsSync(indexFilePath)) {
      try {
        const { cnt } = await parseIndexFile(indexFilePath, resultTable);
        // console.log(`${indexFilePath} => ${cnt} fragment(s) parsed`);
        // console.log(`${rt.totalCheckedFragmentsCount} fragments checked`);
      } catch (err) {
        console.error(`Error was occurred in parseIndexFile function => ${err}`);
      }
    } else {
      console.warn(`${indexFilePath} doesn't exist`);
    }
  }
  return resultTable;
}

async function analize(slaves, config) {

  const resultTables = [];

  for (const slave of slaves) {
    resultTable = await analizeSlave(slave, config);
    console.log(`Analize of ${slave.id} is done => ${resultTable.totalCheckedFragmentsCount} fragments checked / ${resultTable.continuousDepth} day(s) continuous depth`);
    resultTables.push(resultTable);
  }

  return resultTables;
}

module.exports = analize;