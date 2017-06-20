
// const styles = window.getComputedStyle(node);
// const duration = styles.getPropertyValue('--frame');
// console.info('duration is', duration);

function setScene(node, scene) {
  const arg = {detail: scene, bubbles: true, composed: true};
  node.dispatchEvent(new CustomEvent('scene', arg));
}

export default function*(node) {
  const hand = node.querySelector('#hand');
  hand.style.transform = 'translate(800px, 200px)';

  setScene(node, 'side');
  yield true;

  hand.classList.add('show');
  hand.style.transform = 'translate(180px, 120px)';
  yield true;

  hand.classList.add('letgo');
  yield true;

  hand.classList.remove('show');
  node.querySelector('#page').hidden = true;
  node.querySelector('#photo').hidden = false;
  yield true;

  // nb. this is the reset but it looks ugly
  setScene(node, 'flat');
  node.querySelector('#page').hidden = false;
  node.querySelector('#photo').hidden = true;
  hand.style.transform = 'translate(-1800px, 1200px)';
  hand.className = 'noshadow';
  yield true;

  hand.classList.add('show');
  hand.style.transform = 'translate(200px, 145px)';
  yield true;

  hand.className = 'letgo bounce noshadow'
  yield true;
}
