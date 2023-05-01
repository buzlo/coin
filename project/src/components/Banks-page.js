import { el, setChildren } from 'redom';
import CustomYMap from './Map';
import '../styles/banks.scss';
export default class {
  constructor(banksData) {
    this.$container = el('.banks.container.main-container');
    const $banksTitle = el('h2.banks__title.window-title', 'Карта банкоматов');
    this.map = new CustomYMap(banksData);
    setChildren(this.$container, [$banksTitle, this.map.$el]);
  }
}
