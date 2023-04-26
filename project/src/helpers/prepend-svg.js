import createSvgEl from "./create-svg-el";

export default function($element, svgSource) {
  const $svg = createSvgEl(svgSource);
  $element.prepend($svg);
}
