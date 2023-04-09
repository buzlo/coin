import { el, mount, setChildren } from 'redom';
import JustValidate from 'just-validate';
import '../styles/sign-in.scss';

export default function (onSubmit) {
  const $form = el('form.sign-in-form.form');

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

  const validation = new JustValidate($form, {
    validateBeforeSubmitting: true,
    errorLabelCssClass: ['form__error-label'],
  });

  validation.onValidate(() => {
    $form.classList.add('sign-in-form_validated');
  });

  for (const $input of [$loginInput, $passwordInput]) {
    validation.addField($input, [
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
    ]);
  }

  const $btn = el('button.form__btn.btn.btn_primary', 'Войти', {
    type: 'submit',
  });

  const $authErrorMessage = el('p.form__error-label', 'Ошибка авторизации');

  setChildren($form, [
    el('h2.form__title', 'Вход в аккаунт'),
    $loginInputWrapper,
    $passwordInputWrapper,
    $btn,
  ]);

  $form.addEventListener('submit', async (event) => {
    event.preventDefault();
    if (validation.isValid)
      try {
        await onSubmit($loginInput.value, $passwordInput.value);
      } catch (error) {
        if (error.name !== 'Error') throw error;
        mount($form, $authErrorMessage);
      }
  });

  return $form;
}
