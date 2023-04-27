import { el } from 'redom';
import arrowLeftSvg from '../assets/images/svg/arrow-left.svg?source';
import createSvgEl from '../helpers/create-svg-el';

export default class {
  constructor(parentCssClass) {
    this.$el = el(
      `button.${parentCssClass}__go-back-btn.btn.btn_primary`,
      createSvgEl(arrowLeftSvg),
      'Вернуться назад'
    );
    this.$el.addEventListener('click', () => {
      history.back();
    });
  }
}
