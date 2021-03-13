const {colours: cc} = require('./util');

function printHoursHeader(camsCount, fromTimeInSec, deepInHours, intervalInMinutes, intervalsCount, ident) {
  const hourLabelLength = Math.floor(60 / intervalInMinutes);
  let header = ` видеокамеры (${camsCount} шт.):`.padEnd(ident);
  for (let index = 0; index < deepInHours; index++) {
    const curTime = new Date((fromTimeInSec + 1) * 1000 - ((deepInHours - index) * 60 * 60 * 1000));
    const curHourStr = new String(curTime.getHours()).padStart(2, '0');
    header += curHourStr.padEnd(hourLabelLength);
  }
  header = header.padStart(ident + intervalsCount);
  console.log(''.padStart(header.length, '-'));
  console.log(`${cc.reset}${cc.bright}${header}${cc.reset}`);
  console.log(''.padStart(header.length, '-'));
}

/**
 * Графическое отображение информации о наличии видеофрагментов
 * @param {Array} flags Массив отметок о наличии видеофрагментов. Расположены в обратном временном порядке (сначала более ранние)
 * @returns {String}
 */
function getFragmentsInfo(flags) {
  const checkedChar = '◘';
  const notCheckedChar = '∙';
  let fInfo = new String();
  for (let index = 0; index < flags.length; index++) {
    const flag = flags[flags.length - 1 - index];
    fInfo += flag ? checkedChar : notCheckedChar;
  };
  return fInfo;
}

function printCamInfo(timeMap, camID, camName, ident) {
  const gap = 1; // зазор между camTitle и fragmentsInfo
  const camIDstring = new String(camID).padStart(3);
  const camTitle = ` № ${camIDstring} - ${camName}`.substring(0, ident - gap).padEnd(ident - gap);
  const { intervalsFlags: flags, checkedFragmentsCount: cnt } = timeMap[camID];
  const fragmentsInfo = getFragmentsInfo(flags);
  let fgColor = cc.reset;
  if (cnt === 0) {
    fgColor = cc.fg.red + cc.bright;
  } else if (cnt <= 2) {
    fgColor = cc.fg.yellow + cc.bright;
  }
  console.log(`${fgColor}${camTitle} ${fragmentsInfo} ( ${cnt} фр.)`);
}

function displayResultTable(resultTable, ident = 40) {
  const { slave, intervalsCount, config, fromTimeInSec, timeMap } = resultTable;
  const { deepInHours, intervalInMinutes } = config;
  const { cams } = slave;
  const camsIDs = Object.keys(cams);

  //console.clear();
  const fgColor = cc.reset + cc.fg.green;
  console.log(`\n${fgColor} Результат анализа индексов видеоархива на ${cc.bright}${slave.id}${fgColor} за ${deepInHours} часов${cc.reset}`);
  const sinceTime = new Date((fromTimeInSec + 1) * 1000 - (deepInHours * 60 * 60 * 1000));
  console.log(`${fgColor} с ${sinceTime.toLocaleString()} (интервал - ${intervalInMinutes} минут)\n${cc.reset}`);
  printHoursHeader(camsIDs.length, fromTimeInSec, deepInHours, intervalInMinutes, intervalsCount, ident);

  for (const camID of camsIDs) {
    const camName = cams[camID];
    printCamInfo(timeMap, camID, camName, ident);
  }
}

function displayResults(resultTables) {
  const ident = 40;
  for (const resultTable of resultTables) {
    displayResultTable(resultTable, ident);
  }
}

// (function test(){
//   const resultTables = require('./util').objectFromJsonFile('./misc/result.json', 'utf8');
//   displayResults(resultTables);
// })();

module.exports = {displayResults, displayResultTable};
