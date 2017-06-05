/**
 * Fake lines of text.
 */
class StandardLinesElement extends HTMLElement {
  static get observedAttributes() {return ['rows', 'plain']; }

  constructor() {
    super();

    const root = this.attachShadow({mode: 'open'});
    root.innerHTML = `
<style>
:host {
  display: block;
}
#lines {
  display: block;
}
.line {
  background: #ddd;
  height: 0.8em;
  border-radius: 100px;
  margin: 0.4em 0.8em;
}
.line.big {
  font-size: 24px;
  background: #ccc;
  margin: 0.5em;
  width: 40%;
}
.line.end {
  margin-bottom: 0.8em;
}
</style>
<div id="lines"></div>
    `;

    this.holder_ = root.getElementById('lines');
    this.attributeChangedCallback('rows', undefined, this.getAttribute('rows'));
  }

  attributeChangedCallback(attrName, oldValue, newValue) {
    this.holder_.innerText = '';
    const count = +this.getAttribute('rows');

    for (let i = 0; i < count; ++i) {
      const d = document.createElement('div');
      d.className = 'line';

      if (i == 0) {
        if (!this.hasAttribute('plain')) {
          d.classList.add('big');
        }
      } else if (!(i % 3)) {
        d.classList.add('end')
      }

      if (i == count - 1) {
        d.style.width = `${((count % 6)+4) * 10}%`;
      }

      this.holder_.appendChild(d);
    }
  }
}

customElements.define('ts-lines', StandardLinesElement);