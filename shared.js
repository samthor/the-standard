/**
 * @param {!HTMLElement} el
 * @return {{root: !ShadowRoot, holder: string}}
 */
function shadowFor(el) {
  const out = {root: null, holder: null};

  if (el.attachShadow) {
    out.root = el.attachShadow({mode: 'open'});
    out.holder = '<slot></slot>';
  } else if (el.createShadowRoot) {
    out.root = el.createShadowRoot();
    out.holder = '<content></content>';
  } else {
    throw new Error('shadow DOM unsupported');
  }

  return out;
}
