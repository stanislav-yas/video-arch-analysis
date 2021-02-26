const {colours: cc, objectFromJsonFile} = require('./util');

const displayResultTable = (rt) => {
  console.log(`Результат анализа видеофайлов на: ${rt.slave} ( подкл. в/к - )`)
}

const displayResults = (resultTables) => {
  for (const rt of resultTables) {
    console.log(rt);
  }
};

const resultTables = objectFromJsonFile('./misc/result.json', 'utf8');

displayResults(resultTables);

