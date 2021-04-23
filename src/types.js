/* eslint-disable max-len */

/** @typedef {import('msnodesqlv8').Connection} Connection */

/**
* @typedef {Object} Cams Набор видеокамер видеосервера
* @prop {string} [id] название камеры
* { camId1:'name1', camId2:'name2', ... }
*/

/**
* @typedef {{id: string, name: string}} CameraDef Описание видеокамеры
* (результат запроса из БД)
*/

/**
* @typedef {{id: string, name: string, vdrive: string}} SlaveDef Описание видеосервера
* (результат запроса из БД)
*/

/**
 * @typedef {Object} DBConfig Конфигурация соединения с БД
 * @prop {string} dbDriver 'DRIVER={ODBC Driver 11 for SQL Server}'
 * @prop {string} dbServer '(local)\\SQLEXPRESS'
 * @prop {string} database 'intellect'
 * @prop {string} uid 'sa'
 * @prop {string} pwd: '???'
 */

/**
 * @typedef {Object} Config Конфигурация приложения
 * @prop {number} deepInHours глубина архива для анализа (в часах)
 * @prop {number} intervalInMinutes мин. временной интервал для анализа (в минутах)
 * @prop {number} warningDepth предупреждение, если непр.глубина меньше данного значения (в днях)
 * @prop {number} alarmDepth тревога, если непр.глубина меньше данного значения (в днях)
 * @prop {number} warningFragmentsCount предупреждение, если количество видеофрагментов <= значения
 * @prop {number} indent отступ слева для названия видеокамеры при выводе результата анализа
 * @prop {number} maxErrorsForServer макс. количество ошибок для прекращения анализа видеосервера
 * @prop {string} [appTitle] packageJson.description
 * @prop {string} [appFullTitle]
 * @prop {string} [appVersion] packageJson.version
 * @prop {DBConfig} db
 */

/**
 * @typedef {Object} AnalysisParams Параметры для анализа видеоархива
 * @prop {number} maxErrorsForServer макс. количество ошибок для прекращения анализа видеосервера
 * @prop {Date} fromTime время отсчёта анализа
 * @prop {number} deepInHours глубина архива для анализа (в часах)
 * @prop {number} intervalInMinutes мин. временной интервал для анализа (в минутах)
 */

/**
 * Карта отмеченных видеофрагментов с разбивкой по видеокамерам
 * @typedef {{camId?: {intervalsFlags: Array<1 | null>, checkedFragmentsCount: number}}} TimeMap
 */
