/** @typedef {import('./slave')} Slave видеосервер */
/** @typedef {import('../app.config')} Config параметры анализа */

function getTimeMapIndex(fromTimeInSec, timeInSec, intervalInMinutes) {
  return Math.floor(
    (fromTimeInSec - timeInSec) / (60 * intervalInMinutes),
  );
}

/**
 * Результат анализа видеоархива видеосервера
 * @prop {Slave} slave видеосервер
 * @prop {AnalysisParams} aParams параметры для анализа видеоархива
 * @prop {number} intervalsCount количество анализируемых временных интервалов
 * @prop {number} totalFragmentsCount всего найденных видеофрагментов
 * @prop {number} totalCheckedFragmentsCount всего отмеченных видеофрагментов
 * @prop {number} continuousDepth непрерывная глубина видеоархива
 * @prop {TimeMap} timeMap карта отмеченных видеофрагментов с разбивкой по видеокамерам
 * @prop {Error[]} errors массив ошибок анализа видеоархива
 */
class AnalysisResult {
  /**
   * @param {Slave} slave видеосервер
   * @param {AnalysisParams} aParams параметры для анализа видеоархива
   */
  constructor(slave, aParams) {
    this.slave = slave;
    this.aParams = aParams;
    this.intervalsCount = (aParams.deepInHours * 60) / aParams.intervalInMinutes;
    this.totalFragmentsCount = 0;
    this.totalCheckedFragmentsCount = 0;
    this.continuousDepth = 0;
    /** @type {TimeMap} */
    this.timeMap = {};
    const camsIDs = Object.keys(slave.cams);
    camsIDs.forEach((element) => {
      this.timeMap[element] = {
        intervalsFlags: Array(this.intervalsCount),
        checkedFragmentsCount: 0,
      };
    });
    /** @type {Error[]} */
    this.errors = [];
  }

  /**
   * Проверка/отметка видеофрагмента с видеокамеры
   * @param {number} beginTimeInSec начало видеофрагмента (в секундах)
   * @param {number} endTimeInSec конец видеофрагмента (в секундах)
   * @param {number} camID номер видеокамеры
   * @returns {void}
   */
  ckeckFragment(beginTimeInSec, endTimeInSec, camID) {
    this.totalFragmentsCount++;
    if (!this.timeMap[camID]) {
      // Проверка привязки видеокамеры к текущему видеосерверу
      console.warn(`видеокамера № ${camID} в данный момент не привязана к видеосерверу ${this.slave.id}`);
      return;
    }
    const { fromTime, intervalInMinutes } = this.aParams;
    const fromTimeInSec = fromTime.getTime() / 1000;
    const beginIndex = getTimeMapIndex(fromTimeInSec, beginTimeInSec, intervalInMinutes);
    const endIndex = getTimeMapIndex(fromTimeInSec, endTimeInSec, intervalInMinutes);
    const shouldCheckBeginFlag = (beginIndex >= 0 && beginIndex < this.intervalsCount);
    const shouldCheckEndFlag = (endIndex >= 0 && endIndex < this.intervalsCount);
    if (shouldCheckBeginFlag || shouldCheckEndFlag) {
      // increment fragmentsCount for this cam
      this.timeMap[camID].checkedFragmentsCount++;
      this.totalCheckedFragmentsCount++;
    }
    if (shouldCheckBeginFlag) {
      // set begin interval flag
      this.timeMap[camID].intervalsFlags[beginIndex] = 1;
    }
    if (shouldCheckEndFlag && endIndex !== beginIndex) {
      // set end interval flag
      this.timeMap[camID].intervalsFlags[endIndex] = 1;
    }
  }

  /**
   * Добавление ошибки в массив ошибок и печать ошибки в 'console.error'
   * @param {Error} error ошибка, возникшая при анализе видеоархива
   * @returns {boolean} false если кол-во ошибок превысило допустимое значение
   */
  addError(error) {
    if (this.errors.length === this.aParams.maxErrorsForServer) {
      console.error(`Количество возникших при анализе видеоархива ошибок превысило допустимое значение: ${this.aParams.maxErrorsForServer}`);
      return false;
    }
    this.errors.push(error);
    console.error(`Возникла ошибка при анализе видеоархива на видеосервере ${this.slave.id} => ${error.message}`);
    return true;
  }
}

module.exports = AnalysisResult;
