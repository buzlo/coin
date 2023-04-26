import { el, list, setChildren } from 'redom';
import '../styles/details.scss';
import TransferForm from './Transfer-form';
import numberFormat from '../helpers/number-format';
import GoBackBtn from './Go-back-btn';
import BalanceChart from './Balance-chart';
import TransactionsTable from './Transactions';

export default class {
  constructor(accountData, onTransferSubmit) {
    this.$container = el('.details.container.main-container');

    this.$detailsTitle = el('h2.details__title.window-title', 'Просмотр счёта');

    this.$detailsAccountNumber = el(
      'p.details__account-number',
      `№ ${accountData.account}`
    );

    this.$detailsBalanceTitle = el('h3.details__balance-title', 'Баланс:');

    this.$detailsBalanceValue = el(
      'p.details__balance-value',
      numberFormat(accountData.balance.toFixed(2)) + '\u00A0₽'
    );

    this.$detailsBalanceWrapper = el('.details__balance-wrapper', [
      this.$detailsBalanceTitle,
      this.$detailsBalanceValue,
    ]);

    this.$goBackBtn = new GoBackBtn().$el;

    this.$subheader = el('.details__subheader', [
      this.$detailsTitle,
      this.$goBackBtn,
      this.$detailsAccountNumber,
      this.$detailsBalanceWrapper,
    ]);

    this.$transferForm = new TransferForm(
      'details',
      accountData.account,
      async (transferData) => {
        const payload = await onTransferSubmit(transferData);
        this.balance = payload.balance;
        this.transactionsTable.transactions = payload.transactions;
      }
    ).$el;

    this.$balanceChart = new BalanceChart('details', accountData).$el;

    this.transactionsTable = new TransactionsTable('details', accountData);
    this.$transactionsTable = this.transactionsTable.$el;

    setChildren(this.$container, [
      this.$subheader,
      this.$transferForm,
      this.$balanceChart,
      this.$transactionsTable,
    ]);
  }

  get balance() {
    return this._balance;
  }

  set balance(value) {
    this._balance = value;
    this.$detailsBalanceValue.textContent = numberFormat(value) + '\u00A0₽';
  }
}
