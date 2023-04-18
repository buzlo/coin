import { el, mount } from 'redom';

export default class {
  constructor(parentBlockClass, selectOptions, handler) {
    this.$el = el(`select.${parentBlockClass}__select.select`);
    this.options = selectOptions;
    for (const option of selectOptions) {
      const $option = el('option.select__option', option.text, {
        value: option.value,
      });
      mount(this.$el, $option);
    }
    this.$el.addEventListener('change', (event) => handler(event.target.value));
  }
}
