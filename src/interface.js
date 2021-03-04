const {app} = require('./main');
const {colours: cc} = require('./util');
const { displayResultTable } = require('./display-results');
const readline = require('readline');

const appFullTitle = app.fullTitle;

readline.emitKeypressEvents(process.stdin);
process.stdin.setRawMode(true);

class Interface {
  constructor(resultTables) {
    this.resultTables = resultTables;
    this.itemIndex = 0;
  }

  _onKeyPressed = (str, key) => {
    switch (key.name) {

      case 'down':
      case 'space':
      case 'return': 
        this.itemIndex++;
        if (this.itemIndex === this.resultTables.length) {
          this.itemIndex = 0;
        }
        this.draw();
        break;

      case 'up':
        this.itemIndex--;
        if (this.itemIndex < 0) {
          this.itemIndex = this.resultTables.length - 1;
        }
        this.draw();
        break;

      case 'escape':
        process.exit(0);
    }
  }

  draw() {
    console.clear();
    console.log(app.fullTitle);
    this.showMenu();
    this.showResult();
  }

  showResult() {
    displayResultTable(this.resultTables[this.itemIndex], 40);
  }

  showMenu() {
    let menuStr = cc.reset;
    menuStr += `\n Выбирите доступный компьютер с видеоархивом (${cc.fg.yellow}↑ ↓ Space Enter , Esc - выход${cc.reset}):\n\n`;

    for (let index = 0; index < this.resultTables.length; index++) {
      const resultTable = this.resultTables[index];
      menuStr += ' ';

      if (index === this.itemIndex) {
        menuStr += cc.reverse;
      }
      menuStr += resultTable.slave.id + cc.reset + '\n';
    }
    console.log(menuStr);
  }

  run() {
    process.stdin.on('keypress', this._onKeyPressed);
    this.draw();
  }
}

module.exports = Interface;

// (function run() {
//   const resultTables = require('./util').objectFromJsonFile('./misc/result.json', 'utf8');
//   const interface = new Interface(resultTables);
//   interface.run();
// })();
