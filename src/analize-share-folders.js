const path = require('path');
const fs = require('fs');

const { parseIndexFile } = require('./index-file');
const { ResultTable } = require('./result-table');
const { dateStrings } = require('./util');

const indexFolder = 'VIDEO\\INDEX';

const analizeIndexFolder = async (indexFolderPath, camsIDs, options) => {

  const resultTable = new ResultTable(camsIDs, options);
  const {fromTime, deepInHours} = options;

  for (let index = 0; index < deepInHours; index++) {
    const archDate = new Date(fromTime.getTime() - (index * 60 * 60 * 1000));
    const ds = dateStrings(archDate);
    const indexFileBaseName = `${ds.DD}${ds.MM}${ds.YY}${ds.hh}.idx`;
    const indexFilePath = path.join(indexFolderPath, indexFileBaseName);
    if (fs.existsSync(indexFilePath)) {
      console.log(`${indexFilePath} exists`);
      try {
        const {cnt} = await parseIndexFile(indexFilePath, resultTable);
        console.log(`${cnt} fragment(s) parsed`);
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

const analizeSlave = async (slave, options) => {
  // TODO
}

const analize = async (slaves, options) => {

  const resultTables = [];

  for (const slave of slaves) {
    const indexFolderPath = path.join(`\\\\${slave.id}`, slave.vdrive, indexFolder);
    const resultTable = await analizeIndexFolder(indexFolderPath, Object.keys(slave.cams), options);
    console.log(`Analize of ${slave.id} is done => ${resultTable.totalCheckedFragmentsCount} fragments checked`);
    resultTable.slave = slave.id;
    resultTables.push(resultTable);
  }
  
  return resultTables;
}

module.exports = analize;