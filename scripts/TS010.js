
export default async function(node, next, timing) {
  const page = node.querySelector('#page');
  const hand = node.querySelector('#hand');
  const form = node.querySelector('form');
  const input = form.querySelector('input[type="file"]');
  const submit = form.querySelector('input[type="submit"]')
  hand.style.transform = 'translate(200px, 400px)';

  form.addEventListener('submit', ev => ev.preventDefault());

  // Turns out we actually need to follow the tip itself: as FileList can't be virtually created.
  let savedForLater = null;
  node.addEventListener('dragover', ev => ev.preventDefault());
  node.addEventListener('drop', ev => {
    ev.preventDefault();
    savedForLater = ev.dataTransfer.files;
    console.info('got files in savedForLater', savedForLater);
  });
  await next({scene: 'side', device: 'desktop'})

  timing(2 * 1000);
  await next();

  hand.classList.add('show');
  hand.style.transform = 'translate(180px, 120px)';
  timing(4 * 1000);
  await next();

  console.info('letting go');
  hand.classList.add('letgo');
  timing(6 * 1000); 
  await next();

  hand.classList.remove('show');
  node.classList.add('mode-photo');
  timing(8 * 1000);
  await next();

  node.classList.remove('mode-photo');
  hand.style.transform = 'translate(700px, 720px)';
  hand.className = 'noshadow';
  timing(13 * 1000);
  await next({scene: 'flat'});

  hand.classList.add('show');
  hand.style.transform = 'translate(200px, 145px)';
  timing(19 * 1000);
  await next();

  hand.className = 'letgo bounce noshadow'
  timing(26 * 1000);
  await next();

  // setup frame
  hand.style.transform = 'translate(220px, 380px)';
  hand.className = 'noshadow';
  form.hidden = false;
  timing(29 * 1000);
  await next({scene: 'side'});

  hand.classList.add('show');
  hand.style.transform = 'translate(248px, 180px)';
  timing(31 * 1000);
  await next();

  hand.classList.add('letgo');
  timing(32 * 1000);
  await next();

  hand.classList.remove('show');
  console.info('applying savedForLater', savedForLater);
  input.files = savedForLater;
  timing(34 * 1000);
  await next();

  submit.focus();
  submit.click();
  timing(37 * 1000);
  await next();

  form.hidden = true;
  hand.className = 'noshadow';
  hand.style.transform = 'translate(220px, 510px)';
  await next();

  const drophere = node.querySelector('#drophere');
  drophere.hidden = false;
  hand.classList.add('show');
  hand.classList.add('multiple');
  hand.style.transform = 'translate(248px, 260px)';
  timing(42 * 1000);
  await next();

  hand.classList.add('letgo');
  hand.classList.add('fade');
  await next();

  // "Upload these files directory with JavaScript"...
  hand.classList.remove('show');
  drophere.classList.add('active');
  const heading = drophere.querySelector('h1');
  const initialText = heading.textContent;
  heading.textContent = 'Uploading...';
  timing(44 * 1000);
  await next();

  drophere.className = 'upload';
  timing(46 * 1000);
  await next();

  drophere.className = '';
  heading.textContent = 'Done!';
  timing(49 * 1000);
  await next();

  timing(53 * 1000);  // delay frame
  await next();

  heading.textContent = initialText;
  drophere.style.borderColor = 'red';
  timing(55 * 1000);
  await next();

  drophere.style.borderColor = 'transparent';
  page.style.borderColor = 'red';
  timing(57 * 1000);
  await next();

}
