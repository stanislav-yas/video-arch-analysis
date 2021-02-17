const path = require('path');
const fs = require('fs');

const { parseIndexFile } = require('./index-file');
const { ResultTable } = require('./result-table');
const {dateStrings} = require('./util');

const computer = 'SV10';
const drive = 'F:\\';
const indexFolder = 'VIDEO\\INDEX';
const indexFolderPath = path.join(drive, indexFolder); // __dirname; // 
//const FILE_NAME = '08022108.idx';
const camsIDs = [14, 18, 63, 72, 78, 110, 114, 121, 137, 138, 147, 162, 168, 178];

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
        const {cnt, rt} = await parseIndexFile(indexFilePath, resultTable);
        console.log(`${cnt} chunk(s) was parsed`);
        console.log(`${rt.totalCheckedFragmentsCount} fragments checked`);
      } catch (err) {
        console.error(`Error was occurred withing parseIndexFile function => ${err}`);
      }
    } else {
      console.warn(`${indexFilePath} doesn't exist`);
    }
  }
  return resultTable;
}

const analize = async (options) => {
  const resultTable = await analizeIndexFolder(indexFolderPath, camsIDs, options);
  resultTable.computer = computer;
  return resultTable;
}

module.exports = analize;