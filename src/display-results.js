const {colours: cc, objectFromJsonFile} = require('./util');

const displayResultTable = (rt) => {
  const {cams} = rt.slave;
  const camsIDs = Object.keys(cams);
  console.log(`Результат анализа видеофайлов на: ${rt.slave.id} ( подкл. в/к - ${camsIDs.length} )`);
}

const displayResults = (resultTables) => {
  for (const rt of resultTables) {
    displayResultTable(rt);
  }
};

const resultTables = objectFromJsonFile('./misc/result.json', 'utf8');

displayResults(resultTables);

