/* eslint-disable class-methods-use-this */
const path = require('path');
const fs = require('fs');
const VideoArchiveBase = require('../video-archive-base');
const Slave = require('../slave');
const AnalysisResult = require('../analysis-result');
const analizeVideoIndexFolder = require('../analize-video-index-folder');

const slavesMockDirPath = path.join(process.cwd(), 'mock-data', 'slaves');

class VideoArchiveMock extends VideoArchiveBase {
  /**
   * Получить набор видеокамер видеосервера
   * @param {!string} slaveID Id видеосервера
   * @returns {Cams}
   */
  getCams(slaveID) {
    const camsJSPath = path.join(slavesMockDirPath, slaveID, 'cams.js');

    /** @type {CameraDef[]} */
    // eslint-disable-next-line import/no-dynamic-require
    const camsDefs = require(camsJSPath);

    /** @type {Cams} */
    const cams = {};
    camsDefs.forEach((camDef) => {
      cams[Number.parseInt(camDef.id, 10)] = camDef.name;
    });
    return cams;
  }

  /**
 * Получить массив доступных видеосерверов
 * @returns {Promise<Slave[]>}
 */
  async getSlaves() {
    /** @type {Slave[]} */
    const slaves = [];
    const dir = await fs.promises.opendir(slavesMockDirPath);
    // eslint-disable-next-line no-restricted-syntax
    for await (const dirent of dir) {
      // console.log(dirent.name);
      const slaveID = dirent.name;
      const slaveName = `Компьютер ${dirent.name}`;
      const vdrive = '';
      const cams = this.getCams(slaveID);
      slaves.push(new Slave(slaveID, slaveName, vdrive, cams));
    }
    return slaves;
  }

  /**
   * Проанализировать видеоархив на видеосервере
   * @param {Slave} slave видеосервер
   * @returns {Promise<AnalysisResult>}
   */
  async analizeSlave(slave) {
    const indexFolderPath = path.join(slavesMockDirPath, slave.id, 'INDEX'); // use mock video data
    const aResult = new AnalysisResult(slave, this.config);
    return analizeVideoIndexFolder(indexFolderPath, aResult);
  }
}

module.exports = VideoArchiveMock;
