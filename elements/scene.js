/**
 * Scene element to portray contents in 3D space.
 */
class StandardSceneElement extends HTMLElement {
  static get observedAttributes() {return ['scene']; }

  constructor() {
    super();

    const root = this.attachShadow({mode: 'open'});
    root.innerHTML = `
<style>
:host {
  transform-style: preserve-3d;
  transform-origin: 50% 50%;
  transition: transform var(--frame2) cubic-bezier(0.87,-0.41,0.19,1.44);
  display: flex;
  justify-content: center;

  --frame2: calc(var(--frame) / 2);
  --frame4: calc(var(--frame) / 4);
  --frame8: calc(var(--frame) / 8);
  --frame16: calc(var(--frame) / 16);
}
:host([scene="flat"]) {
  transform: scale(0.75) rotateX(55deg) rotateZ(45deg);
}
:host([scene="side"]) {
  transform: rotateX(-10deg) rotateY(10deg) scale(1.0);
}
#flip {
  transform-style: preserve-3d;
  transform: rotateY(0deg);
}
#flip.flip {
  transition: transform var(--frame) ease-in-out;
  transform: rotateY(360deg);
}
</style>
<div id="flip"><slot></slot></div>
    `;

    const flip = root.getElementById('flip');
    flip.addEventListener('transitionend', ev => flip.className = '');

    this.addEventListener('scene', ev => {
      this.scene = ev.detail || null;
    });
    this.addEventListener('flip', ev => {
      flip.className = 'flip';
    });
  }

  reset() {
    this.disabled = true;
    this.scene = null;
  }

  set disabled(v) {
    if (v) {
      this.setAttribute('disabled', this.getAttribute('disabled') || '');
    } else {
      this.removeAttribute('disabled');
    }
  }

  get disabled() {
    return this.hasAttribute('disabled');
  }

  set scene(v) {
    if (v) {
      this.setAttribute('scene', v);
    } else {
      this.removeAttribute('scene');
    }
  }

  get scene() {
    return this.getAttribute('scene');
  }
}

customElements.define('ts-scene', StandardSceneElement);
