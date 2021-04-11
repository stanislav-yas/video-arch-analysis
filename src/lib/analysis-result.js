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
 * @property {AnalysisParams} aParams параметры для анализа видеоархива
 * @property {number} intervalsCount количество анализируемых временных интервалов
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
}

module.exports = AnalysisResult;
