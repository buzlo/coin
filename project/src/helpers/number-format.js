export default function numberFormat(value) {
  return new Intl.NumberFormat(['ru']).format(value);
}
