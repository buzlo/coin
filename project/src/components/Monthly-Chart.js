import { el, setChildren } from 'redom';
import '../styles/chart.scss';
import Chart from 'chart.js/auto';

export default class {
  constructor({ parentCssClass, accountData, monthsQty = 12, href, title }) {
    this.$el = el(`a.${parentCssClass}__chart.chart.card.card_light`);
    if (href) this.$el.setAttribute('href', href);
    this.$title = el('h3.chart__title', title);
    this.$canvas = el('canvas.chart__canvas');
    this.$canvasWrapper = el('.chart__canvas-wrapper', this.$canvas);
    setChildren(this.$el, [this.$title, this.$canvasWrapper]);

    this.monthlyData = this.countMonthlyData(accountData, monthsQty);
  }

  countMonthlyData(
    { account, balance: currentBalance, transactions },
    monthsQty
  ) {
    const today = new Date();
    const currentMonth = today.getMonth();
    const currentYear = today.getFullYear();
    this.monthlyData = this.createLastNMonthsArray(currentMonth, 12);

    let consideredMonth = currentMonth;
    let consideredMonthIndex = 12;
    let consideredYear = currentYear;
    const countedData = {
      balance: currentBalance,
      inboundSum: 0,
      outboundSum: 0,
    };

    for (const transaction of transactions.toReversed()) {
      const transactionDate = new Date(transaction.date);
      const transactionMonth = transactionDate.getMonth();
      const transactionYear = transactionDate.getFullYear();
      let outOfRange = false;

      while (
        transactionMonth < consideredMonth ||
        transactionYear < consideredYear
      ) {
        if (consideredMonthIndex < 12) {
          this.monthlyData[consideredMonthIndex].inboundSum =
            countedData.inboundSum.toFixed(2);
          this.monthlyData[consideredMonthIndex].outboundSum =
            countedData.outboundSum.toFixed(2);
        }
        countedData.inboundSum = 0;
        countedData.outboundSum = 0;

        consideredMonthIndex -= 1;
        if (consideredMonth === 0) {
          consideredMonth = 11;
          consideredYear -= 1;
        } else {
          consideredMonth -= 1;
        }

        if (consideredMonth < currentMonth && consideredYear < currentYear) {
          outOfRange = true;
          break;
        }

        this.monthlyData[consideredMonthIndex].balance =
          countedData.balance.toFixed(2);
      }

      if (outOfRange) break;

      const amount =
        transaction.from === account ? -transaction.amount : transaction.amount;
      countedData.balance -= amount;
      if (amount < 0) {
        countedData.outboundSum -= amount;
      } else countedData.inboundSum += amount;
      if (transactions.indexOf(transaction) === 0) {
        this.monthlyData[consideredMonthIndex].inboundSum =
          countedData.inboundSum.toFixed(2);
        this.monthlyData[consideredMonthIndex].outboundSum =
          countedData.outboundSum.toFixed(2);
      }
    }

    return this.monthlyData.slice(-monthsQty);
  }

  getRelativeMonthIndex(month) {
    const startMonth = new Date().getMonth();
    return (12 + month - startMonth) % 12;
  }

  createLastNMonthsArray(currentMonth, qty) {
    const array = [];
    for (let i = 0; i < qty; i++) {
      array.push({
        month: i,
        monthName: getMonthName(i),
      });
      array.sort((a, b) => {
        return (
          this.getRelativeMonthIndex(a.month, currentMonth) -
          this.getRelativeMonthIndex(b.month, currentMonth)
        );
      });
    }
    return array;

    function getMonthName(index) {
      const monthNames = [
        'янв',
        'фев',
        'мар',
        'апр',
        'май',
        'июн',
        'июл',
        'авг',
        'сен',
        'окт',
        'ноя',
        'дек',
      ];
      return monthNames[index];
    }
  }

  createChartJS($canvas, options = {}) {
    const chartAreaBorder = {
      id: 'chartAreaBorder',
      beforeDraw(chart, args, options) {
        const {
          ctx,
          chartArea: { left, top, width, height },
        } = chart;

        ctx.save();
        ctx.strokeStyle = options.borderColor;
        ctx.lineWidth = options.borderWidth;
        ctx.setLineDash(options.borderDash || []);
        ctx.lineDashOffset = options.borderDashOffset;
        ctx.strokeRect(left, top, width, height);
        ctx.restore();
      },
    };

    const updatedOptions = {
      ...options,
      type: 'bar',
      plugins: [chartAreaBorder],
      options: {
        maintainAspectRatio: false,
        plugins: {
          legend: {
            display: false,
          },
          chartAreaBorder: {
            borderColor: 'black',
            borderWidth: 1,
          },
        },
        scales: {
          x: {
            stacked: true,
          },
          y: {
            position: 'right',
            stacked: true,
          },
        },
      },
    };
    new Chart($canvas, updatedOptions);
  }
}
