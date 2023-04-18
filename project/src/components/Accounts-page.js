/* eslint-disable prettier/prettier */
import { el, list, setChildren } from 'redom';
import Select from './Select';
import '../styles/accounts.scss';
import AccountItem from './Account-item';
import CustomChoices from './Custom-choices';
import sortAccounts from '../helpers/sort-accounts';

class AccountsPage {
  constructor(onCreateClick) {
    this.createAccountsPage(onCreateClick);
  }

  createAccountsPage(onCreateClick) {
    this.$container = el('.accounts__container.container');

    const $accountsTitle = el('h2.accounts__title.window-title', 'Ваши счета');

    const selectOptions = [
      { text: 'Сортировать', value: '' },
      { text: 'По номеру', value: 'account' },
      { text: 'По балансу', value: 'balance' },
      { text: 'По последней транзакции', value: 'transactions' },
    ];

    const $accountsSelect = new Select(
      'accounts',
      selectOptions,
      (value) => this.selectHandler(value)
    ).$el;

    const $accountsCreateBtn = el(
      'button.accounts__create-btn.btn.btn_primary',
      'Создать новый счёт'
    );

    $accountsCreateBtn.addEventListener('click', () => {
      onCreateClick().then((newAccount) => {
        this.accounts.push(newAccount);
        this.update(this.accounts);
      });
    });

    const $subheader = el('.accounts__subheader', [
      $accountsTitle,
      $accountsSelect,
      $accountsCreateBtn,
    ]);

    this.$accountsList = list('ul.accounts__list', AccountItem);

    setChildren(this.$container, [$subheader, this.$accountsList]);

    new CustomChoices($accountsSelect, 'accounts');
  }

  selectHandler(parameter) {
    const sortedAccounts = sortAccounts(this.accounts, parameter);
    this.update(sortedAccounts);
  }

  update(accounts) {
    this.accounts = accounts.slice();
    this.$accountsList.update(accounts);
  }
}

export default AccountsPage;
