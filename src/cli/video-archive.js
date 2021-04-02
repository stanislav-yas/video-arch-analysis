const db = require('./db');
const analizeShareFolders = require('./analize-share-folders');

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

const queryCams = (slaveID) => (
  `SELECT 
  CAST(c.id as int) 'id',
  c.[name] 'name'
  FROM OBJ_CAM c, OBJ_GRABBER g
  where c.parent_id=g.id
  and (c.flags = 0 or c.flags is null)
  and g.parent_id = '${slaveID}'
  order by 1`
);

class VideoArchive {
  constructor(config) {
    this.config = config;
    this.connection = null;
    this.connectionOptions = config.db;
  }

  async checkConnection() {
    if (this.connection === null) {
      this.connection = await db.sqlOpenAsync(this.connectionOptions);
    }
  }

  async getSlaves() {
    await this.checkConnection();
    const slaves = await db.connQueryAsync(this.connection, querySlaves);
    return slaves;
  }

  async getCams(slaveID) {
    await this.checkConnection();
    const cams = await db.connQueryAsync(this.connection, queryCams(slaveID));
    return cams;
  }

  async analize() {
    const slaves = await this.getSlaves();
    // slaves = [slaves[0]]; // for debug use!
    // eslint-disable-next-line no-restricted-syntax
    for (const slave of slaves) {
      const cams = await this.getCams(slave.id); // cams = [{'id1', 'name1'}, {'id2', 'name2'}, ...]
      const camsIX = {}; // camsIX = {id1:'name1', id2:'name2', ...}
      slave.cams = camsIX;
      cams.forEach((cam) => {
        camsIX[Number.parseInt(cam.id, 10)] = cam.name;
      });
      // console.log(`Cams count  = ${cams.length}`);
    }

    // require('./util').objectToFile(slaves[10], 'slave.txt', true);
    return analizeShareFolders(slaves, this.config);
  }

  closeConnection() {
    if (this.connection !== null) {
      this.connection.close();
    }
  }
}

if (process.MOCK) {
  const { getSlaves, getCams } = require('./mock/get-mock-data');
  VideoArchive.prototype.getSlaves = getSlaves;
  VideoArchive.prototype.getCams = getCams;
}

module.exports = VideoArchive;
