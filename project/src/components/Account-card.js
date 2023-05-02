import router from './_router';
import { el, setChildren } from 'redom';
import numberFormat from '../helpers/number-format';
import getDate from '../helpers/get-date';
import '../styles/account-card.scss';

export default class {
  constructor() {
    this.$card = el('.account-card');

    this.$account = el('h2.account-card__number');
    this.$balance = el('p.account-card__balance');

    const $lastTransactionTitle = el(
      'h3.account-card__last-transaction-title',
      'Последняя транзакция'
    );
    this.$lastTransactionDate = el('p.account-card__last-transaction-date');

    const $lastTransactionWrapper = el(
      '.account-card__last-transaction-wrapper',
      $lastTransactionTitle,
      this.$lastTransactionDate
    );

    this.$detailsBtn = el(
      'a.account-card__details-btn.btn.btn_primary',
      'Открыть'
    );

    setChildren(this.$card, [
      this.$account,
      this.$balance,
      $lastTransactionWrapper,
      this.$detailsBtn,
    ]);
  }

  update(accountData) {
    Object.assign(this, accountData);
    this.$account.textContent = this.account;
    this.$balance.textContent = numberFormat(this.balance) + '\u00A0₽';
    this.lastTransactionDate =
      this.transactions.length !== 0 ? this.transactions[0].date : null;
    this.$lastTransactionDate.textContent = this.lastTransactionDate
      ? getDate(this.lastTransactionDate)
      : 'Транзакции отсутствуют';
    this.$detailsBtn.href = `/account/${this.account}`;
    this.$detailsBtn.onclick = (event) => {
      event.preventDefault();
      router.navigate(event.target.getAttribute('href'));
    };
  }
}
