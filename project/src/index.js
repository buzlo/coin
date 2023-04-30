import { el, setChildren } from 'redom';
import router from './components/_router';
import {
  getAccounts,
  fetchToken,
  getToken,
  getDetails,
  transferFunds,
  getCurrencies,
  createCurrencyFeedSocket,
  exchangeCurrency,
  getBanks,
} from './api';

import Header from './components/Header';

import './styles/normalize.scss';
import './styles/styles.scss';

const header = new Header();
const $main = el('main');
let socket;

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
  .on('/login', async () => {
    const $signInForm = (await import('./components/sign-in')).default;
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
    const accountsPage = new AccountsPage(() => createAccount(token));

    setChildren($main, accountsPage.$container);

    const accounts = await getAccounts(token);
    accountsPage.update(accounts);
  })
  .on('/account/:number', async ({ data }) => {
    const token = getToken();
    if (!token) router.navigate('/login');

    header.hasNav = true;

    const [details, DetailsPage] = await Promise.all([
      getDetails(data.number, token),
      import('./components/Details-page').then((module) => module.default),
    ]);

    const detailsPage = new DetailsPage(details, (transferData) =>
      transferFunds(transferData, token)
    );
    setChildren($main, detailsPage.$container);
  })
  .on('/transactions/:number', async ({ data }) => {
    const token = getToken();
    if (!token) router.navigate('/login');

    header.hasNav = true;

    const [details, HistoryPage] = await Promise.all([
      getDetails(data.number, token),
      import('./components/History-page').then((module) => module.default),
    ]);

    const detailsPage = new HistoryPage(details, (transferData) =>
      transferFunds(transferData, token)
    );
    setChildren($main, detailsPage.$container);
  })
  .on(
    '/currency',
    async () => {
      const token = getToken();
      if (!token) router.navigate('/login');

      header.hasNav = true;

      const [myCurrenciesData, CurrenciesPage] = await Promise.all([
        getCurrencies(token),
        import('./components/Currencies-page').then((module) => module.default),
      ]);

      const currenciesPage = new CurrenciesPage(
        myCurrenciesData,
        (exchangeData) => exchangeCurrency(exchangeData, token)
      );
      createCurrencyFeedSocket(currenciesPage);
      socket = currenciesPage.socket;

      setChildren($main, currenciesPage.$container);
      currenciesPage.currencies = myCurrenciesData;
    },
    {
      leave(done) {
        socket.close();
        done();
      },
    }
  )
  .on('/banks', async () => {
    const token = getToken();
    if (!token) router.navigate('/login');

    header.hasNav = true;

    const [banksData, BanksPage] = await Promise.all([
      getBanks(token),
      import('./components/Banks-page').then((module) => module.default),
    ]);
    const banksPage = new BanksPage(banksData);
    setChildren($main, [banksPage.$container]);
  });

router.resolve();
