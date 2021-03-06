
function applyNextArg(node, arg) {
  const clone = arg ? JSON.parse(JSON.stringify(arg)) : {};
  ['scene', 'device', 'rotate', 'tweak'].forEach(op => {
    if (op in clone) {
      const init = {detail: clone[op], bubbles: true, composed: true};
      node.dispatchEvent(new CustomEvent(op, init));
      delete clone[op];
    }
  });
  for (const k in clone) {
    throw new Error('unexpected scene arg: ' + k);
  }
}

export function asyncer(node, method, timing) {
  let done = false;
  let eventually = null;
  let localResolve = () => undefined;
  let nextFrame = null;
  const next = async arg => {
    applyNextArg(node, arg);
    await nextFrame;
  };

  return () => {
    const r = localResolve;
    nextFrame = new Promise(resolve => localResolve = resolve);
    r();  // call this after setting up anew, so we block next frame

    if (!eventually) {
      // 1st call
      eventually = method(node, next, timing);  // final promise
      eventually.then(() => done = true, err => done = err);
    }
    if (typeof done !== 'boolean') {
      throw done;
    } else {
      return done;
    }
  };
}

export function frame(node, frames) {
  let i = -1;

  return nextDelay => {
    const frame = frames[++i];
    if (!frame) {
      console.info('animation done');
      return true;
    }
    console.info('rendering frame', i, frame);

    if ('class' in frame) { node.className = frame.class; }
    if ('scene' in frame) {
      const arg = {detail: frame.scene, bubbles: true, composed: true};
      node.dispatchEvent(new CustomEvent('scene', arg));
    }

    // FIXME: return a delayed Promise for the longer delay
    // if ('delay' in frame) { nextDelay = Math.max(frame.delay, nextDelay); }

    if ('value' in frame) {
      const el = node.querySelector(frame.value.q);
      el.value = frame.value.value;
    }

    if ('attr' in frame) {
      const attr = frame.attr;
      const el = node.querySelector(attr.q);
      if (attr.value !== undefined) {
        el.setAttribute(attr.name, attr.value);
      } else {
        el.removeAttribute(attr.name);
      }
    }

    if ('keyboard' in frame) {
      const k = frame.keyboard;
      const el = node.querySelector(k.q);
      let remaining = k.value || '';
      el.focus();
      let first = true;

      const seg = (nextDelay / remaining.length) * 0.75;
      const interval = window.setInterval(() => {
        if (first) {
          el.value = '';
          first = false;
          return;
        }
        if (!remaining.length) {
          window.clearInterval(interval);
          return;
        }
        let i = 0;
        while (remaining[i] === ' ') {
          ++i;
        }
        el.value = el.value + remaining.substr(0, i + 1);
        el.focus();
        remaining = remaining.substr(i + 1);
      }, seg);
    }

    if ('click' in frame) {
      const el = node.querySelector(frame.click);
      el.focus();
      window.setTimeout(() => {
        el.click();
      }, nextDelay * 0.25);
      window.setTimeout(() => {
        (document.activeElement || el).blur();
      }, nextDelay * 0.75);
    }

    if ('scroll' in frame) {
      const el = node.querySelector(frame.scroll.q);

      const startAt = el.scrollTop;
      const scrollTo = frame.scroll.to;

      const start = performance.now();
      const update = whenever => {
        const delta = performance.now() - start;

        let ratio = (delta / nextDelay);
        ratio = Math.max(0, ratio);
        ratio = Math.min(1, ratio);

        el.scrollTop = (scrollTo - startAt) * ratio + startAt;

        if (ratio < 1) {
          window.requestAnimationFrame(update);
        }
      };
      window.requestAnimationFrame(update);

    }

  };
}