import { el } from 'redom';
import GoBackBtn from './Go-back-btn';
import numberFormat from '../helpers/number-format';
import '../styles/subheader.scss';

export default class {
  constructor(accountData, title, parentCssClass) {
    this.$subheaderTitle = el('h2.subheader__title.window-title', title);

    this.$subheaderAccountNumber = el(
      'p.subheader__account-number',
      `№ ${accountData.account}`
    );

    this.$subheaderBalanceTitle = el('h3.subheader__balance-title', 'Баланс:');

    this.$subheaderBalanceValue = el(
      'p.subheader__balance-value',
      numberFormat(accountData.balance.toFixed(2)) + '\u00A0₽'
    );

    this.$subheaderBalanceWrapper = el('.subheader__balance-wrapper', [
      this.$subheaderBalanceTitle,
      this.$subheaderBalanceValue,
    ]);

    this.$goBackBtn = new GoBackBtn('subheader').$el;

    this.$el = el(`.${parentCssClass}__subheader.subheader`, [
      this.$subheaderTitle,
      this.$goBackBtn,
      this.$subheaderAccountNumber,
      this.$subheaderBalanceWrapper,
    ]);
  }
}
