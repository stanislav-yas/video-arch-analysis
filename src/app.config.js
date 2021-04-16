const config = {
  deepInHours: 12, // глубина архива для анализа (в часах)
  intervalInMinutes: 15, // мин. временной интервал для анализа (в минутах)
  warningDepth: 40, // предупреждение, если непр.глубина меньше данного значения (в днях)
  alarmDepth: 30, // тревога, если непр.глубина меньше данного значения (в днях)
  maxErrorsForServer: 5, // макс. количество ошибок для прекращения анализа видеосервера
  db: {
    dbDriver: 'DRIVER={ODBC Driver 11 for SQL Server}',
    dbServer: '(local)\\SQLEXPRESS',
    database: 'intellect',
    uid: 'sa',
    pwd: 'ITV',
  },
};

module.exports = config;
