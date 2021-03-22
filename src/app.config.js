const config = {
  deepInHours: 12, // глубина архива для анализа (в часах)
  intervalInMinutes: 15, // минимальный временной интервал для отображения анализа (в минутах)
  warningDepth: 40, // предупреждение, если непр.глубина меньше данного значения (в днях)
  alarmDepth: 30, // тревога, если непр.глубина меньше данного значения (в днях)
  db: {
    dbDriver: 'DRIVER={ODBC Driver 11 for SQL Server}',
    dbServer: '(local)\\SQLEXPRESS',
    database: 'intellect',
    uid: 'sa',
    pwd: 'ITV'
  },
  MOCK: true // true if use mock data
};

module.exports = config;
