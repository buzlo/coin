import router from './_router';
import { el, setChildren } from 'redom';
import '../styles/details.scss';
import TransferForm from './Transfer-form';
import numberFormat from '../helpers/number-format';
import BalanceChart from './Balance-chart';
import TransactionsTable from './Transactions-table';
import Subheader from './Subheader';

export default class {
  constructor(accountData, onTransferSubmit) {
    this.$container = el('.details.container.main-container');

    this.subheader = new Subheader(accountData, 'Просмотр счёта', 'details');

    this.transferForm = new TransferForm(
      'details',
      accountData.account,
      async (transferData) => {
        const payload = await onTransferSubmit(transferData);
        this.balance = payload.balance;
        this.transactionsTable.transactions = payload.transactions;
      }
    );

    this.balanceChart = new BalanceChart({
      parentCssClass: 'details',
      accountData,
      monthsQty: 6,
      href: `/transactions/${accountData.account}`,
    });

    this.transactionsTable = new TransactionsTable({
      parentCssClass: 'details',
      accountData,
      href: `/transactions/${accountData.account}`,
    });

    for (const element of [this.balanceChart.$el, this.transactionsTable.$el]) {
      element.onclick = (event) => {
        event.preventDefault();
        router.navigate(element.getAttribute('href'));
      };
    }

    setChildren(this.$container, [
      this.subheader.$el,
      this.transferForm.$el,
      this.balanceChart.$el,
      this.transactionsTable.$el,
    ]);
  }

  get balance() {
    return this._balance;
  }

  set balance(value) {
    this._balance = value;
    this.subheader.$subheaderBalanceValue.textContent =
      numberFormat(value) + '\u00A0₽';
  }

  selectHandler(parameter, value) {
    this[parameter] = value;
  }
}
