const path = require('path');
const fs = require('fs');

const { parseIndexFile } = require('./index-file');
const { ResultTable } = require('./result-table');
const { dateStrings } = require('./util');

const indexFolder = 'VIDEO\\INDEX';

const analizeSlave = async (slave, options) => {
  const indexFolderPath = path.join(`\\\\${slave.id}`, slave.vdrive, indexFolder);
  const resultTable = new ResultTable(slave, options);
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