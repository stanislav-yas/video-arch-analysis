const fsP = require('fs').promises;

// const { ResultTable } = require('./result-table');

const UNKNOWN_INDEX_FILE_FORMAT_ERROR_MESSAGE = 'unkwnown index file format';
const INDEX_FILE_FORMAT_ERROR_MESSAGE = 'index file format error';

function getStructureLength(descr) {
  const descrMap = [
    { descr: 0xAB00, strLen: 23 },
    { descr: 0xAB01, strLen: 25 },
  ];

  const mapElement = descrMap.find((element) => element.descr === descr);

  if (mapElement) {
    return mapElement.strLen;
  }
  return undefined;
}

/**
 * Video index file parsing
 * @param {path} filePath path to index file
 * @param {ResultTable} resultTable result table after index file parsing
 */
async function parseIndexFile(filePath, resultTable) {
  const buf = Buffer.alloc(30);
  let strLen;
  let fh = null;
  try {
    fh = await fsP.open(filePath, 'r');

    // file description reading
    const descriptionLength = 4; // 4 bytes
    let { bytesRead, buffer } = await fh.read(buf, 0, descriptionLength, null);
    if (bytesRead < descriptionLength) {
      throw new Error(UNKNOWN_INDEX_FILE_FORMAT_ERROR_MESSAGE);
    }
    const descr = buffer.readUInt32LE();
    strLen = getStructureLength(descr);
    if (!strLen) throw new Error(UNKNOWN_INDEX_FILE_FORMAT_ERROR_MESSAGE);
    // console.log(strLen);

    // video fragment info reading
    let cnt = 0;
    while (true) {
      ({ bytesRead, buffer } = await fh.read(buf, 0, strLen, null));
      if (bytesRead === 0) {
        // EOF reached
        break;
      }
      if (bytesRead !== strLen) {
        throw new Error(INDEX_FILE_FORMAT_ERROR_MESSAGE);
      }
      const beginTimeInSec = buffer.readUInt32LE(0);
      const endTimeInSec = buffer.readUInt32LE(4);
      const camID = buffer.readUInt16LE(21);
      resultTable.totalFragmentsCount++;
      resultTable.ckeckFragment(beginTimeInSec, endTimeInSec, camID);
      cnt++;
    }

    return { cnt, rt: resultTable };
  } finally {
    if (fh) {
      await fh.close();
    }
  }
}

module.exports = { parseIndexFile };
