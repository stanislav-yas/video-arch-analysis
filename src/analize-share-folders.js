const path = require('path');
const fs = require('fs');

const { parseIndexFile } = require('./index-file');
const continuousDepth = require('./continuous-depth');
const { ResultTable } = require('./result-table');
const { dateStrings, timeInts: ti } = require('./util');

const slavesMockDirPath = path.join(process.cwd(), 'mock-data', 'slaves');

const analizeSlave = async (slave, options) => {

  const indexFolderPath = process.env.MOCK ?
    path.join(slavesMockDirPath, slave.id, 'INDEX') :
    path.join(`\\\\${slave.id}`, slave.vdrive, 'VIDEO', 'INDEX');

  const resultTable = new ResultTable(slave, options);
  const {fromTime, deepInHours} = options;

  const depth = continuousDepth(fromTime, indexFolderPath);

  for (let index = 0; index < deepInHours; index++) {
    const archDate = new Date(fromTime.getTime() - (ti.hour * index));
    const ds = dateStrings(archDate);
    const indexFileBaseName = `${ds.DD}${ds.MM}${ds.YY}${ds.hh}.idx`;
    const indexFilePath = path.join(indexFolderPath, indexFileBaseName);
    if (fs.existsSync(indexFilePath)) {
      try {
        const {cnt} = await parseIndexFile(indexFilePath, resultTable);
        console.log(`${indexFilePath} => ${cnt} fragment(s) parsed`);
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

const analize = async (slaves, options) => {

  const resultTables = [];

  for (const slave of slaves) {
    resultTable = await analizeSlave(slave, options);
    console.log(`Analize of ${slave.id} is done => ${resultTable.totalCheckedFragmentsCount} fragments checked`);
    resultTables.push(resultTable);
  }
  
  return resultTables;
}

module.exports = analize;