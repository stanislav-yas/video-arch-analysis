const getTimeMapIndex = (fromTimeInSec, timeInSec, intervalInMinutes) => {
  return Math.floor((fromTimeInSec - timeInSec) / (60 *  intervalInMinutes));
}

class ResultTable {
  constructor(slave, config) {
    this.slave = slave;
    this.config = config;
    const {deepInHours, intervalInMinutes, fromTime} = this.config;
    this.intervalsCount = deepInHours * 60 / intervalInMinutes;
    this.fromTimeInSec = fromTime.getTime()/1000;
    this.totalFragmentsCount = 0;
    this.totalCheckedFragmentsCount = 0;
    this.continuousDepth = 0;
    this.timeMap = {};
    const camsIDs = Object.keys(slave.cams);
    camsIDs.forEach(element => {
      this.timeMap[element] = 
      {
        intervalsFlags: Array(this.intervalsCount),
        checkedFragmentsCount: 0
      }
    });
  }

  ckeckFragment (beginTimeInSec, endTimeInSec, camID) {
    const {intervalInMinutes} = this.config;
    // const beginTime = new Date(beginTimeInSec * 1000);
    // const endTime = new Date(endTimeInSec * 1000);
    // console.log (`${fromTime} : ${fromTimeInSec}`);
    // console.log (`${beginTime} : ${beginTimeInSec}`);
    // console.log (`${endTime} : ${endTimeInSec}`);
    const beginIndex = getTimeMapIndex(this.fromTimeInSec, beginTimeInSec, intervalInMinutes);
    const endIndex = getTimeMapIndex(this.fromTimeInSec, endTimeInSec, intervalInMinutes);
    const shouldCheckBeginFlag = (beginIndex >= 0 && beginIndex < this.intervalsCount);
    const shouldCheckEndFlag =  (endIndex >= 0 && endIndex < this.intervalsCount);
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

module.exports = { ResultTable }
