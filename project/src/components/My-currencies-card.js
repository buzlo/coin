import { el, setChildren } from 'redom';
import numberFormat from '../helpers/number-format';
import '../styles/my-currencies.scss';

export default class {
  constructor({ parentCssClass, myCurrenciesData }) {
    this.$el = el(
      `.${parentCssClass}__my-currencies.my-currencies.card.card_light`
    );

    const $title = el('h2.my-currencies__number', 'Ваши валюты');

    this.$list = el('ul.my-currencies__list');

    setChildren(this.$el, [$title, this.$list]);
    this.currencies = myCurrenciesData;
  }

  get currencies() {
    return this._currencies;
  }

  set currencies(currenciesData) {
    this._currencies = currenciesData;
    const $currencyItemsArr = [];
    for (const id in currenciesData) {
      const currencyData = currenciesData[id];

      const $currencyCode = el(
        'h3.my-currencies__item-title',
        currencyData.code
      );
      const $currencyFiller = el('span.my-currencies__item-filler');
      const $currencyAmount = el(
        'span.my-currencies__item-amount',
        numberFormat(currencyData.amount)
      );
      const $currencyItem = el('li.my-currencies__item', [
        $currencyCode,
        $currencyFiller,
        $currencyAmount,
      ]);

      $currencyItemsArr.push($currencyItem);
    }
    setChildren(this.$list, $currencyItemsArr);
  }
}
