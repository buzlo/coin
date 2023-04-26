import { el, setChildren } from 'redom';
import '../styles/balance-chart.scss';
import createChart from '../helpers/create-chart';

export default class {
  constructor(parentCssClass, accountData) {
    this.$el = el(`a.${parentCssClass}__balance-chart.balance-chart`, {
      href: `/transactions/${accountData.account}`,
    });
    this.$title = el('h3.balance-chart__title', 'Динамика баланса');
    this.$canvas = el('canvas.balance-chart__canvas#balance-chart-canvas');
    this.$canvasWrapper = el('.balance-chart__canvas-wrapper', this.$canvas);
    setChildren(this.$el, [this.$title, this.$canvasWrapper]);

    this.monthlyBalance = this.countMonthlyBalance(accountData, 6);

    createChart(this.$canvas, this.monthlyBalance);
  }

  countMonthlyBalance(
    { account, balance: currentBalance, transactions },
    monthsQty = 12
  ) {
    const today = new Date();
    const currentMonth = today.getMonth();
    const currentYear = today.getFullYear();
    const monthlyBalance = [];

    for (let i = 0; i < 12; i++) {
      monthlyBalance.push({
        month: i,
        monthName: getMonthName(i),
      });
      monthlyBalance.sort((a, b) => {
        return (
          getRelativeMonthIndex(a.month, currentMonth) -
          getRelativeMonthIndex(b.month, currentMonth)
        );
      });
    }

    let consideredMonth = currentMonth;
    let consideredYear = currentYear;
    let balance = currentBalance;

    for (const transaction of transactions.toReversed()) {
      const transactionDate = new Date(transaction.date);
      const transactionMonth = transactionDate.getMonth();
      const transactionYear = transactionDate.getFullYear();

      if (
        currentYear - transactionYear > 1 ||
        (transactionMonth <= currentMonth && transactionYear < currentYear)
      ) {
        setBalanceFromTo(currentMonth, consideredMonth, balance);
        break;
      }

      if (
        transactionMonth < consideredMonth ||
        transactionYear < consideredYear
      ) {
        setBalanceFromTo(transactionMonth, consideredMonth, balance);
        consideredMonth = transactionMonth;
        consideredYear = transactionYear;
      }

      const amount =
        transaction.from === account ? -transaction.amount : transaction.amount;
      balance -= amount;
    }

    return monthlyBalance.slice(-monthsQty);

    function getRelativeMonthIndex(month) {
      const startMonth = new Date().getMonth();
      return (12 + month - startMonth) % 12;
    }

    function setBalanceFromTo(fromMonth, toMonth, balance) {
      for (
        let i = getRelativeMonthIndex(fromMonth);
        i < (getRelativeMonthIndex(toMonth) || 12);
        i++
      ) {
        monthlyBalance[i].balance = balance.toFixed(2);
      }
    }

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
}
