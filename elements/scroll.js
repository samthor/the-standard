/**
 * Scroller element that can be controlled.
 *
 *  - Set the HTML attribute "at" to set the number of screens, vertically, to position at
 *  - Set the CSS custom variable "--duration" to set the transition duration
 */
class StandardScrollElement extends HTMLElement {
  static get observedAttributes() {return ['at']; }

  constructor() {
    super();

    const root = this.attachShadow({mode: 'open'});
    root.innerHTML = `
<style>
:host {
  display: inline-block;
  position: relative;
  overflow-y: scroll;
  --duration: 0.25s;
}
#fake {
  visibility: hidden;
  position: absolute;
  top: 0;
  transition: all var(--duration) ease-out;
}
</style>
<div id="fake"></div>
<slot></slot>
    `;
    this.fake_ = root.getElementById('fake');
    this.frame_ = null;
  }

  attributeChangedCallback(attrName, oldValue, newValue) {
    window.cancelAnimationFrame(this.frame_);

    const at = this.at;
    if (at === null) { return; }

    const startAt = this.scrollTop;
    const height = this.getBoundingClientRect().height;
    const target = Math.floor(at * height);

    // set transition on fake element
    this.fake_.style.top = target + 'px';

    let expected = this.scrollTop;
    const update = _ => {
      // something unexpected has changed- user scroll
      if (expected !== this.scrollTop) { return; }

      // set new value
      const actual = Math.floor(parseInt(window.getComputedStyle(this.fake_).top));
      this.scrollTop = actual;
      expected = this.scrollTop;

      // if we have more to do, then go again
      if (actual !== target) {
        this.frame_ = window.requestAnimationFrame(update);
      }
    };
    this.frame_ = window.requestAnimationFrame(update);
  }

  get at() {
    const value = +this.getAttribute('at');
    if (isNaN(value)) {
      return null;
    }
    return value;
  }

  set at(v) {
    if (v != null) {
      this.setAttribute('at', v);
    } else {
      this.removeAttribute('at');
    }
  }
}

customElements.define('ts-scroll', StandardScrollElement);