import { el, setChildren } from 'redom';
import Spinner from './Spinner';
import Loader from './Loader';
import '../styles/loading-card.scss';

export default class {
  constructor() {
    this.$el = el('.loading-card.card.card_dark');
    this.spinner = new Spinner();
    this.loader = new Loader();

    setChildren(this.$el, [this.spinner.$el, this.loader.$el]);
  }
}
