// @ts-check
const path = require('path');
const VideoArchiveBase = require('./video-archive-base');
const Slave = require('./slave');
const AnalysisResult = require('./analysis-result');
const db = require('../cli/db');
const analizeVideoIndexFolder = require('./analize-video-index-folder');

const querySlaves = `
  select distinct 
    s.id,
    s.name,
    substring(s.drives, 1, 1) 'vdrive'
  from
    OBJ_CAM c,  OBJ_SLAVE s right JOIN OBJ_GRABBER g on g.parent_id=s.id
  where
    c.parent_id=g.id
    and (c.flags = 0 or c.flags is null)
  order by 1`;

const queryCams = (slaveID) => (
  `SELECT 
  CAST(c.id as int) 'id',
  c.[name] 'name'
  FROM OBJ_CAM c, OBJ_GRABBER g
  where c.parent_id=g.id
  and (c.flags = 0 or c.flags is null)
  and g.parent_id = '${slaveID}'
  order by 1`
);

class VideoArchive extends VideoArchiveBase {
  constructor(config) {
    super(config);
    this.connection = null;
    this.connectionOptions = config.db;
  }

  /** Открыть/проверить соединение */
  async checkConnection() {
    if (this.connection === null) {
      this.connection = await db.sqlOpenAsync(this.connectionOptions);
    }
  }

  /**
  * @typedef {Object} Cams Набор видеокамер видеосервера
  * @property {string} [id] название камеры
  * { camId1:'name1', camId2:'name2', ... }
  */

  /**
   * Получить набор видеокамер видеосервера
   * @param {string} slaveID Id видеосервера
   * @returns {Promise<Cams>}
   */
  async getCams(slaveID) {
    await this.checkConnection();

    /**
    * @typedef {Object} CameraDef Описание видекамеры
    * @property {string} id
    * @property {string} name
    */

    /** @type {CameraDef[]} */
    const camsDefs = await db.connQueryAsync(this.connection, queryCams(slaveID));

    /** @type {Cams} */
    const cams = {};
    camsDefs.forEach((camDef) => {
      cams[Number.parseInt(camDef.id, 10)] = camDef.name;
    });
    return cams;
  }

  /** @typedef {{id: string, name: string, vdrive: string}} SlaveDef Определение видеосервера */

  /**
   * Получить массив доступных видеосерверов
   * @returns {Promise<Slave[]>}
   */
  async getSlaves() {
    await this.checkConnection();
    /** @type {SlaveDef[]} */
    const slavesDefs = await db.connQueryAsync(this.connection, querySlaves);

    /** @type {Slave[]} */
    const slaves = [];
    for (const slaveDef of slavesDefs) {
      const { id, name, vdrive } = slaveDef;
      const cams = await this.getCams(id);
      slaves.push(new Slave(id, name, vdrive, cams));
    }
    return slaves;
  }

  /**
 * Проанализировать видеоархив на видеосервере
 * @param {Slave} slave видеосервер
 * @returns {Promise<AnalysisResult>}
 */
  async analizeSlave(slave) {
    const { fromTime, deepInHours } = this.config;
    const indexFolderPath = path.join(`\\\\${slave.id}`, slave.vdrive, 'VIDEO', 'INDEX');
    const aResult = new AnalysisResult(slave, this.config);
    return analizeVideoIndexFolder(indexFolderPath, fromTime, deepInHours, aResult);
  }

  closeConnection() {
    if (this.connection !== null) {
      this.connection.close();
    }
  }
}

// if (process.env.videoData === 'mock') {
//   const { getSlaves, getCams } = require('../cli/mock/get-mock-data');
//   VideoArchive.prototype.getSlaves = getSlaves;
//   VideoArchive.prototype.getCams = getCams;
// }

module.exports = VideoArchive;
