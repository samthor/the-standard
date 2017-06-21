
function setScene(node, scene) {
  const arg = {detail: scene, bubbles: true, composed: true};
  node.dispatchEvent(new CustomEvent('scene', arg));
}

export default function*(node) {
  const page = node.querySelector('#page');
  const hand = node.querySelector('#hand');
  const form = node.querySelector('form');
  const input = form.querySelector('input[type="file"]');
  const submit = form.querySelector('input[type="submit"]')
  hand.style.transform = 'translate(800px, 200px)';

  form.addEventListener('submit', ev => ev.preventDefault());

  // Turns out we actually need to follow the tip itself: as FileList can't be virtually created.
  let savedForLater = null;
  node.addEventListener('dragover', ev => ev.preventDefault());
  node.addEventListener('drop', ev => {
    ev.preventDefault();
    savedForLater = ev.dataTransfer.files;
    console.info('got files in savedForLater', savedForLater);
  });

  setScene(node, 'side');
  yield true;

  hand.classList.add('show');
  hand.style.transform = 'translate(180px, 120px)';
  yield true;

  hand.classList.add('letgo');
  yield true;

  hand.classList.remove('show');
  node.classList.add('mode-photo');
  yield true;

  // nb. this is the reset but it looks ugly
  setScene(node, 'flat');
  node.classList.remove('mode-photo');
  hand.style.transform = 'translate(-1800px, 1200px)';
  hand.className = 'noshadow';
  yield true;

  hand.classList.add('show');
  hand.style.transform = 'translate(200px, 145px)';
  yield true;

  hand.className = 'letgo bounce noshadow'
  yield true;

  // setup frame
  hand.style.transform = 'translate(-500px, 20px)';
  hand.className = 'noshadow';
  setScene(node, 'side');
  yield true;

  form.hidden = false;
  hand.classList.add('show');
  hand.style.transform = 'translate(248px, 180px)';
  yield true;

  hand.classList.add('letgo');
  yield true;

  hand.classList.remove('show');
  console.info('applying savedForLater', savedForLater);
  input.files = savedForLater;
  yield true;

  submit.focus();
  submit.click();
  yield true;

  form.hidden = true;
  hand.className = 'noshadow';
  hand.style.transform = 'translate(800px, 120px)';
  yield true;

  const drophere = node.querySelector('#drophere');
  drophere.hidden = false;
  hand.classList.add('show');
  hand.classList.add('multiple');
  hand.style.transform = 'translate(248px, 220px)';
  yield true;

  hand.classList.add('letgo');
  hand.classList.add('fade');
  yield true;

  // "Upload these files directory with JavaScript"...
  hand.classList.remove('show');
  drophere.classList.add('active');
  const heading = drophere.querySelector('h1');
  const initialText = heading.textContent;
  heading.textContent = 'Uploading...';
  yield true;

  drophere.className = 'upload';
  yield true;

  drophere.className = '';
  heading.textContent = 'Done!';
  yield true;

  heading.textContent = initialText;
  drophere.style.borderColor = 'red';
  yield true;

  drophere.style.borderColor = 'transparent';
  page.style.borderColor = 'red';
  yield true;

}
