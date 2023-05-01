import { el, setChildren } from 'redom';
import '../styles/error-card.scss';

export default class {
  constructor(message) {
    this.$el = el('.error-card.card.card_dark');
    const $errorMessage = el(
      'p.form__status-label.form__status-label_error',
      message
    );

    setChildren(this.$el, [$errorMessage]);
  }
}
