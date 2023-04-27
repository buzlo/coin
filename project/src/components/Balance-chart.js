import MonthlyChart from './Monthly-Chart';

export default class extends MonthlyChart {
  constructor({ parentCssClass, accountData, monthsQty, href }) {
    super({
      parentCssClass,
      accountData,
      monthsQty,
      href,
      title: 'Динамика баланса',
    });
    const primaryColor = '#116ACC';

    const chartOptions = {
      data: {
        labels: this.monthlyData.map((row) => row.monthName),
        datasets: [
          {
            data: this.monthlyData.map((row) => row.balance),
            backgroundColor: primaryColor,
          },
        ],
      },
    };
    this.createChartJS(this.$canvas, chartOptions);
  }
}
