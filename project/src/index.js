import { el, setChildren } from 'redom';
import router from './components/_router';
import { getAccounts, fetchToken, getToken } from './api';

import Header from './components/Header';
import $signInForm from './components/sign-in';

import './styles/normalize.scss';
import './styles/styles.scss';
import './assets/images/svg/warning.svg';

const header = new Header();
const $main = el('main');

setChildren(document.body, [header.$el, $main]);

router
  .hooks({
    after(match) {
      header.update(match.url);
    },
  })
  .on('/', () => {
    router.navigate(
      window.localStorage.getItem('coin-token') ? '/accounts' : '/login'
    );
  })
  .on('/login', () => {
    setChildren($main, $signInForm(onSubmit));

    async function onSubmit(login, password) {
      await fetchToken(login, password);
      router.navigate('/accounts');
    }
  })
  .on('/accounts', async () => {
    const token = getToken();
    if (!token) router.navigate('/login');

    header.hasNav = true;

    const { createAccount } = await import('./api.js');
    const AccountsPage = (await import('./components/Accounts-page')).default;
    const accountsPage = new AccountsPage(async () => createAccount(token));

    setChildren($main, accountsPage.$container);

    const accounts = await getAccounts(token);
    accountsPage.update(accounts);
  });

router.resolve();
