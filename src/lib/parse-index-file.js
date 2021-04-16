// @ts-check
const fsP = require('fs').promises;

/** @typedef {import('../lib/analysis-result')} AnalysisResult параметры анализа */

const UNKNOWN_INDEX_FILE_FORMAT_ERROR_MESSAGE = 'unkwnown index file format';
const INDEX_FILE_FORMAT_ERROR_MESSAGE = 'index file format error';

/**
 * Определение длины структуры с описанием видеофрагмента
 * @private
 * @param {number} fileDescriptor дескриптор индексного файла (зависит от версии)
 * @returns {number} длина структуры в байтах
 */
function getStructureLength(fileDescriptor) {
  const descriptorTypes = [
    { descriptor: 0xAB00, strLen: 23 },
    { descriptor: 0xAB01, strLen: 25 },
  ];

  const found = descriptorTypes.find((element) => element.descriptor === fileDescriptor);
  if (found) {
    return found.strLen;
  }
  return undefined;
}

/**
 * Video index file parsing
 * @param {string} indexFolderPath путь к папке с индексными файлами
 * @param {AnalysisResult} aResult результат анализа видеоархива видеосервера
 * @returns {Promise<{fragmentsCount: number, aResult: AnalysisResult}>}
 */
async function parseIndexFile(indexFolderPath, aResult) {
  const buf = Buffer.alloc(30);
  let strLen;
  let fh = null;
  try {
    fh = await fsP.open(indexFolderPath, 'r');

    // file description reading
    const descriptionLength = 4; // 4 bytes
    let { bytesRead, buffer } = await fh.read(buf, 0, descriptionLength, null);
    if (bytesRead < descriptionLength) {
      throw new Error(UNKNOWN_INDEX_FILE_FORMAT_ERROR_MESSAGE);
    }
    const descr = buffer.readUInt32LE();
    strLen = getStructureLength(descr);
    if (!strLen) throw new Error(UNKNOWN_INDEX_FILE_FORMAT_ERROR_MESSAGE);

    let fragmentsCount = 0; // число обнаруженных видеофрагментов
    while (true) {
      // чтение очередного видеофрагмента
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
      aResult.ckeckFragment(beginTimeInSec, endTimeInSec, camID);
      fragmentsCount++;
    }

    return { fragmentsCount, aResult };
  } finally {
    if (fh) {
      await fh.close();
    }
  }
}

module.exports = parseIndexFile;
