/**
 * Scene element to portray contents in 3D space.
 */
document.registerElement('ts-scene', class extends HTMLElement {
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
:host(.flat) {
  transform: scale(0.75) rotateX(55deg) rotateZ(45deg);
}
</style>
${holder}
    `;

  }
});
