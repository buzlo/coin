import { el, setChildren } from 'redom';
import '../styles/history.scss';
import numberFormat from '../helpers/number-format';
import BalanceChart from './Balance-chart';
import TransactionsTable from './Transactions';
import TransactionsChart from './Transactions-chart';
import Subheader from './Subheader';

export default class {
  constructor(accountData) {
    this.$container = el('.history.container.main-container');

    this.$subheader = new Subheader(
      accountData,
      'История баланса',
      'history'
    ).$el;

    this.$balanceChart = new BalanceChart({
      parentCssClass: 'history',
      accountData,
    }).$el;
    this.$transactionsChart = new TransactionsChart({
      parentCssClass: 'history',
      accountData,
    }).$el;

    this.transactionsTable = new TransactionsTable({
      parentCssClass: 'history',
      accountData,
      maxQty: 25,
    });
    this.$transactionsTable = this.transactionsTable.$el;

    setChildren(this.$container, [
      this.$subheader,
      this.$transferForm,
      this.$balanceChart,
      this.$transactionsChart,
      this.$transactionsTable,
    ]);
  }

  get balance() {
    return this._balance;
  }

  set balance(value) {
    this._balance = value;
    this.$historyBalanceValue.textContent = numberFormat(value) + '\u00A0₽';
  }
}
