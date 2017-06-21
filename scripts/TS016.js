
export default async function(node, next) {
  await next({scene: 'flat'});
}
