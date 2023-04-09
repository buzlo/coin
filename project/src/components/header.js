import logo from '../assets/images/svg/coin-logo.svg';
import { el, mount } from 'redom';
import '../styles/header.scss';

const $header = el('header.header');
const $container = el('.container');
const $logo = el('img', {
  src: logo,
  width: logo.viewBox.split(' ')[2],
  height: logo.viewBox.split(' ')[3],
});

mount($container, $logo);
mount($header, $container);

export default $header;
