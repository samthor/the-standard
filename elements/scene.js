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
  transition: transform 0.5s cubic-bezier(0.87,-0.41,0.19,1.44);
  display: flex;
  justify-content: center;
}
:host([scene="flat"]) {
  transform: scale(0.75) rotateX(55deg) rotateZ(45deg);
}
:host([scene="side"]) {
  transform: rotateX(-10deg) rotateY(10deg) scale(1.0);
}
</style>
<slot></slot>
    `;

    this.addEventListener('scene', ev => {
      this.scene = ev.detail || null;
    });
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
