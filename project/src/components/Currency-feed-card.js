import { el, setChildren } from 'redom';
import numberFormat from '../helpers/number-format';
import createSvgEl from '../helpers/create-svg-el';
import '../styles/currency-feed.scss';
import arrowGrowthSvg from '../assets/images/svg/arrow-growth.svg?source';
import arrowDeprecationSvg from '../assets/images/svg/arrow-deprecation.svg?source';

export default class {
  constructor(parentCssClass) {
    this.$el = el(
      `.${parentCssClass}__currency-feed.currency-feed.card.card_dark`
    );

    const $title = el(
      'h2.currency-feed__number',
      'Изменение курсов в реальном времени'
    );

    this.$list = el('ul.currency-feed__list');

    setChildren(this.$el, [$title, this.$list]);
  }

  get currencyFeed() {
    return this._currencyFeed;
  }

  set currencyFeed(array) {
    this._currencyFeed = array;
    const $currencyFeedItems = [];
    for (const object of array.toReversed()) {
      const currencyFeedData = object;

      const $currencyFeedCodes = el(
        'h3.currency-feed__item-title',
        `${currencyFeedData.from}/${currencyFeedData.to}`
      );
      const $currencyFeedFiller = el('span.currency-feed__item-filler');
      const $currencyFeedAmount = el(
        'span.currency-feed__item-amount',
        numberFormat(currencyFeedData.rate)
      );

      const $currencyItem = el('li.currency-feed__item', [
        $currencyFeedCodes,
        $currencyFeedFiller,
        $currencyFeedAmount,
      ]);

      if (currencyFeedData.change === 1) {
        $currencyItem.append(createSvgEl(arrowGrowthSvg));
        $currencyItem.classList.add('currency-feed__item_growing');
      } else if (currencyFeedData.change === -1) {
        $currencyItem.append(createSvgEl(arrowDeprecationSvg));
        $currencyItem.classList.add('currency-feed__item_deprecating');
      }

      $currencyFeedItems.push($currencyItem);
    }
    setChildren(this.$list, $currencyFeedItems);
  }
}
