
export default async function(node, next, timing) {
  const page = node.querySelector('#page');
  const hand = node.querySelector('#hand');
  const form = node.querySelector('form');


  timing(1000);
  await next({device: 'desktop', scene: 'side'});

  console.info('2nd frame??');

}
