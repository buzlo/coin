import { el, setChildren } from 'redom';
import router from './components/_router';
import { getAccounts, fetchToken, getToken } from './api';

import $header from './components/header';
import $signInForm from './components/sign-in';

import './styles/normalize.scss';
import './styles/styles.scss';
import './assets/images/svg/warning.svg';

const $main = el('main');

setChildren(document.body, [$header, $main]);

router.on('/', () => {
  router.navigate(
    window.localStorage.getItem('coin-token') ? '/accounts' : '/login'
  );
});

router.on('/login', () => {
  setChildren($main, $signInForm(onSubmit));

  async function onSubmit(login, password) {
    await fetchToken(login, password);
    router.navigate('/accounts');
  }
});

router.on('/accounts', async () => {
  const token = getToken();
  if (!token) router.navigate('/login');
  const accounts = await getAccounts(token);
  setChildren($main, el('h1', 'Счета'));
});

router.resolve();
