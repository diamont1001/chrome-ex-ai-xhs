/**
 * dom 操作
 */

export function $tap(obj, transform) {
  transform(obj);
  return obj;
}
export function $id(id) {
  return document.getElementById(id);
}
export function $select(selector) {
  return document.querySelectorAll(selector);
}
export function $one(selector) {
  return document.querySelector(selector);
}
export function $gen(tag, classes) {
  let e = document.createElement(tag);
  if (classes) {
    e.document.className = classes.join(' ');
  }
  return e;
}
