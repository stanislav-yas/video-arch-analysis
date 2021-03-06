const db = require('./db');
const analizeShareFolders = require('./analize-share-folders');
const {getSlavesMock, getCamsMock} = require('./mock/get-mock-data');

// process.env.MOCK = true;

const connectionParams = {
  dbDriver: 'DRIVER={ODBC Driver 11 for SQL Server}',
  dbServer: '(local)\\SQLEXPRESS',
  database: 'intellect',
  uid: 'sa',
  pwd: 'ITV'
}

const querySlaves = `
  select distinct 
    s.id,
    s.name,
    substring(s.drives, 1, 1) 'vdrive'
  from
    OBJ_CAM c,  OBJ_SLAVE s right JOIN OBJ_GRABBER g on g.parent_id=s.id
  where
    c.parent_id=g.id
    and (c.flags = 0 or c.flags is null)
  order by 1`;

const queryCams = (slaveID) => {
  return (
    `SELECT 
    CAST(c.id as int) 'id',
    c.[name] 'name'
    FROM OBJ_CAM c, OBJ_GRABBER g
    where c.parent_id=g.id
    and (c.flags = 0 or c.flags is null)
    and g.parent_id = '${slaveID}'
    order by 1`
  );
}


let connection = null;

async function checkConnection() {
  if (connection === null) {
    connection = await db.sqlOpenAsync(connectionParams);
  }
}

async function getSlaves() {
  let slaves = null;
  if(process.env.MOCK) {
    slaves = await getSlavesMock();
  } else {
    await checkConnection();
    slaves = await db.connQueryAsync(connection, querySlaves);
  }
  return slaves;
}

async function getCams(slaveID) {
  let cams = null;
  if(process.env.MOCK) {
    cams = getCamsMock(slaveID);
  } else {
    await checkConnection();
    cams = await db.connQueryAsync(connection, queryCams(slaveID));
  }
  return cams;
}

function closeConnection() {
  if (connection !== null) {
    connection.close();
  }
}

async function analize(options) {

  let slaves = await getSlaves();
  // slaves = [slaves[0]]; // for debug use!
  for (const slave of slaves) {
    const cams = await getCams(slave.id); // cams = [{'id1', 'name1'}, {'id2', 'name2'}, ...]
    let camsIX = {}; // camsIX = {id1:'name1', id2:'name2', ...}
    slave.cams = camsIX;
    cams.forEach(cam => {
      camsIX[Number.parseInt(cam.id, 10)] = cam.name;
    });
    //console.log(`Cams count  = ${cams.length}`);
  };

  // require('./util').objectToFile(slaves[10], 'slave.txt', true);
  return analizeShareFolders(slaves, options);
}

module.exports = { analize, getSlaves, getCams, closeConnection };
