export default function (source) {
  const $wrapper = document.createElement('div');
  $wrapper.innerHTML = source;
  return $wrapper.firstChild;
}
