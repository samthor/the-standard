/**
 * Renders a mobile device that transforms well in 3D.
 *
 * Supports [device="tablet"], and [overflow] (which makes everything non-3d, but contains the
 * contents of the screen.
 */
class StandardDeviceElement extends HTMLElement {
  static get observedAttributes() { return ['rows', 'overflow']; }

  static get devices() { return ['', 'tablet', 'desktop']; }

  constructor() {
    super();

    const root = this.attachShadow({mode: 'open'});
    root.innerHTML = `
<style>

.holder {
  color: #b5b5b5;
  position: relative;
  display: inline-block;
  margin: 32px auto;
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
  transition: opacity 0.5s;
}

.size {
  position: relative;
  background: white;
  transition: width 0.5s, height 0.5s;

  width: 320px;
  height: 480px;
}
.border {
  padding: 40px 16px;
  transition: padding 0.5s;
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
  transition: all 0.5s;
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

:host([device="desktop"]) .size {
  width: 600px;
  height: 450px;
}
:host([device="desktop"]) .device:before,
:host([device="desktop"]) .device:after {
  border-radius: 1000px;
  height: 0;
}
:host([device="desktop"]) .border {
  padding: 8px 16px;
}
:host([device="desktop"]) .camera {
  opacity: 0;
}

/** non-3d mode that allows hiding stuff */

:host([overflow]) .size {
  display: block;
  overflow: hidden;
}

</style>
<div class="holder">
  <div class="device">
    <div class="device shadow">
      <div class="solid"></div>
    </div>
    <div class="camera"></div>
    <div class="border">
      <div class="size" id="contents">
<slot></slot>
      </div>
    </div>
  </div>
</div>
    `;

    this.holder_ = root.querySelector('div.holder');
    this.addEventListener('device', ev => this.device = ev.detail);
  }

  stepDevice() {
    const devices = StandardDeviceElement.devices;
    const device = this.getAttribute('device') || '';
    const target = (devices.indexOf(device) + 1) % devices.length;

    const update = devices[target];
    if (!update) {
      this.removeAttribute('device');
    } else {
      this.setAttribute('device', update);
    }
  }

  get device() {
    return this.getAttribute('device');
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