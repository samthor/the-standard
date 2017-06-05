/**
 * Brings a HTML element into the foreground, with a shadow.
 *
 *  - Set the HTML attribute "mode" to either "popout" or "hide" (to bring forward, or hide).
 *  - Set the CSS property "border-radius" to control the radius of the shadow
 *  - Set the CSS custom variable "--depth" to set the depth into the screen
 *  - Set the CSS custom variable "--duration" to set the transition duration
 *  - Set the CSS custom variables "--shadow-color", "--shadow-opacity", "--shadow-blur" to set the
 *    shadow color, opacity, and blur color; respectively
 */
class StandardFeatureElement extends HTMLElement {
  static get observedAttributes() {return ['mode']; }

  constructor() {
    super();

    const root = this.attachShadow({mode: 'open'});
    root.innerHTML = `
<style>
:host {
  position: relative;
  transform-style: preserve-3d;
  display: inline-block;

  --depth: 42px;
  --duration: 0.25s;
  --shadow-opacity: 0.25;
  --shadow-color: black;
  --shadow-blur: 8px;
}

#shadow {
  position: absolute;
  width: 100%;
  height: 100%;
  border-radius: inherit;
  background: var(--shadow-color);
  transition: all var(--duration) ease-out;
  filter: blur(var(--shadow-blur));
  opacity: 0;
  transform: scale(1);
  will-change: opacity, transform;
}

#popout {
  transform-style: preserve-3d;
  transition: all var(--duration) ease-out;
  will-change: transform;
  transform: translateZ(0) scale(1);
}

:host([mode="popout"]) #shadow {
  opacity: var(--shadow-opacity);
}
:host([mode="popout"]) #popout {
  transform: translateZ(var(--depth)) scale(1);
}

:host([mode="hide"]) #shadow {
  transform: scale(0);
}
:host([mode="hide"]) #popout {
  transform: translateZ(0) scale(0);
}

</style>
<div id="shadow"></div>
<div id="popout">
  <slot></slot>
</div>
`;
  }

  set mode(v) {
    if (v) {
      this.setAttribute('mode', v);
    } else {
      this.removeAttribute('mode');
    }
  }
}

customElements.define('ts-feature', StandardFeatureElement);