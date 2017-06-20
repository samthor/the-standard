/**
 * Fake HTML page. This should be single-use.
 */
class StandardPageElement extends HTMLElement {
  constructor() {
    super();

    const root = this.attachShadow({mode: 'open'});
    root.innerHTML = `
<style>
#outer {
  -webkit-backface-visibility: none;
  backface-visibility: none;
  height: calc(100% - 10px);
  border: 10px solid transparent;
  margin: -10px;
  border-top-color: #b5b5b5;  /* FIXME: otherwise the top is pushed out white */
}
#html, #body {
  -webkit-backface-visibility: none;
  backface-visibility: none;
  min-height: 100%;
  height: 100%;
  transform-style: preserve-3d;
}
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
<div id="outer">
  <div id="html">
    <div id="body"></div>
  </div>
</div>
    `;

    const style = document.createElement('style');
    root.appendChild(style);
    this.custom_ = style;
    this.holder_ = root.getElementById('body');
    this.outer_ = root.getElementById('outer');
  }

  set css(value) {
    this.custom_.textContent = value;
  }

  get css() {
    return this.custom_.textContent;
  }

  set html(value) {
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

  get root() {
    return this.outer_;  // the #body node
  }
}

customElements.define('ts-page', StandardPageElement);
