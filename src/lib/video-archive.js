/* eslint-disable class-methods-use-this */
const path = require('path');
const VideoArchiveBase = require('./video-archive-base');
const Slave = require('./slave');
const AnalysisResult = require('./analysis-result');
const db = require('./db');
const analizeVideoIndexFolder = require('./analize-video-index-folder');
const { querySlaves, queryCams } = require('./sql-query');

class VideoArchive extends VideoArchiveBase {
  /** @param {Config} config параметры анализа */
  constructor(config) {
    super(config);
    this.connection = null;
    this.connectionOptions = config.db;
  }

  /** Открыть/проверить соединение */
  async checkConnection() {
    if (this.connection === null) {
      this.connection = await db.connOpenAsync(this.connectionOptions);
    }
  }

  /**
   * Получить набор видеокамер видеосервера
   * @param {string} slaveID Id видеосервера
   * @returns {Promise<Cams>}
   */
  async getCams(slaveID) {
    await this.checkConnection();

    /** @type {CameraDef[]} */
    const camsDefs = await db.connQueryAsync(this.connection, queryCams(slaveID));

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
   * @param {AnalysisParams} aParams параметры для анализа видеоархива
   * @returns {Promise<AnalysisResult>}
   */
  async analizeSlave(slave, aParams) {
    const indexFolderPath = path.join(`\\\\${slave.id}`, slave.vdrive, 'VIDEO', 'INDEX');
    const aResult = new AnalysisResult(slave, aParams);
    return analizeVideoIndexFolder(indexFolderPath, aResult);
  }

  closeConnection() {
    if (this.connection !== null) {
      this.connection.close((err) => {
        if (err) console.error(`DB closing connection error => ${err.message}`);
      });
    }
  }
}

module.exports = VideoArchive;
