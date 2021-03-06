const fs  = require('fs');
const path = require('path');

const slavesMockDirPath = path.join(process.cwd(), 'mock-data', 'slaves');

async function getSlavesMock(){
  const slaves = [];
  const dir = await fs.promises.opendir(slavesMockDirPath);
  for await (const dirent of dir) {
    // console.log(dirent.name);
    slaves.push({
      id: dirent.name,
      name: `Компьютер ${dirent.name}`,
      vdrive: ''
    });
  }
  return slaves;
}

function getCamsMock(slaveID) {
  const camsJSPath = path.join(slavesMockDirPath, slaveID, 'cams.js');
  const cams = require(camsJSPath);
  return cams;
}

module.exports = {
  getSlavesMock,
  getCamsMock
}

// getSlaves().then((slaves) => console.log(slaves));
