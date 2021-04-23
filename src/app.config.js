/** @type {Config} */

const config = {
  deepInHours: 12, // глубина архива для анализа (в часах)
  intervalInMinutes: 15, // мин. временной интервал для анализа (в минутах)
  warningDepth: 40, // предупреждение, если непр.глубина меньше данного значения (в днях)
  alarmDepth: 30, // тревога, если непр.глубина меньше данного значения (в днях)
  warningFragmentsCount: 2, // предупреждение, если количество видеофрагментов <= значения
  maxErrorsForServer: 5, // макс. количество ошибок для прекращения анализа
  indent: 40, // отступ слева для названия видеокамеры при выводе результата анализа
  db: {
    dbDriver: 'DRIVER={ODBC Driver 11 for SQL Server}',
    dbServer: '(local)\\SQLEXPRESS',
    database: 'intellect',
    uid: 'sa',
    pwd: 'ITV',
  },
};

module.exports = config;
