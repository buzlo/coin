export default function (string, short) {
  const date = new Date(string),
    day = ('0' + date.getDate()).slice(-2),
    month = ('0' + (Number(date.getMonth()) + 1)).slice(-2),
    year = date.getFullYear();

  if (short) return day + '.' + month + '.' + year;

  const monthIndex = Number(date.getMonth()),
    monthTexts = [
      'января',
      'февраля',
      'марта',
      'апреля',
      'мая',
      'июня',
      'июля',
      'августа',
      'сентября',
      'октября',
      'ноября',
      'декабря',
    ];

  return day + ' ' + monthTexts[monthIndex] + ' ' + year;
}
