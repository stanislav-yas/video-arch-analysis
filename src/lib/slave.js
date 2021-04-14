/**
 * Видеосервер
 * @property {string} id Id видеосервера
 * @property {string} name название видеосервера
 * @property {string} vdrive id диска с видеоархивом на сервере
 * @property {Cams} cams
 */
class Slave {
  /**
   * @param {string} id Id видеосервера
   * @param {string} name название видеосервера
   * @param {string} vdrive id диска с видеоархивом на сервере
   * @param {Cams} cams
   */
  constructor(id, name, vdrive, cams) {
    this.id = id; // 'SV1',
    this.name = name; // 'Сервер SV1',
    this.vdrive = vdrive; // 'D'
    this.cams = cams;
  }
}

module.exports = Slave;
