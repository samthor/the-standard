
export default async function(node, next) {
  await next({scene: 'flat'});

  await next({rotate: 'left'});

}
