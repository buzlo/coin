export default function (accounts, parameter) {
  return accounts.slice().sort((a, b) => {
    let valueA = a[parameter];
    let valueB = b[parameter];

    if (Array.isArray(valueA)) {
      valueA = valueA[0];
      valueA = valueB[0];
    }

    if (valueA < valueB) {
      return 1;
    } else return -1;
  });
}
