/**
 * Displays the header of The Standard player's UI.
 */
class StandardUiHeaderElement extends HTMLElement {
  static get observedAttributes() {return ['script']; }

  constructor() {
    super();

    const root = this.attachShadow({mode: 'open'});
    root.innerHTML = `
<style>
:host {
  display: block;
  --feature-color: #68a4ed;
}
#flex {
  z-index: 1000;
  background: var(--feature-color);
  box-sizing: border-box;
  display: flex;
  align-items: stretch;
  font-family: 'Lato', 'Roboto', Sans-Serif;
  font-size: 32px;
  line-height: 1em;
  color: white;
  padding: 0 10px;
}
button, .button {
  position: relative;
  font: inherit;
  text-shadow: 0 -2px 0 rgba(0, 0, 0, 0.125);
  border: 0;
  cursor: pointer;
  padding: 9px 12px;
  background: rgba(255, 255, 255, 0.125);
  border-bottom: 2px solid transparent;
  border-top: 2px solid transparent;
  color: inherit;
}
.info {
  flex-grow: 1;
  margin: 0 12px;
  display: flex;
  flex-flow: column;
  align-items: flex-start;
  justify-content: center;
  font-size: 0.5em;
  line-height: 1em;
  font-weight: 400;
  overflow: hidden;
}
.info > * {
  width: 100%;
  text-overflow: ellipsis;
  white-space: nowrap;
  overflow: hidden;
}
.info h1 {
  font: inherit;
  text-shadow: 0 1px 0 rgba(0, 0, 0, 0.5);
  text-transform: uppercase;
  font-weight: 700;
  margin: 0;
  margin-top: 0.2em;
}
.info #status {
  text-transform: uppercase;
  font-size: 0.66em;
  margin-top: 0.2em;
  opacity: 0.75;
  font-weight: 900;
}
button.id, .button.id {
  min-width: 6ch;
  text-align: center;
  font-family: monospace;
}
button.id select {
  opacity: 0;
  top: 0;
  left: 0;
  height: 100%;
  width: 100%;
  position: absolute;
  border-radius: 0;
}
button:hover, .button-fake .button:hover {
  background: rgba(255, 255, 255, 0.25);
}
button:focus, .button-fake *:focus + .button {
  outline: 0;
  box-shadow: 0 0 2px rgba(0, 108, 237, 0.5);
  border-bottom-color: rgba(0, 0, 0, 0.125);
}

.button-fake {
  position: relative;
}
.button-fake select {
  position: absolute;
  width: 100%;
  height: 100%;
  z-index: 1000;
  opacity: 0;
  cursor: pointer;
}
.material-icons {
  font-family: 'Material Icons';
  font-style: normal;
  letter-spacing: normal;
  text-transform: none;
  display: inline-block;
  white-space: nowrap;
  word-wrap: normal;
  direction: ltr;
  -webkit-font-feature-settings: 'liga';
  -webkit-font-smoothing: antialiased;
  font-size: 0.8em;
}
</style>
<div id="flex">
  <div class="button-fake">
    <select id="select">
      <option value="">&mdash;</option>
      <optgroup label="Scripts"></optgroup>
    </select>
    <div class="button id">
      <div id="id">&mdash;</div>
    </div>
  </div>
  <div class="info">
    <h1 id="heading"></h1>
    <div id="status">
      <slot name="status"></slot>
    </div>
  </div>
</div>
    `;

    this.selectEl_ = root.getElementById('select');
    const options = this.selectEl_.querySelector('optgroup');
    options.hidden = true;

    let scripts = {};
    this.addEventListener('scripts', ev => {
      scripts = ev.detail;

      const keys = Object.keys(scripts).sort();
      options.hidden = !keys.length;
      options.textContent = '';

      for (const id of keys) {
        const option = document.createElement('option');
        option.value = id;
        option.text = `${id}\u{2014} ${scripts[id].name}`;
        options.appendChild(option);
      }

      this.selectEl_.value = this.script;
      this.selectEl_.dispatchEvent(new CustomEvent('change'));
    });

    const idEl = root.getElementById('id');
    const headingEl = root.getElementById('heading');
    const updateScript = id => {
      const script = id && scripts[id];
      if (!script) {
        idEl.textContent = '\u{2014}';
        headingEl.innerHTML = '&nbsp;';
      } else {
        idEl.textContent = id;
        headingEl.textContent = script['name'];
      }
    };

    this.selectEl_.addEventListener('change', ev => {
      const value = this.selectEl_.value;

      if (ev.isTrusted) {
        // if the event is trusted, it's actually a user action
        if (value) {
          this.setAttribute('script', value);
        } else {
          this.removeAttribute('script');
        }
      }

      updateScript(value);
    });
  }

  attributeChangedCallback(attrName, oldValue, newValue) {
    switch (attrName) {
    case 'script':
      this.selectEl_.value = newValue;
      if (this.selectEl_.value !== newValue) {
        this.selectEl_.value = '';  // bad option, just pretend it's blank anyway
      }
      this.selectEl_.dispatchEvent(new CustomEvent('change'));
      break;
    }
  }

  get script() {
    return this.getAttribute('script') || '';
  }

  set script(v) {
    if (v) {
      this.setAttribute('script', v);
    } else {
      this.removeAttribute('script');
    }
  }
}

customElements.define('tsui-header', StandardUiHeaderElement);
