import logo from '../assets/images/svg/coin-logo.svg';
import { el, mount } from 'redom';
import router from './_router';
import '../styles/header.scss';

export default class {
  constructor(hasNav = false) {
    this.$el = this.createElement();
    this.hasNav = hasNav;
  }

  createElement() {
    const $header = el('header.header');
    const $container = el('.header__container.container');
    const $logo = el('img', {
      src: logo,
    });

    mount($container, $logo);
    mount($header, $container);

    this.$container = $container;
    return $header;
  }

  get hasNav() {
    return this._hasNav;
  }

  set hasNav(boolean) {
    if (!boolean) {
      if (!this.hasNav) return;
      this.$nav.remove();
      return;
    }

    if (this.hasNav) return;

    if (!this.$nav) {
      const navData = [
        {
          text: 'Банкоматы',
          href: '/banks',
        },
        {
          text: 'Счета',
          href: '/accounts',
        },
        {
          text: 'Валюта',
          href: '/currency',
        },
        {
          text: 'Выйти',
          href: '/login',
        },
      ];

      const $nav = el('nav.header__nav');

      const $navList = el('ul.header__nav-list');
      this.$navLinks = [];

      for (const item of navData) {
        const $navLink = el('a.header__nav-link.btn.btn_outline', item.text, {
          href: item.href,
        });
        const $navItem = el('li.header__nav-item', $navLink);

        $navLink.addEventListener('click', (event) => {
          event.preventDefault();
          router.navigate(event.target.getAttribute('href'));
        });

        this.$navLinks.push($navLink);
        mount($navList, $navItem);
      }
      mount($nav, $navList);

      this.$nav = $nav;
    }

    mount(this.$container, this.$nav);
    this._hasNav = boolean;
  }

  update(url) {
    if (!this.$navLinks) return;
    this.$navLinks.forEach((item) => {
      const isMatched = router.matchLocation(item.getAttribute('href'), url);
      item.classList.toggle('btn_outline_pressed', isMatched);
    });
  }
}
