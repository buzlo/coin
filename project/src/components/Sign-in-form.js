import { el, mount, setChildren } from 'redom';
import JustValidate from 'just-validate';
import '../styles/sign-in.scss';

export default class {
  constructor(onSubmit) {
    this.$el = el('form.sign-in-form.form');

    const $loginInput = el('input.form__input', {
      placeholder: 'Placeholder',
      id: 'login',
    });
    const $loginInputWrapper = el(
      'label.form__label',
      'Логин',
      { for: 'login' },
      $loginInput
    );

    const $passwordInput = el('input.form__input', {
      placeholder: 'Placeholder',
      type: 'password',
      id: 'password',
    });
    const $passwordInputWrapper = el(
      'label.form__label',
      'Пароль',
      { for: 'password' },
      $passwordInput
    );

    const validation = new JustValidate(this.$el, {
      validateBeforeSubmitting: true,
      errorLabelCssClass: ['form__status-label', 'form__status-label_error'],
      successLabelCssClass: [
        'form__status-label',
        'form__status-label_success',
      ],
      successLabelStyle: {},
      errorLabelStyle: {},
    });

    validation.onValidate(() => {
      this.$el.classList.add('sign-in-form_validated');
    });

    for (const $input of [$loginInput, $passwordInput]) {
      validation.addField(
        $input,
        [
          {
            rule: 'required',
            errorMessage: 'Обязательное поле',
          },
          {
            rule: 'minLength',
            value: 6,
            errorMessage: 'Не менее 6 символов',
          },
          {
            validator: (value) => !value.includes(' '),
            errorMessage: 'Пробелы не допускаются',
          },
        ],
        { successMessage: 'Формат корректен' }
      );
    }

    const $btn = el('button.form__btn.btn.btn_primary', 'Войти', {
      type: 'submit',
    });

    const $errorMessage = el('p.form__status-label.form__status-label_error');

    setChildren(this.$el, [
      el('h2.form__title', 'Вход в аккаунт'),
      $loginInputWrapper,
      $passwordInputWrapper,
      $btn,
    ]);

    validation.onSuccess(async (event) => {
      event.preventDefault();
      try {
        await onSubmit($loginInput.value, $passwordInput.value);
      } catch (error) {
        if (error.name === 'Error') {
          $errorMessage.textContent = 'Ошибка авторизации';
        } else {
          $errorMessage.textContent = 'Произошла ошибка. Проверьте соединение';
        }
        mount(this.$el, $errorMessage);
      }
    });
  }
}
