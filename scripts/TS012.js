
export default async function(node, next, timing) {
  const fill = node.querySelector('.fill');
  const sidebar = node.querySelector('.sidebar');
  const feature = node.querySelector('ts-feature');
  const dialog = feature.querySelector('.dialog');
  const form = node.querySelector('form');
  const warn = node.querySelector('form#warn');

  timing(3000);  // longer to settle
  await next({device: 'desktop', scene: 'side'});

  // show dialog
  fill.classList.add('show');
  feature.setAttribute('mode', 'popout');
  timing(6000);
  await next();

  // force next to happen fast
  timing(9000);
  await next();

  // hide dialog and show sidebar
  sidebar.classList.add('show');
  sidebar.classList.add('delay');
  feature.setAttribute('mode', 'hide');
  timing(10000);
  await next();

  // wait for time before doing anything
  timing(12500);
  await next();

  // hide everything
  fill.classList.remove('show');
  sidebar.classList.remove('delay');
  sidebar.classList.remove('show');
  timing(13000);
  await next();

  // show form
  form.classList.remove('hide');
  timing(14000);
  await next();

  // hide form quickly
  form.classList.add('hide');
  timing(16000);
  await next({scene: 'flat'});

  // show dialog again
  fill.classList.add('show');
  feature.setAttribute('mode', 'popout');
  warn.classList.remove('hide');
  dialog.querySelector('button').focus();
  timing(18000);
  await next();

  // show how you can get behind
  fill.classList.add('raise');
  feature.classList.add('raise');
  timing(21000);
  await next();

  // switch focus
  const warnButton = warn.querySelector('button');
  warnButton.focus();
  timing(21500);
  await next();
  timing(22000);
  await next();

  // show clicking on button
  warnButton.classList.add('hold');
  timing(23250);
  await next();

  // fade it all away
  fill.classList.remove('raise');
  warnButton.classList.remove('hold');
  timing(24000);
  await next();
  warnButton.blur();
  feature.classList.remove('raise');
  timing(25000);
  await next({scene: 'alt-side'});

  // switch dialog stylezzzz
  dialog.classList.add('native');
  timing(27000);
  await next();
  timing(29000);
  await next();

  // go flat again, hide everything
  feature.setAttribute('mode', 'hide');
  fill.classList.remove('show');
  warn.classList.add('hide');
  feature.classList.add('raise');
  timing(31000);
  await next({scene: 'flat'});

  // all done, now hide and show form
  form.classList.remove('hide');
  timing(33000);

  // show inert color as part of 'click'
  form.querySelector('button').classList.add('hold');
  form.classList.add('inert');
  timing(35000);
  await next();

  // fade
  form.querySelector('button').classList.remove('hold');
  form.classList.add('fade');
  timing(37000);
  await next();
}
