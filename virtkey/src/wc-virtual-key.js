const template = document.createElement('template');
template.innerHTML = `
<canvas><canvas>
`;

class WCVirtualKey extends HTMLElement {
  constructor () {
    super();
    this.attachShadow({ mode: 'open' });
    this.shadowRoot.appendChild(template.content.cloneNode(true));
    this.canvas = this.shadowRoot.querySelector('canvas');
    this.ctx = this.canvas.getContext('2d');
    this.canvasWidth = parseInt(this.dataset.width);
    this.canvasHeight = parseInt(this.dataset.height);
    this.padding = parseInt(this.dataset.padding);
    this.opacity = parseFloat(this.dataset.opacity);
    this.negate = this.dataset.negate;
    this.keyCode = parseInt(this.dataset.keycode);
    this.key = this.dataset.key;
    this.keyBottomPad = parseInt(this.dataset.keyBottomPad);
    this.keyRightPad = parseInt(this.dataset.keyRightPad);
    this.pressed = false;
    this.keyboardDown = false;
    this.render();

    const onMove = (e) => {
      this.ctx.clearRect(0, 0, this.canvasWidth, this.canvasHeight);
    };

    let target;
    const pressedLoop = () => {
      if (this.pressed) {
        target.preventDefault();
        requestAnimationFrame(pressedLoop);
        window.pubsub.publish(`${this.key}_key_down`);
      }
    };
    const key = (e) => {
      target = e;
      e.preventDefault();
      this.pressed = true;
      window.pubsub.publish(`${this.key}_key`);
      pressedLoop();
      this.render();
    };
    const keyup = (e) => {
      target = e;
      this.pressed = false;
      window.pubsub.publish(`${this.key}_key_up`);
      this.render();
    };
    const keyboardDown = (e) => {
      if (!this.keyboardDown && e.keyCode === this.keyCode) {
        this.simulateKeyDown();
        this.keyboardDown = true;
        // console.log(`${this.key}_key down`);
      }
    };
    const keyboardUp = (e) => {
      if (e.keyCode === this.keyCode) {
        this.simulateKeyUp();
        this.keyboardDown = false;
        // console.log(`${this.key}_key up`);
      }
    };
    window.addEventListener('keydown', keyboardDown);
    window.addEventListener('keyup', keyboardUp);
    this.canvas.addEventListener('mouseleave', keyup);
    this.canvas.addEventListener('move', onMove);;
    this.canvas.addEventListener('mousedown', key);
    this.canvas.addEventListener('touchstart', key);
    this.canvas.addEventListener('mouseup', keyup);
    this.canvas.addEventListener('touchend', keyup);
  }

  render () {
    this.ctx.save();
    this.canvas.width = this.canvasWidth;
    this.canvas.height = this.canvasHeight;
    this.ctx.clearRect(0, 0, this.canvasWidth, this.canvasHeight);
    this.ctx.shadowOffsetX = this.padding;
    this.ctx.shadowOffsetY = this.padding;
    this.ctx.shadowColor = (this.negate === '0') ? `rgba(0,0,0,${this.opacity})` : `rgba(255,255,255,${this.opacity})`;
    this.ctx.shadowBlur = 5;
    this.ctx.strokeStyle = (this.negate === '0') ? `rgba(0,0,0,${this.opacity})` : `rgba(255,255,255,${this.opacity})`;
    this.ctx.fillStyle = (this.pressed) ? (this.negate === '0') ? `rgba(0,0,0,${this.opacity * 0.5})` : `rgba(255,255,255,${this.opacity * 0.5})` : 'rgba(0,0,0,0)';
    this.ctx.beginPath();
    this.ctx.rect(this.padding, this.padding, this.canvasWidth - this.padding, this.canvasHeight - this.padding);
    this.ctx.closePath();
    this.ctx.fill();
    this.ctx.stroke();
    this.ctx.restore();
    this.ctx.textAlign = 'right';
    this.textBaseline = 'bottom';
    this.fillText(this.key, this.canvasWidth - this.keyRightPad, this.canvasHeight - this.keyBottomPad, 'sans-serif 15px', (this.pressed) ? (this.negate === '0') ? `rgba(255,255,255,${this.opacity})` : `rgba(0,0,0,${this.opacity})` : (this.negate === '0') ? `rgba(0,0,0,${this.opacity})` : `rgba(255,255,255,${this.opacity})`);
  }

  clear () {
    this.ctx.clearRect(0, 0, this.canvasWidth, this.canvasHeight);
  }

  fillText (string, x, y, css, color) {
    this.ctx.save();
    // console.log({ string, x, y, css, color });
    this.ctx.font = css;
    this.ctx.fillStyle = color;
    this.ctx.fillText(string, x, y);
    this.ctx.restore();
  }

  static get observedAttributes () {
    return ['data-width', 'data-height', 'data-padding', 'data-opacity', 'data-key', 'data-keyBottomPad', 'data-keyRightPad', 'data-negate', 'data-keycode'];
  }

  attributeChangedCallback (attributeName, oldVal, newVal) {
    this.clear();
    switch (attributeName) {
      case 'data-width':
        this.canvasWidth = parseInt(this.dataset.width);
        break;
      case 'data-height':
        this.canvasHeight = parseInt(this.dataset.height);
        break;
      case 'data-padding':
        this.padding = parseInt(this.dataset.padding);
        break;
      case 'data-opacity':
        this.opacity = parseFloat(this.dataset.opacity);
        break;
      case 'data-negate':
        this.negate = this.dataset.negate;
        break;
      case 'data-key':
        this.key = this.dataset.key;
        break;
      case 'data-keyBottomPad':
        this.keyBottomPad = parseInt(this.dataset.keyBottomPad);
        break;
      case 'data-keyRightPad':
        this.keyRightPad = parseInt(this.dataset.keyRightPad);
        break;
      case 'data-keycode':
        this.keycode = parseInt(this.dataset.keyCode);
        break;
    }
    this.render();
  }

  simulateKeyDown () {
    this.canvas.dispatchEvent(new Event('mousedown'));
  }

  simulateKeyUp () {
    this.canvas.dispatchEvent(new Event('mouseup'));
  }
}

customElements.define('wc-virtkey', WCVirtualKey);
