
import 'https://cdn.rawgit.com/liabru/matter-js/0.10.0/build/matter.min.js';  // side-effects

export default async function(node, next) {
  const $ = {};
  Array.from(node.querySelectorAll('[id]')).forEach(node => $[node.id] = node);

  const dim = 480 * 2;
  const engine = Matter.Engine.create();
  const world = engine.world;
  const bounds = Matter.Bounds.create([{x: 0, y: 0}, {x: dim, y: dim}]);

  const render = Matter.Render.create({
    element: node.querySelector('#game'),
    engine: engine,
    options: {
      width: dim,
      height: dim,
      background: 'rgba(255, 255, 255, 0.0)',
      showAngleIndicator: false,
      wireframes: false,
    },
    bounds: bounds,
  });

  const buildFace = (function(choices) {
    let index = -1;

    return (x, y) => {
      const url = `assets/faces/${++index % choices}.png`;
      const dim = 120;
      const circleSize = 48;
      const scale = (circleSize / dim) * 2;

      return Matter.Bodies.circle(x, y, circleSize, {
        density: 0.2,
        frictionAir: 0.02,
        restitution: 1.0,
        friction: 0.02,
        render: {sprite: {texture: url, xScale: scale, yScale: scale}},
      });
    };
  }(7));

  const runner = Matter.Runner.create();
  Matter.Render.run(render);

  const floor = Matter.Bodies.rectangle(dim/2, dim+8, dim, 10, {isStatic: true});
  Matter.World.add(world, [floor]);

  const setRotate = rotate => {
    $.portrait.classList.toggle('active', !rotate);
    $.landscape.classList.toggle('active', !!rotate);
  };

  setRotate(null);
  await next({scene: 'side', device: 'tablet'});
  // frames start from here

  setRotate('left');
  await next({rotate: 'left'});

  setRotate(null);
  await next({rotate: null});

  setRotate('right');
  await next({rotate: 'right'});

  node.classList.add('measure');
  await next();
  await next({device: ''});

  $.game.hidden = false;
  $.normal.hidden = true;
  Matter.Runner.run(runner, engine);

  const delay = parseInt(window.getComputedStyle(node).getPropertyValue('--frame4'));
  const interval = window.setInterval(_ => {
    const face = buildFace(dim / 2, -80);
    Matter.World.add(world, face);
  }, delay);

  await next();

  world.gravity.x = -0.4;
  await next({tweak: 'rotate(-10deg)'});

  world.gravity.x = 0;
  $.game.hidden = true;
  await next({tweak: ''});
  await next({rotate: ''});

  $.explainer.hidden = false;
  $.type.textContent = 'Alpha';
  $.note.textContent = 'around the Z-axis';
  await next({tweak: 'rotateY(+50deg)'});
  await next({tweak: 'rotateY(-50deg)'});

  $.type.textContent = 'Beta';
  $.note.textContent = 'around the X-axis';
  await next({tweak: 'rotateX(+50deg)'});
  await next({tweak: 'rotateX(-50deg)'});

  $.type.textContent = 'Gamma';
  $.note.textContent = 'around the Y-axis';
  await next({tweak: 'rotateZ(+30deg)'});
  await next({tweak: 'rotateZ(-30deg)'});

  await next({tweak: ''});
  $.game.hidden = false;
  $.explainer.hidden = true;

  world.gravity.x = +0.4;
  await next({tweak: 'rotate(+15deg)'});

  world.gravity.x = -0.4;
  await next({tweak: 'rotate(-30deg)'});

  world.gravity.x = 0;
  await next({tweak: ''});

  $.game.hidden = true;
  $.form.hidden = false;
  await next({tweak: ''});

  // nb. shake added by video editor :)
  $.form.querySelector('input').value = '';

  await next();

  // cleanup here
  Matter.Render.stop(render);
  Matter.Runner.stop(runner, engine);
  window.clearInterval(interval);
}
