/* eslint-disable no-unused-vars */
/* eslint-disable class-methods-use-this */
// @ts-check

/** @typedef {import('../app.config')} Config параметры анализа */
/** @typedef {import('./analysis-result')} AnalysisResult параметры анализа */

/**
 * Базовый класс для объектов Видеоархив
 */
class VideoArchiveBase {
  /** @param {Config} config параметры анализа */
  constructor(config) {
    this.config = config;
  }

  /**
  * @typedef {Object} Cams Набор видеокамер видеосервера
  * @property {string} [id] название камеры
  * { camId1:'name1', camId2:'name2', ... }
  */

  /**
   * Получить набор видеокамер видеосервера
   * @param {!string} slaveID Id видеосервера
   * @returns {Promise<Cams> | Cams}
   */
  getCams(slaveID) {
    throw new Error('Method "getCams" did not implemented');
  }

  /** @typedef {import('./slave')} Slave видеосервер */

  /**
   * Получить массив доступных видеосерверов
   * @returns {Promise<Slave[]>}
   */
  getSlaves() {
    throw new Error('Method "getSlaves" did not implemented');
  }

  /**
   * Проанализировать видеоархив на видеосервере
   * @param {Slave} slave видеосервер
   * @returns {Promise<AnalysisResult>}
   */
  async analizeSlave(slave) {
    throw new Error('Method "analizeSlave" did not implemented');
  }

  /**
   * Проанализировать видеоархивы на видеосерверах
   * @returns {Promise<AnalysisResult[]>}
   */
  async analize() {
    /** @type {AnalysisResult[]} */
    const aResults = [];
    const slaves = await this.getSlaves();
    // eslint-disable-next-line no-restricted-syntax
    for (const slave of slaves) {
      process.stdout.write(`анализ в/архива на ${slave.id} ... `);
      try {
        const aResult = await this.analizeSlave(slave);
        console.log(`выполнен => ${aResult.totalCheckedFragmentsCount} видеофрагментов обнаружено / непр.глубина ${aResult.continuousDepth} дня(дней)\n`);
        aResults.push(aResult);
      } catch (err) {
        console.error(`При анализе видеоархива на ${slave.id} произошла ошибка => ${err.message}`);
      }
    }
    return aResults;
  }
}

module.exports = VideoArchiveBase;
