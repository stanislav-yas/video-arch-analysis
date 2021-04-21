// @ts-check
/** @typedef {import('../app.config')} Config параметры анализа */
/** @typedef {import('../lib/analysis-result')} AnalysisResult результат анализа */

const readline = require('readline');
const { colours: cc } = require('../lib/util');
const { displayResult } = require('./display-results');

const { stdout } = process;
const alarmColor = cc.fg.red + cc.bright;
const warnColor = cc.fg.yellow + cc.bright;
readline.emitKeypressEvents(process.stdin);
process.stdin.setRawMode(true);

class Interface {
  /**
   * Интерфейс программы
   * @param {Config} config
   * @param {AnalysisResult[]} aResults
   */
  constructor(config, aResults) {
    this.config = config;
    this.aResults = aResults;
    this.itemIndex = 0;
    this._onKeyPressed = this._onKeyPressed.bind(this);
  }

  _onKeyPressed(str, key) {
    switch (key.name) {
      case 'down':
      case 'space':
      case 'return':
        this.itemIndex++;
        if (this.itemIndex === this.aResults.length) {
          this.itemIndex = 0;
        }
        this.draw();
        break;
      case 'up':
        this.itemIndex--;
        if (this.itemIndex < 0) {
          this.itemIndex = this.aResults.length - 1;
        }
        this.draw();
        break;
      case 'escape':
        process.exit(0);
      // no default
    }
  }

  draw() {
    console.clear();
    stdout.write(`${this.config.appFullTitle}\n`);
    this.showMenu();
    this.showResult();
  }

  showResult() {
    displayResult(this.aResults[this.itemIndex], 40);
  }

  showMenu() {
    stdout.write(`\n${cc.reset} Выбирите доступный компьютер с видеоархивом (${cc.fg.yellow}↑ ↓ Space Enter , Esc - выход${cc.reset}):\n\n компьютер  [непрер. глубина в/архива в днях]\n\n`);

    let maxSlaveIdLength = 0;
    // вычисление максимальной длины id видеосерверов
    this.aResults.forEach((aResult) => {
      if (aResult.slave.id.length > maxSlaveIdLength) maxSlaveIdLength = aResult.slave.id.length;
    });
    for (let index = 0; index < this.aResults.length; index++) {
      const { slave, continuousDepth, alarmedCams } = this.aResults[index];
      let menuStr = slave.id;
      menuStr = menuStr.padEnd(maxSlaveIdLength + 1);
      let fgColor = cc.reset;
      if (continuousDepth < this.config.alarmDepth) {
        fgColor += alarmColor;
      } else if (continuousDepth < this.config.warningDepth
       || alarmedCams.length !== 0) {
        fgColor += warnColor;
      }
      if (index === this.itemIndex) {
        fgColor += cc.reverse;
      }
      stdout.write(` ${fgColor}${menuStr}[${continuousDepth}]${cc.reset}\n`);
    }
  }

  run() {
    process.stdin.on('keypress', this._onKeyPressed);
    this.draw();
  }
}

module.exports = Interface;

// (function run() {
//   const config = require('./config');
//   const resultTables = require('./util').objectFromJsonFile('./misc/result.json', 'utf8');
//   const interface = new Interface(config, resultTables);
//   interface.run();
// })();
