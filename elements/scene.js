/**
 * Scene element to portray contents in 3D space.
 */
document.registerElement('ts-scene', class extends HTMLElement {
  set scene(v) {
    if (v) {
      this.setAttribute('scene', v);
    } else {
      this.removeAttribute('scene');
    }
  }

  createdCallback() {
    const {root, holder} = shadowFor(this);

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
${holder}
    `;

  }
});
