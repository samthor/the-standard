/**
 * Loads scripts and other info for The Standard. Has no UI, but emits various events.
 */
class StandardUiLoaderElement extends HTMLElement {
  static get observedAttributes() { return ['scripts']; }

  constructor() {
    super();

    const root = this.attachShadow({mode: 'closed'});
    // nb. we do nothing with this, but it prevents display

    this.scriptPromise_ = null;
    this.refreshScripts_();
  }

  attributeChangedCallback(attrName, oldValue, newValue) {
    switch (attrName) {
    case 'scripts':
      this.refreshScripts_();
      break;
    }
  }

  refreshScripts_() {
    const url = this.getAttribute('scripts') || '';
    const promise = url ? window.fetch(url).then(x => x.json()) : Promise.resolve({});
    this.scriptPromise_ = promise;

    promise.then(out => {
      if (this.scriptPromise_ !== promise) { return; }
      this.dispatchEvent(new CustomEvent('scripts', {detail: out, bubbles: true}));
    });

    return promise;
  }

}

customElements.define('tsui-loader', StandardUiLoaderElement);
