
export function generator(page, method) {
  const iter = method(page);

  return function(nextDelay) {
    const out = iter.next();
    if (out.done) {
      return true;  // stop calling me
    }
    if (out.value !== true) {
      throw new Error('unsupported generator value: ' + value);
    }
  }
}

export function frame(page, frames) {
  let i = -1;
  return function(nextDelay) {
    const frame = frames[++i];
    if (!frame) {
      console.info('animation done');
      return true;
    }
    console.info('rendering frame', i, frame);

    if ('class' in frame) { page.class = frame.class; }
    if ('scene' in frame) {
      page.dispatchEvent(new CustomEvent('scene', {detail: frame.scene, bubbles: true}));
    }

    // FIXME: incorporate overflow into styling of scene
    // if ('overflow' in frame) { device.overflow = frame.overflow; }

    // FIXME: return a delayed Promise for the longer delay
    // if ('delay' in frame) { nextDelay = Math.max(frame.delay, nextDelay); }

    if ('value' in frame) {
      const el = page.q(frame.value.q);
      el.value = frame.value.value;
    }

    if ('attr' in frame) {
      const attr = frame.attr;
      const el = page.q(attr.q);
      if (attr.value !== undefined) {
        el.setAttribute(attr.name, attr.value);
      } else {
        el.removeAttribute(attr.name);
      }
    }

    if ('keyboard' in frame) {
      const k = frame.keyboard;
      const el = page.q(k.q);
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
      const el = page.q(frame.click);
      el.focus();
      window.setTimeout(() => {
        el.click();
      }, nextDelay * 0.25);
      window.setTimeout(() => {
        (document.activeElement || el).blur();
      }, nextDelay * 0.75);
    }

    if ('scroll' in frame) {
      const el = page.q(frame.scroll.q);

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