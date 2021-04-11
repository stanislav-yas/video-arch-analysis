const sql = require('msnodesqlv8/lib/sql'); // https://github.com/TimelordUK/node-sqlserver-v8/wiki

/**
 * Open database connection
 * @param {{ dbDriver: string, dbServer: string, database: string, uid: string, pwd: string }} p
 * @returns {Promise<Connection>}
 */
async function connOpenAsync({ dbDriver, dbServer, database, uid, pwd }) {
  const connStr = `${dbDriver};Server=${dbServer};database=${database};uid=${uid};pwd=${pwd}`;
  return new Promise((resolve, reject) => {
    sql.open(connStr, (err, conn) => {
      if (err) reject(new Error(`sqlOpenAsync() failed => ${err}`));
      resolve(conn);
    });
  });
}

/**
 * Execute sql query
 * @param {Connection} connection
 * @param {string} query
 * @returns {Promise<any[]>}
 */
async function connQueryAsync(connection, query) {
  return new Promise((resolve, reject) => {
    connection.query(query, (err, results /* , more */) => {
      if (err) reject(new Error(`connQueryAsync() failed => ${err}`));
      resolve(results);
    });
  });
}

module.exports = { connOpenAsync, connQueryAsync };
