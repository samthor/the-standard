/**
 * Fake HTML page.
 */
class StandardPageElement extends HTMLElement {
  constructor() {
    super();

    const root = this.attachShadow({mode: 'open'});
    root.innerHTML = `
<style>
#html {
  min-height: 100%;
  height: 100%;
  transform-style: preserve-3d;
}
</style>
<style>
.material-icons {
  font-family: 'Material Icons';
  font-weight: normal;
  font-style: normal;
  letter-spacing: normal;
  text-transform: none;
  display: inline-block;
  white-space: nowrap;
  word-wrap: normal;
  direction: ltr;
  -webkit-font-feature-settings: 'liga';
  -webkit-font-smoothing: antialiased;
}
</style>
<div style="height: 100%">
  <div id="html">
    <div id="body">
    </div>
  </div>
</div>
    `;

    const style = document.createElement('style');
    root.appendChild(style);
    this.custom_ = style;
    this.holder_ = root.getElementById('body');
    this.outer_ = root.querySelector('div');
  }

  set css(value) {
    this.custom_.textContent = value;
  }

  get css() {
    return this.custom_.textContent;
  }

  set html(value) {
    // TODO: we should clear the rest of the #body tag at this point in case it's been mucked with.
    this.holder_.className = '';
    this.holder_.innerHTML = value;
  }

  get html() {
    return this.holder_.innerHTML;
  }

  set class(value) {
    this.outer_.className = value;
  }

  get class() {
    return this.outer_.className;
  }

  q(query) {
    if (query === '#body') {
      return this.holder_;  // return base of query
    }
    return this.holder_.querySelector(query);
  }

  get body() {
    return this.holder_;  // the #body node
  }
}

customElements.define('ts-page', StandardPageElement);
