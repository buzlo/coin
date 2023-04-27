import MonthlyChart from './Monthly-Chart';

export default class extends MonthlyChart {
  constructor({ parentCssClass, accountData, monthsQty, href }) {
    super({
      parentCssClass,
      accountData,
      monthsQty,
      href,
      title: 'Соотношение входящих и исходящих транзакций',
    });

    const errorColor = '#ba0000';
    const successColor = '#76ca66';

    const chartOptions = {
      data: {
        labels: this.monthlyData.map((row) => row.monthName),
        datasets: [
          {
            label: 'Исходящие транзакции',
            data: this.monthlyData.map((row) => row.outboundSum),
            backgroundColor: errorColor,
          },
          {
            label: 'Входящие транзакции',
            data: this.monthlyData.map((row) => row.inboundSum),
            backgroundColor: successColor,
          },
        ],
      },
    };
    this.createChartJS(this.$canvas, chartOptions);
  }
}
