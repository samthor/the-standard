/**
 * Fake HTML page.
 */
document.registerElement('ts-page', class extends HTMLElement {
  createdCallback() {
    const {root, holder} = shadowFor(this);

    root.innerHTML = `
<style>
:host {
  display: block;
  min-height: 100%;
  transform-style: preserve-3d;
}
</style>

${holder}
    `;
  }
});
