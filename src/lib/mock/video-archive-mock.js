/* eslint-disable class-methods-use-this */
// @ts-check
const path = require('path');
const fs = require('fs');
const VideoArchiveBase = require('../video-archive-base');
const Slave = require('../slave');

const slavesMockDirPath = path.join(process.cwd(), 'mock-data', 'slaves');

class VideoArchiveMock extends VideoArchiveBase {
  /**
  * @typedef {Object} Cams Набор видеокамер видеосервера
  * @property {string} [id] название камеры
  * { camId1:'name1', camId2:'name2', ... }
  */

  /**
   * Получить набор видеокамер видеосервера
   * @param {!string} slaveID Id видеосервера
   * @returns {Cams}
   */
  getCams(slaveID) {
    const camsJSPath = path.join(slavesMockDirPath, slaveID, 'cams.js');
    /** @type {Cams} */
    // eslint-disable-next-line import/no-dynamic-require
    const cams = require(camsJSPath);
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
      const cams = await this.getCams(slaveID);
      slaves.push(new Slave(slaveID, slaveName, vdrive, cams));
    }
    return slaves;
  }
}

module.exports = VideoArchiveMock;
