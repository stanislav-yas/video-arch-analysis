const config = {
  deepInHours: 12, // глубина архива для анализа (в часах)
  intervalInMinutes: 15, // минимальный временной интервал для отображения анализа (в минутах)
  db: {
    dbDriver: 'DRIVER={ODBC Driver 11 for SQL Server}',
    dbServer: '(local)\\SQLEXPRESS',
    database: 'intellect',
    uid: 's',
    pwd: 'ITV'
  }
};

module.exports = config;
