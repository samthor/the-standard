
export default async function(node, next) {
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
  (await next({scene: 'side', device: 'desktop'})).timing(1234);

  hand.classList.add('show');
  hand.style.transform = 'translate(180px, 120px)';
  await next();

  hand.classList.add('letgo');
  await next();

  hand.classList.remove('show');
  node.classList.add('mode-photo');
  await next();

  node.classList.remove('mode-photo');
  hand.style.transform = 'translate(700px, 720px)';
  hand.className = 'noshadow';
  await next({scene: 'flat'});

  hand.classList.add('show');
  hand.style.transform = 'translate(200px, 145px)';
  await next();

  hand.className = 'letgo bounce noshadow'
  await next();

  // setup frame
  hand.style.transform = 'translate(220px, 380px)';
  hand.className = 'noshadow';
  await next({scene: 'side'});

  form.hidden = false;
  hand.classList.add('show');
  hand.style.transform = 'translate(248px, 180px)';
  await next();

  hand.classList.add('letgo');
  await next();

  hand.classList.remove('show');
  console.info('applying savedForLater', savedForLater);
  input.files = savedForLater;
  await next();

  submit.focus();
  submit.click();
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
  await next();

  drophere.className = 'upload';
  await next();

  drophere.className = '';
  heading.textContent = 'Done!';
  await next();

  heading.textContent = initialText;
  drophere.style.borderColor = 'red';
  await next();

  drophere.style.borderColor = 'transparent';
  page.style.borderColor = 'red';
  await next();

}
