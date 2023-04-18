import { el } from 'redom';
import AccountCard from './Account-card';

export default class extends AccountCard {
  constructor(parentCssClass) {
    super(parentCssClass);
    this.el = el(`li.${parentCssClass}__item`, this.$card);
  }
}
