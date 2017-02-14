/**
 * Fake HTML page.
 */
document.registerElement('ts-page', class extends HTMLElement {
  createdCallback() {
    const {root, holder} = shadowFor(this);

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

  set html(value) {
    this.holder_.innerHTML = value;
  }

  set class(value) {
    this.outer_.className = value;
  }

  q(query) {
    return this.holder_.querySelector(query);
  }

});
