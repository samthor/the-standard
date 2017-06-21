
const devices = {
  '': {
    size: {width: 320, height: 480},
  },
  'tablet': {
    size: {width: 320, height: 480},
  },
  'desktop': {
    size: {width: 600, height: 450},
  },
};

/**
 * Renders a mobile device that transforms well in 3D.
 *
 * Supports several alternate devices ('tablet', 'desktop') and rotate 'left' or 'right'.
 */
class StandardDeviceElement extends HTMLElement {
  static get observedAttributes() { return ['device', 'rotate', 'tweak']; }

  constructor() {
    super();

    const root = this.attachShadow({mode: 'open'});
    root.innerHTML = `
<style>
:host {
  --duration: var(--frame4, 0.5s);
}

.holder {
  color: #b5b5b5;
  position: relative;
  display: inline-block;
  margin: 32px auto;
  transform-style: preserve-3d;
  transform: rotate(0);
  transition: transform var(--duration);
  will-change: transform;
}
:host([rotate="left"]) .holder {
  transform: rotate(90deg);
}
:host([rotate="right"]) .holder {
  transform: rotate(-90deg);
}

#tweak {
  will-change: transform;
  transform: rotate(0);
  transition: transform var(--frame) ease-in-out;
  transform-style: preserve-3d;
}

.device {
  background: currentColor;
  transform-style: preserve-3d;
  z-index: 2;

  /* border hides glitch line between device and its edges */
  border: 1px currentColor solid;
  margin: -1px 0;
  border-radius: 1px;
  border-left: 0;
  border-right: 0;
}

/**
 * The top and bottom of a device.
 */
.device:before, .device:after {
  content: "";
  width: 100%;
  left: 0;
  position: absolute;
  z-index: -10;
  background: transparent;
  height: 1em;
  transition: all 0.5s;
  border-radius: 100%;
}
.device:before {
  transform: translate(0, -50%);
  border-top: 1em solid currentColor;
}
.device:after {
  bottom: 0;
  transform: translate(0, +50%);
  border-bottom: 1em solid currentColor;
}

.camera {
  position: absolute;
  top: 12px;
  left: 50%;
  transform: translate(-50%, -50%);
  width: 24px;
  height: 24px;
  background: #c2c2c2;
  border-radius: 100px;
  transition: opacity var(--duration);
}

#contents {
  position: relative;
  background: white;
  transition: all var(--duration);
  transform: translate(-50%, -50%) rotate(0);
  transform-style: preserve-3d;
  left: 50%;
  top: 50%;

  /* unsensible defaults */
  width: 200px;
  height: 200px;
}
#border.during-rotate {
  overflow: hidden;  /* FIXME: can cause a twig in scene="flat" */
}
:host([rotate="left"]) #contents {
  transform: translate(-50%, -50%) rotate(-90deg);
}
:host([rotate="right"]) #contents {
  transform: translate(-50%, -50%) rotate(90deg);
}
#border {
  margin: 40px 16px;
  transition: margin var(--duration);
  position: relative;
  transform-style: preserve-3d;
}
#color {
  box-sizing: border-box;
  position: absolute;
  width: 100%;
  height: 100%;
  background: white;
}

.shadow {
  position: absolute;
  top: 0;
  width: 100%;
  height: 100%;
  z-index: -1;
  transform: translate3d(0, 0, -20px);
  color: #717171;
  background: currentColor;
}

.solid {
  z-index: 1; /* "above" shadow */
}

.solid:after, .solid:before {
  content: '';
  position: absolute;
  background: currentColor;
  height: 20px;
  left: 0;
  right: 0;
  transform: rotateX(90deg);
  transform-origin: 50% 0;
  transition: all var(--duration);
}
.solid:after {
  top: -2px;
}
.solid:before {
  bottom: -2px;
  transform: translateY(100%) rotateX(90deg);
}

/** tablet device */

:host([device="tablet"]) .device:before,
:host([device="tablet"]) .device:after {
  border-radius: 1000px;
}

:host([device="tablet"]) .solid:after,
:host([device="tablet"]) .solid:before {
  left: 6px;
  right: 6px;
}
:host([device="tablet"]) .solid:after {
  top: -13px;
}
:host([device="tablet"]) .solid:before {
  bottom: -13px;
}

/** desktop device */

:host([device="desktop"]) .device:before,
:host([device="desktop"]) .device:after {
  border-radius: 1000px;
  height: 0;
}
:host([device="desktop"]) #border {
  margin: 8px 16px;
}
:host([device="desktop"]) .camera {
  opacity: 0;
}

</style>
<div id="tweak">
  <div class="holder">
    <div class="device">
      <div class="device shadow">
        <div class="solid"></div>
      </div>
      <div class="camera"></div>
      <div id="border">
        <div id="color"></div>
        <div id="contents">
  <slot></slot>
        </div>
      </div>
    </div>
  </div>
</div>
    `;

    this.tweak_ = root.getElementById('tweak');
    this.border_ = root.getElementById('border');
    this.contents_ = root.getElementById('contents');
    this.contents_.addEventListener('transitionend', ev => {
      this.border_.classList.remove('during-rotate');
    });
    this.holder_ = root.querySelector('div.holder');

    this.addEventListener('tweak', ev => this.tweak = ev.detail);
    this.addEventListener('device', ev => this.device = ev.detail);
    this.addEventListener('rotate', ev => this.rotate = ev.detail);
  }

  attributeChangedCallback(attrName, oldValue, newValue) {
    if (attrName === 'tweak') {
      this.tweak_.style.transform = newValue || null;
      return false;;
    }

    if (attrName === 'rotate') {
      this.border_.classList.add('during-rotate');
    }

    const spec = devices[this.device] || devices[''];

    let {width, height} = spec.size;
    this.border_.style.width = width + 'px';
    this.border_.style.height = height + 'px';

    if (this.rotate) {
     [width, height] = [height, width];
    }
    this.contents_.style.width = width + 'px';
    this.contents_.style.height = height + 'px';
  }

  reset() {
    this.rotate = null;
    this.device = null;
  }

  get tweak() {
    return this.getAttribute('tweak') || null;
  }

  set tweak(v) {
    if (v) {
      this.setAttribute('tweak', v);
    } else {
      this.removeAttribute('tweak');
    }
  }

  get rotate() {
    return this.getAttribute('rotate');
  }

  set rotate(v) {
    if (v) {
      this.setAttribute('rotate', v);
    } else {
      this.removeAttribute('rotate');
    }
  }

  get spec_() {
    return devices[this.device] || null;
  }

  get device() {
    return this.getAttribute('device') || '';
  }

  set device(v) {
    if (v) {
      this.setAttribute('device', v);
    } else {
      this.removeAttribute('device');
    }
  }
}

customElements.define('ts-device', StandardDeviceElement);