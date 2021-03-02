const {colours: cc} = require('./util');
const { displayResultTable } = require('./display-results');
const readline = require('readline');

const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout
});

readline.emitKeypressEvents(process.stdin);
process.stdin.setRawMode(true);

// (function test(){
//   const checkPressedKey = (str, key) => {
//     if (key.ctrl && key.name === 'c') {
//       process.exit();
//     } else {
//       console.log(`You pressed the "${str}" key`);
//       console.log();
//       console.log(key);
//       console.log();
//     }
//   };

//   process.stdin.on('keypress', checkPressedKey);
//   console.log('Press any key...');
// })();


// key.name: 'down', str: "undefined" - key Arrow Down
// key.name: 'up', str: "undefined" - key Arrow Up
// key.name: 'space', str: " " - key Space
// key.name: 'escape', str: "undefined" - key Escape
// key.name: 'return', str: "\r" - key Enter (Return)

class Interface {
  constructor(resultTables) {
    this.resultTables = resultTables;
    this.itemIndex = 0;
  }

  _onKeyPressed = (str, key) => {
    switch (key.name) {

      case 'down':
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
        rl.close();
        process.exit(0);

      case 'space':
      case 'return':

    }
  }

  draw() {
    console.clear();
    this.showMenu();
    //console.log(rl.getCursorPos());
    this.showResult();
    //console.log(rl.getCursorPos());
  }

  showResult() {
    displayResultTable(this.resultTables[this.itemIndex], 40);
  }

  showMenu() {
    let menuStr = cc.reset;
    menuStr += `\nВыбирите доступный сервер для просмотра результата анализа видеофайлов (↑ ↓ Space/Enter):\n`;

    for (let index = 0; index < this.resultTables.length; index++) {
      const resultTable = this.resultTables[index];

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

(function run() {
  const resultTables = require('./util').objectFromJsonFile('./misc/result.json', 'utf8');
  const interface = new Interface(resultTables);
  interface.run();
})();