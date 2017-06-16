/**
 * Displays a play or paused state.
 */
class StandardUiPlayPauseElement extends HTMLElement {
  constructor() {
    super();

    const root = this.attachShadow({mode: 'open'});
    root.innerHTML = `
<style>
#playpause {
  display: inline-block;
  border-radius: 1px;
  position: relative;
  color: white;
}

:host([play]) #playpause {
  box-sizing: border-box;
  border-left: 0.6em solid currentColor;
  border-top: 0.4em solid transparent;
  border-bottom: 0.4em solid transparent;
  margin-left: 0.1em;
  margin-right: 0.3em;
}

:host(:not([play])) #playpause {
  border-left: 0.25em solid currentColor;
  border-right: 0.25em solid currentColor;
  height: 0.8em;
  width: 0.25em;
  margin-right: 0.25em;
}
</style>
<div id="playpause"></div>
    `;
  }

  set play(v) {
    if (v) {
      this.setAttribute('play', this.getAttribute('play') || '');
    } else {
      this.removeAttribute('play');
    }
  }

  get play() {
    return this.hasAttribute('play');
  }
}

customElements.define('tsui-playpause', StandardUiPlayPauseElement);
