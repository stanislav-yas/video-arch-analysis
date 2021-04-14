const { colours: cc } = require('../lib/util');

const { stdout } = process;
/** @typedef {import('../lib/analysis-result')} AnalysisResult */

/**
 * Вывести заголовок таблицы
 * @param {number} camsCount количество видеокамер
 * @param {number} fromTimeInSec время отсчёта анализа в секундах
 * @param {number} deepInHours глубина анализа в часах
 * @param {number} intervalInMinutes минимальный анализируемый временной интервал в минутах
 * @param {number} intervalsCount количество анализируемых временных интервалов
 * @param {number} indent отступ
 */
function writeTableHeader(
  camsCount, fromTimeInSec, deepInHours, intervalInMinutes, intervalsCount, indent,
) {
  const hourLabelLength = Math.floor(60 / intervalInMinutes);
  let header = ` видеокамеры (${camsCount} шт.):`.padEnd(indent);
  for (let index = 0; index < deepInHours; index++) {
    const curTime = new Date((fromTimeInSec + 1) * 1000 - ((deepInHours - index) * 60 * 60 * 1000));
    const curHourStr = curTime.getHours().toString().padStart(2, '0');
    header += curHourStr.padEnd(hourLabelLength);
  }
  header = header.padStart(indent + intervalsCount);
  const headerLine = `${''.padStart(header.length, '-')}\n`;
  stdout.write(headerLine);
  stdout.write(`${cc.reset}${cc.bright}${header}${cc.reset}\n`);
  stdout.write(headerLine);
}

/**
 * Графическое отображение информации о наличии видеофрагментов
 * @param {Array<boolean>} flags массив отметок о наличии видеофрагментов.
 * Расположены в обратном временном порядке (сначала более ранние)
 * @returns {String}
 */
function visualizeFlags(flags) {
  const checkedChar = '◘';
  const notCheckedChar = '∙';
  let fInfo = '';
  for (let index = 0; index < flags.length; index++) {
    const flag = flags[flags.length - 1 - index];
    fInfo += flag ? checkedChar : notCheckedChar;
  }
  return fInfo;
}

/**
 * Вывести информацию по видеокамере
 * @param {Object} timeMap временная карта по видеокамерам
 * @param {string} camID id видеокамеры
 * @param {string} camName название видеокамеры
 * @param {number} indent отступ
 */
function writeCamInfo(timeMap, camID, camName, indent) {
  const gap = 1; // зазор между camTitle и fragmentsInfo
  const camIDstring = camID.padStart(3);
  const camTitle = ` № ${camIDstring} - ${camName}`.substring(0, indent - gap).padEnd(indent - gap);
  const { intervalsFlags: flags, checkedFragmentsCount: cnt } = timeMap[camID];
  const fragmentsInfo = visualizeFlags(flags);
  let fgColor = cc.reset;
  if (cnt === 0) {
    fgColor = cc.fg.red + cc.bright;
  } else if (cnt <= 2) {
    fgColor = cc.fg.yellow + cc.bright;
  }
  stdout.write(`${fgColor}${camTitle} ${fragmentsInfo} ( ${cnt} фр.)\n`);
}

/**
 * Отобразить результат анализа видеоархива
 * @param {AnalysisResult} aResult
 */
function displayResult(aResult, ident = 40) {
  const { slave, timeMap, intervalsCount } = aResult;
  const { deepInHours, intervalInMinutes, fromTime } = aResult.aParams;
  const fromTimeInSec = fromTime.getTime() / 1000;
  const { cams } = slave;
  const camsIDs = Object.keys(cams);

  const fgColor = cc.reset + cc.fg.green;
  process.stdout.write(`\n${fgColor} Результат анализа индексов видеоархива на ${cc.bright}${slave.id}${fgColor} за ${deepInHours} часов${cc.reset}\n`);
  const sinceTime = new Date((fromTimeInSec + 1) * 1000 - (deepInHours * 60 * 60 * 1000));
  stdout.write(`${fgColor} с ${sinceTime.toLocaleString()} (интервал - ${intervalInMinutes} минут)\n\n${cc.reset}`);
  writeTableHeader(
    camsIDs.length, fromTimeInSec, deepInHours, intervalInMinutes, intervalsCount, ident,
  );

  camsIDs.forEach((camID) => {
    const camName = cams[camID];
    writeCamInfo(timeMap, camID, camName, ident);
  });
}

/**
 * Отобразить результаты анализа видеоархива
 * @param {AnalysisResult[]} aResults
 */
function displayResults(aResults) {
  const ident = 40;
  aResults.forEach((resultTable) => {
    displayResult(resultTable, ident);
  });
}

// (function test(){
//   const resultTables = require('./util').objectFromJsonFile('./misc/result.json', 'utf8');
//   displayResults(resultTables);
// })();

module.exports = { displayResults, displayResultTable: displayResult };
