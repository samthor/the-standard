
export default function*(node) {
  yield true;  // setup frame

  // TODO: useful?
  const styles = window.getComputedStyle(node);
  const duration = styles.getPropertyValue('--frame');
  console.info('duration is', duration);

  node.querySelector('ts-lines').rows = 2;
  yield true;

  node.querySelector('ts-lines').rows = 8;
  yield true;  // last yield isn't required, but it's for completeness
}
