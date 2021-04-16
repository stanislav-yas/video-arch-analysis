/* eslint-disable no-unused-vars */
/* eslint-disable class-methods-use-this */

/** @typedef {import('./slave')} Slave видеосервер */
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
   * Получить набор видеокамер видеосервера
   * @param {!string} slaveID Id видеосервера
   * @returns {Promise<Cams> | Cams}
   */
  getCams(slaveID) {
    throw new Error('Method "getCams" did not implemented');
  }

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
   * @param {AnalysisParams} aParams параметры для анализа видеоархива
   * @returns {Promise<AnalysisResult>}
   */
  async analizeSlave(slave, aParams) {
    throw new Error('Method "analizeSlave" did not implemented');
  }

  /**
   * Проанализировать видеоархивы на видеосерверах
   * @param {Date} [fromTime] время отсчёта анализа
   * @returns {Promise<AnalysisResult[]>}
   */
  async analize(fromTime = new Date()) {
    // установить время отсчёта анализа на конец предыдущего часа заданного времени
    fromTime = new Date(
      fromTime.getFullYear(),
      fromTime.getMonth(),
      fromTime.getDate(),
      fromTime.getHours() - 1,
      59,
      59,
    );
    /** @type {AnalysisParams} */
    const aParams = {
      fromTime,
      deepInHours: this.config.deepInHours,
      intervalInMinutes: this.config.intervalInMinutes,
      maxErrorsForServer: this.config.maxErrorsForServer,
    };
    /** @type {AnalysisResult[]} */
    const aResults = [];
    const slaves = await this.getSlaves();
    // eslint-disable-next-line no-restricted-syntax
    for (const slave of slaves) {
      process.stdout.write(`анализ в/архива на ${slave.id} ... `);
      try {
        const aResult = await this.analizeSlave(slave, aParams);
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
