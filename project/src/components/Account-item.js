import { el } from 'redom';
import AccountCard from './Account-card';

export default class extends AccountCard {
  constructor() {
    super();
    this.el = el('li.accounts__item', this.$card);
  }
}
