const sql = require('msnodesqlv8'); // https://github.com/TimelordUK/node-sqlserver-v8/wiki

const connectionParamsDefault = {
  dbDriver: 'DRIVER={ODBC Driver 11 for SQL Server}',
  dbServer: '(local)\\SQLEXPRESS',
  database: 'intellect',
  uid: 'sa',
  pwd: 'ITV',
};

const sqlOpenAsync = (connectionOptions = connectionParamsDefault) => {
  const { dbDriver, dbServer, database, uid, pwd } = connectionOptions;
  const connectionString = `${dbDriver};Server=${dbServer};database=${database};uid=${uid};pwd=${pwd}`;
  return new Promise((resolve, reject) => {
    sql.open(connectionString, (err, conn) => {
      if (err) reject(new Error(`sqlOpenAsync() failed => ${err}`));
      resolve(conn);
    });
  });
};

const connQueryAsync = (connection, query) => new Promise((resolve, reject) => {
  connection.query(query, (err, results /* , more */) => {
    if (err) reject(new Error(`connQueryAsync() failed => ${err}`));
    resolve(results);
  });
});

module.exports = { sqlOpenAsync, connQueryAsync };
