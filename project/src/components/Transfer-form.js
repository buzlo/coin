import { el, mount, setChildren, unmount } from 'redom';
import createSvgEl from '../helpers/create-svg-el';
import mailSvg from '../assets/images/svg/mail.svg?source';
import '../styles/transfer-form.scss';
import JustValidate from 'just-validate';

export default class {
  constructor(parentCssClass, accountNum, onTransferSubmit) {
    this.$el = el(`form.${parentCssClass}__transfer-form.transfer-form.form`);
    this.$title = el('h3.transfer-form__title', 'Новый перевод');
    this.$recipientInput = el('input.transfer-form__input.form__input', {
      list: 'recipients-list',
    });
    this.$recipientsList = el('datalist#recipients-list');
    this.updateRecipientsOptions(this.recipients);
    this.$recipientLabel = el(
      'label.transfer-form__label.form__label',
      'Номер счёта получателя',
      this.$recipientInput,
      this.$recipientsList
    );
    this.$amountInput = el('input.transfer-form__input.form__input');
    this.$amountLabel = el(
      'label.transfer-form__label.form__label',
      'Сумма перевода',
      this.$amountInput
    );

    this.$submitBtn = el(
      'button.transfer-form__btn.btn.btn_primary',
      createSvgEl(mailSvg),
      'Отправить',
      { type: 'submit' }
    );

    this.$transferSuccessMessage = el(
      'p.form__status-label.form__status-label_success',
      'Перевод осуществлён успешно'
    );

    this.$transferErrorMessage = el(
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

    const inputPatternObjs = [
      {
        $input: this.$recipientInput,
        allowedPattern: /\d/,
      },
      {
        $input: this.$amountInput,
        allowedPattern: /[\d.]/,
      },
    ];

    for (const { $input, allowedPattern } of inputPatternObjs) {
      validation.addField($input, [
        {
          rule: 'required',
          errorMessage: 'Все поля обязательны',
        },
      ]);
      $input.addEventListener('keypress', (event) => {
        if (!allowedPattern.test(event.key)) {
          event.preventDefault();
        }

        this.transferError = false;
      });
    }

    validation.onSuccess(async (event) => {
      event.preventDefault();

      try {
        await onTransferSubmit({
          from: accountNum,
          to: this.$recipientInput.value,
          amount: Number(this.$amountInput.value).toFixed(2),
        });
        const recipients = this.recipients;
        recipients.add(this.$recipientInput.value);
        this.recipients = recipients;
        this.$recipientInput.value = '';
        this.$amountInput.value = '';
        this.transferSuccess = true;
      } catch (error) {
        if (error.name !== 'Error') throw error;
        let errorMessage;
        switch (error.message) {
          case 'Invalid account to':
            errorMessage = 'Указан несуществующий счёт получателя';
            break;
          case 'Overdraft prevented':
            errorMessage = 'Недостаточно средств для перевода';
            break;
          case 'Invalid amount':
            errorMessage = 'Некорректный формат суммы';
            break;
          default:
            errorMessage = 'Возникла ошибка. Попробуйте позднее';
        }
        this.$transferErrorMessage.textContent = errorMessage;
        this.transferError = true;
      }
    });

    setChildren(this.$el, [
      this.$title,
      this.$recipientLabel,
      this.$amountLabel,
      this.$submitBtn,
    ]);
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

  get transferSuccess() {
    return this._transferSuccess;
  }

  set transferSuccess(boolean) {
    if (boolean) {
      mount(this.$el, this.$transferSuccessMessage);
      return;
    }

    unmount(this.$el, this.$transferSuccessMessage);
  }

  get transferError() {
    return this._transferError;
  }

  set transferError(boolean) {
    if (!boolean) {
      unmount(this.$el, this.$transferErrorMessage);
      return;
    }

    mount(this.$el, this.$transferErrorMessage);
  }

  updateRecipientsOptions(stringSet) {
    const $options = [];
    for (const string of stringSet) {
      const $option = el('option', string);
      $options.push($option);
    }

    setChildren(this.$recipientsList, $options);
  }
}
