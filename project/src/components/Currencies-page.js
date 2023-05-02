import { el, setChildren } from 'redom';
import '../styles/currencies.scss';
import MyCurrenciesCard from './My-currencies-card';
import CurrencyFeedCard from './Currency-feed-card';
import ExchangeForm from './Exchange-form';

export default class {
  constructor(myCurrenciesData, onExchangeSubmit) {
    this.$container = el('.currencies.container.main-container');

    const $currenciesTitle = el(
      'h2.currencies__title.window-title',
      'Валютный обмен'
    );

    this.myCurrencies = new MyCurrenciesCard({
      parentCssClass: 'currencies',
      myCurrenciesData,
    });

    this.exchangeForm = new ExchangeForm(
      'currencies',
      myCurrenciesData,
      async (exchangeData) => {
        const payload = await onExchangeSubmit(exchangeData);
        this.currencies = payload;
      }
    );

    const $myCurrenciesWrapper = el('.currencies__wrapper', [
      this.myCurrencies.$el,
      this.exchangeForm.$el,
    ]);

    this.currencyFeedCard = new CurrencyFeedCard('currencies');

    setChildren(this.$container, [
      $currenciesTitle,
      $myCurrenciesWrapper,
      this.currencyFeedCard.$el,
    ]);
  }

  get currencies() {
    return this.myCurrencies.currencies;
  }

  set currencies(value) {
    this.myCurrencies.currencies = value;
  }

  get currencyFeed() {
    return this.currencyFeedCard.currencyFeed;
  }

  set currencyFeed(array) {
    this.currencyFeedCard.currencyFeed = array;
  }
}
