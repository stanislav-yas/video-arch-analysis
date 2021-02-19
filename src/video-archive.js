const sql = require('msnodesqlv8');

const dbDriver = 'DRIVER={ODBC Driver 11 for SQL Server}';
const dbServer = '(local)\\SQLEXPRESS';
const database = 'intellect';
const uid = 'sa';
const pwd = 'ITV';

const connStr = `${dbDriver};Server=${dbServer};database=${database};uid=${uid};pwd=${pwd}`;

const query1 = `
  select distinct 
    s.id 'slaveID',
    s.name 'slaveName',
    CAST(s.drives as char) 'vdrives'
  from
    OBJ_CAM c,  OBJ_SLAVE s right JOIN OBJ_GRABBER g on g.parent_id=s.id
  where
    c.parent_id=g.id
    and (c.flags = 0 or c.flags is null)
  order by 1`;

const query2 = `SELECT 
  CAST(c.id as int) 'cam',
  SUBSTRING(c.[name],0,30) 'title'
  FROM OBJ_CAM c, OBJ_GRABBER g
  where c.parent_id=g.id
  and (c.flags = 0 or c.flags is null)
  and g.parent_id = 'SV10'
  order by 1`;

const getSlaves = () => {
  sql.open(connStr, (err, conn) => {
    if (err) {
      console.error(err);
      throw err;
    }
    conn.query(query1, (err, results, more) => {
      if (err) {
        console.error(err);
        throw err;
      }
      console.log(`request returned ${results.length} row(s)`);
      conn.close(() => {
        return results;
      });
    });
  });
}

module.exports = { getSlaves };
