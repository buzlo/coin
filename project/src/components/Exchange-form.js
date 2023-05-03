import { el, mount, setChildren, unmount } from 'redom';
import '../styles/exchange-form.scss';
import JustValidate from 'just-validate';
import Select from './Select';
import CustomChoices from './Custom-choices';

export default class {
  constructor(parentCssClass, currencyData, onExchangeSubmit) {
    this.$el = el(
      `form.${parentCssClass}__exchange-form.exchange-form.form.card.card_light`
    );
    this.$title = el('h3.exchange-form__title', 'Обмен валют');

    const currencyOptions = [];
    for (const key in currencyData) {
      currencyOptions.push({ text: key, value: key.toLowerCase() });
    }

    this.fromSelect = new Select('exchange-form', currencyOptions, (value) =>
      this.selectHandler('from', value)
    );
    const $fromSelectLabel = el(
      'label.exchange-form__label.form__label',
      'Из',
      this.fromSelect.$el
    );
    this.from = this.fromSelect.value;

    this.toSelect = new Select('exchange-form', currencyOptions, (value) =>
      this.selectHandler('to', value)
    );
    const $toSelectLabel = el(
      'label.exchange-form__label.form__label',
      'в',
      this.toSelect.$el
    );
    this.to = this.toSelect.value;

    const $fromToWrapper = el(
      '.exchange-form__labels-wrapper',
      $fromSelectLabel,
      $toSelectLabel
    );

    this.$amountInput = el('input.exchange-form__input.form__input');
    const $amountLabel = el(
      'label.exchange-form__label.form__label',
      'Сумма',
      this.$amountInput
    );

    this.$submitBtn = el(
      'button.exchange-form__btn.btn.btn_primary',
      'Обменять',
      { type: 'submit' }
    );

    this.$exhangeSuccessMessage = el(
      'p.form__status-label.form__status-label_success',
      'Обмен осуществлён успешно'
    );

    this.$exchangeErrorMessage = el(
      'p.form__status-label.form__status-label_error'
    );

    const validation = new JustValidate(this.$el, {
      errorLabelCssClass: ['form__status-label', 'form__status-label_error'],
      successLabelCssClass: [
        'form__status-label',
        'form__status-label_success',
      ],
      successLabelStyle: {},
      errorLabelStyle: {},
    });

    const allowedPattern = /[\d.]/;

    this.$amountInput.addEventListener('keypress', (event) => {
      if (!allowedPattern.test(event.key)) {
        event.preventDefault();
      }

      this.exchangeError = false;
    });

    validation.addField(this.$amountInput, [
      {
        rule: 'required',
        errorMessage: 'Обязательное поле',
      },
    ]);

    validation.onSuccess(async (event) => {
      event.preventDefault();

      try {
        await onExchangeSubmit({
          from: this.from.toUpperCase(),
          to: this.to.toUpperCase(),
          amount: Number(this.$amountInput.value).toFixed(2),
        });
        this.$amountInput.value = '';
        this.exchangeSuccess = true;
      } catch (error) {
        if (error.name !== 'Error') throw error;
        let errorMessage;
        switch (error.message) {
          case 'Unknown currency code':
            errorMessage = 'Ошибка валюты';
            break;
          case 'Overdraft prevented':
          case 'Not enough currency':
            errorMessage = 'Недостаточно средств для обмена';
            break;
          case 'Invalid amount':
            errorMessage = 'Некорректный формат суммы';
            break;
          default:
            errorMessage = 'Возникла ошибка. Попробуйте позднее';
        }
        this.$exchangeErrorMessage.textContent = errorMessage;
        this.exchangeError = true;
      }
    });

    setChildren(this.$el, [
      this.$title,
      $fromToWrapper,
      $amountLabel,
      this.$submitBtn,
    ]);

    [this.fromSelect.$el, this.toSelect.$el].forEach(
      ($select) => new CustomChoices($select, 'exchange-form')
    );
  }

  get recipients() {
    return new Set(JSON.parse(localStorage.getItem('coin-recipients')));
  }

  set recipients(stringSet) {
    this.updateRecipientsOptions(stringSet);
    localStorage.setItem(
      'coin-recipients',
      JSON.stringify(Array.from(stringSet))
    );
  }

  get exchangeSuccess() {
    return this._exchangeSuccess;
  }

  set exchangeSuccess(boolean) {
    if (boolean) {
      mount(this.$el, this.$exhangeSuccessMessage);
      return;
    }

    unmount(this.$el, this.$exhangeSuccessMessage);
  }

  get exchangeError() {
    return this._exchangeError;
  }

  set exchangeError(boolean) {
    if (!boolean) {
      unmount(this.$el, this.$exchangeErrorMessage);
      return;
    }

    mount(this.$el, this.$exchangeErrorMessage);
  }

  get from() {
    return this.fromSelect.value;
  }

  set from(value) {
    this.fromSelect.value = value;
  }

  get to() {
    return this.toSelect.value;
  }

  set to(value) {
    this.toSelect.value = value;
  }

  selectHandler(property, value) {
    this[property] = value;
  }
}
