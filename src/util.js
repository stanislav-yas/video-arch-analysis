/**
 * Getting Date strings
 * @param {Date} date 
 */
const dateStrings = (date) => {
  const MONTHS = [`January`, `February`, `March`, `April`, `May`, `June`, `July`, `August`,
    `September`, `October`, `November`, `December`];
  return {
    D: date.getDate().toString(),
    DD: (`0` + date.getDate()).slice(-2),
    M: (date.getMonth() + 1).toString(),
    MM: (`0` + (date.getMonth() + 1)).slice(-2),
    MMM: MONTHS[date.getMonth()].slice(0, 3),
    MMMM: MONTHS[date.getMonth()],
    YY: date.getFullYear().toString().slice(-2),
    YYYY: date.getFullYear().toString(),
    hh: (`0` + date.getHours()).slice(-2),
    mm: (`0` + date.getMinutes()).slice(-2),
    ss: (`0` + date.getSeconds()).slice(-2),
    ampm: (date.getHours() >= 12 ? `PM` : `AM`)
  };
};

module.exports = {
  dateStrings
}
