const sql = require('msnodesqlv8');

const dbDriver = 'DRIVER={ODBC Driver 11 for SQL Server}';
const dbServer = '(local)\\SQLEXPRESS';
const database = 'intellect';
const uid = 'sa';
const pwd = 'ITV';

const connStr = `${dbDriver};Server=${dbServer};database=${database};uid=${uid};pwd=${pwd}`;

const querySlaves = `
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

const queryCams = `SELECT 
  CAST(c.id as int) 'cam',
  SUBSTRING(c.[name],0,30) 'title'
  FROM OBJ_CAM c, OBJ_GRABBER g
  where c.parent_id=g.id
  and (c.flags = 0 or c.flags is null)
  and g.parent_id = 'SV10'
  order by 1`;

const sqlOpenAsync = (connectionString) => {
  return new Promise ((resolve, reject) => {
    sql.open(connectionString, (err, conn) => {
      if(err) reject(`sqlOpenAsync() failed => ${err}`);
      resolve(conn);
    });
  });
};

const connQueryAsync = (connection, query) => {
  return new Promise((resolve, reject) => {
    connection.query(query, (err, results /*, more*/) => {
      if(err) reject(`connQueryAsync() failed => ${err}`);
      resolve(results);
    });
  });
};

let connection = null;

const getSlaves = async () => {
  if (connection === null) {
    connection = await sqlOpenAsync(connStr);
  }
  const result = await connQueryAsync(connection, querySlaves);
  return result;
};

const closeConnection = () => {
  if(connection !== null) {
    connection.close();
  }
};

// const getSlaves = () => {
//   sql.open(connStr, (err, conn) => {
//     if (err) {
//       console.error(err);
//       throw err;
//     }
//     conn.query(query1, (err, results, more) => {
//       if (err) {
//         console.error(err);
//         throw err;
//       }
//       console.log(`request returned ${results.length} row(s)`);
//       conn.close(() => {
//         return results;
//       });
//     });
//   });
// }

module.exports = { getSlaves, closeConnection };
