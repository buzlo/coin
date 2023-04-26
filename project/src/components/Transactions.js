import { el, mount, setChildren } from 'redom';
import getDate from '../helpers/get-date';
import numberFormat from '../helpers/number-format';
import '../styles/transactions.scss';

export default class {
  constructor(parentCssClass, accountData) {
    this.account = accountData.account;

    this.$el = el(`a.${parentCssClass}__transactions.transactions`, {
      href: `/transactions/${this.account}`,
    });
    this.$table = el('table.transactions__table');
    const $caption = el('caption.transactions__caption', 'История переводов');
    const $theadTR = el('tr.transactions__thead-row');
    const $thead = el('thead.transactions__thead', $theadTR);
    const theadTexts = ['Счёт отправителя', 'Счёт получателя', 'Сумма', 'Дата'];
    for (const text of theadTexts) {
      const $TH = el('th.transactions__thead-cell', text);
      mount($theadTR, $TH);
    }

    this.$tbody = el('tbody.transactions__tbody');
    this.transactions = accountData.transactions;

    setChildren(this.$table, [$caption, $thead, this.$tbody]);
    mount(this.$el, this.$table);
  }

  get transactions() {
    return this._accountData;
  }

  set transactions(transactionsArr) {
    this.transactionRows = [];
    for (const transaction of transactionsArr.toReversed()) {
      if (this.transactionRows.length >= 10) break;

      const isInbound = transaction.to === this.account;

      const $transactionRow = el('tr.transactions__row');
      const $fromTD = el('td.transactions__cell', transaction.from);
      const $toTD = el('td.transactions__cell', transaction.to);
      const $amountTD = el(
        `td.transactions__cell.${isInbound ? 'text-success' : 'text-error'}`,
        (isInbound ? '+\u00A0' : '-\u00A0') +
          numberFormat(transaction.amount.toFixed(2)) +
          '\u00A0₽'
      );
      const $dateTD = el(
        'td.transactions__cell',
        getDate(transaction.date, true)
      );

      setChildren($transactionRow, [$fromTD, $toTD, $amountTD, $dateTD]);
      mount(this.$tbody, $transactionRow);
      this.transactionRows.push($transactionRow);
    }
  }

  get transactionRows() {
    return this._transactionRows;
  }

  set transactionRows(elArray) {
    this._transactionRows = elArray;
    setChildren(this.$tbody, elArray);
  }
}
