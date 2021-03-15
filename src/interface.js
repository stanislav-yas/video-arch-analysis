const {colours: cc} = require('./util');
const { displayResultTable } = require('./display-results');
const readline = require('readline');
const config = require('./config');

readline.emitKeypressEvents(process.stdin);
process.stdin.setRawMode(true);

class Interface {
  constructor(config, resultTables) {
    this.config = config;
    this.resultTables = resultTables;
    this.itemIndex = 0;
  }

  _onKeyPressed = (str, key) => {
    switch(key.name) {
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
        if(this.itemIndex < 0) {
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
    console.log(this.config.appFullTitle);
    this.showMenu();
    this.showResult();
  }

  showResult() {
    displayResultTable(this.resultTables[this.itemIndex], 40);
  }

  showMenu() {
    console.log(`\n${cc.reset} Выбирите доступный компьютер с видеоархивом (${cc.fg.yellow}↑ ↓ Space Enter , Esc - выход${cc.reset}):\n\n компьютер  [непрер. глубина в/архива в днях]\n`);

    let maxSlaveIdLength = 0;
    this.resultTables.forEach(rt => {
      if(rt.slave.id.length > maxSlaveIdLength) maxSlaveIdLength = rt.slave.id.length;
    });
    // console.log('maxSlaveIdLength: ' + maxSlaveIdLength);
    for(let index = 0; index < this.resultTables.length; index++) {
      const { slave, continuousDepth } = this.resultTables[index];
      let menuStr = slave.id;
      menuStr = menuStr.padEnd(maxSlaveIdLength + 1);
      let fgColor = cc.reset;
      if(continuousDepth < this.config.alarmDepth) {
        fgColor += cc.fg.red + cc.bright;
      } else if(continuousDepth < this.config.warningDepth) {
        fgColor += cc.fg.yellow + cc.bright;
      }
      if(index === this.itemIndex) {
        fgColor += cc.reverse;
        // menuStr = cc.reverse + menuStr;
      }
      console.log(` ${fgColor}${menuStr}[${continuousDepth}]${cc.reset}`);
    }
  }

  run() {
    process.stdin.on('keypress', this._onKeyPressed);
    this.draw();
  }
}

module.exports = Interface;

(function run() {
  const config = require('./config');
  const resultTables = require('./util').objectFromJsonFile('./misc/result.json', 'utf8');
  const interface = new Interface(config, resultTables);
  interface.run();
})();
