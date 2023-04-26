import Choices from 'choices.js';
import createSvgEl from '../helpers/create-svg-el';
import '../styles/custom-choices.scss';
import arrowDown from '../assets/images/svg/arrow-down.svg?source';

export default class extends Choices {
  constructor($select, parentCssClass, options) {
    super($select, {
      ...options,
      searchEnabled: false,
      itemSelectText: '',
      shouldSort: false,
    });
    const $choices = this.containerOuter.element;
    if (parentCssClass) $choices.classList.add(`${parentCssClass}__choices`);

    const $svg = createSvgEl(arrowDown);
    $svg.classList.add('choices__svg');
    $choices.append($svg);
  }
}
