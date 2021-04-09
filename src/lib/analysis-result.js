/** @typedef {import('./slave')} Slave видеосервер */
/** @typedef {import('../app.config')} Config параметры анализа */

function getTimeMapIndex(fromTimeInSec, timeInSec, intervalInMinutes) {
  return Math.floor(
    (fromTimeInSec - timeInSec) / (60 * intervalInMinutes),
  );
}

/**
 * Результат анализа видеоархива видеосервера
 * @property {Slave} slave видеосервер
 * @property {Date} fromTime время отсчёта анализа
 * @property {number} deepInHours глубина архива для анализа (в часах)
 */
class AnalysisResult {
  /**
   * @param {Slave} slave видеосервер
   * @param {Config} config параметры анализа
   */
  constructor(slave, config) {
    this.slave = slave;
    this.fromTime = config.fromTime;
    this.deepInHours = config.deepInHours;
    this.intervalInMinutes = config.intervalInMinutes;
    this.intervalsCount = (this.deepInHours * 60) / this.intervalInMinutes;
    this.totalFragmentsCount = 0;
    this.totalCheckedFragmentsCount = 0;
    this.continuousDepth = 0;
    this.timeMap = {};
    const camsIDs = Object.keys(slave.cams);
    camsIDs.forEach((element) => {
      this.timeMap[element] = {
        intervalsFlags: Array(this.intervalsCount),
        checkedFragmentsCount: 0,
      };
    });
  }

  ckeckFragment(beginTimeInSec, endTimeInSec, camID) {
    // const beginTime = new Date(beginTimeInSec * 1000);
    // const endTime = new Date(endTimeInSec * 1000);
    // console.log (`${fromTime} : ${fromTimeInSec}`);
    // console.log (`${beginTime} : ${beginTimeInSec}`);
    // console.log (`${endTime} : ${endTimeInSec}`);
    const fromTimeInSec = this.fromTime.getTime() / 1000;
    const beginIndex = getTimeMapIndex(fromTimeInSec, beginTimeInSec, this.intervalInMinutes);
    const endIndex = getTimeMapIndex(fromTimeInSec, endTimeInSec, this.intervalInMinutes);
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
}

module.exports = AnalysisResult;
