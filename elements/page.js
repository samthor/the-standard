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
  transform-style: preserve-3d;
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

});
