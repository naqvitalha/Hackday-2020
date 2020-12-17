/**
 * Convenience class to create a new PIXI application.
 */
export class App {
  /**
   * @param {function} resolvePromise - call when assets have preloader
   * @param {Object} stats - stats instance
   */
  constructor(resolvePromise, stats) {
    window.PIXI.Loader.shared
      .add(
        "https://firebasestorage.googleapis.com/v0/b/hack10-7130f.appspot.com/o/images%2Fbunny1.png?alt=media"
      )
      .add(
        "https://firebasestorage.googleapis.com/v0/b/hack10-7130f.appspot.com/o/images%2Fbunny2.png?alt=media"
      )
      .add(
        "https://firebasestorage.googleapis.com/v0/b/hack10-7130f.appspot.com/o/images%2Fbunny3.png?alt=media"
      )
      .add(
        "https://firebasestorage.googleapis.com/v0/b/hack10-7130f.appspot.com/o/images%2Fbunny4.png?alt=media"
      )
      .add(
        "https://firebasestorage.googleapis.com/v0/b/hack10-7130f.appspot.com/o/images%2Fbunny5.png?alt=media"
      )
      .add(
        "https://firebasestorage.googleapis.com/v0/b/hack10-7130f.appspot.com/o/images%2Fbunny6.png?alt=media"
      )
      .add(
        "https://firebasestorage.googleapis.com/v0/b/hack10-7130f.appspot.com/o/images%2Fbunny7.png?alt=media"
      )
      .add(
        "https://firebasestorage.googleapis.com/v0/b/hack10-7130f.appspot.com/o/images%2Fbunny8.png?alt=media"
      )
      .add(
        "https://firebasestorage.googleapis.com/v0/b/hack10-7130f.appspot.com/o/images%2Fbunny9.png?alt=media"
      )
      .add(
        "https://firebasestorage.googleapis.com/v0/b/hack10-7130f.appspot.com/o/images%2Fbunny10.png?alt=media"
      )
      .add(
        "https://firebasestorage.googleapis.com/v0/b/hack10-7130f.appspot.com/o/images%2Fbunny11.png?alt=media"
      )
      .add(
        "https://firebasestorage.googleapis.com/v0/b/hack10-7130f.appspot.com/o/images%2Fbunny12.png?alt=media"
      )
      .add(
        "https://firebasestorage.googleapis.com/v0/b/hack10-7130f.appspot.com/o/spritesheets%2Fbunnies.json?alt=media"
      )
      .add(
        "https://firebasestorage.googleapis.com/v0/b/hack10-7130f.appspot.com/o/bitmap-fonts%2Fdesyrel.xml?alt=media"
      )
      .load(() => {
        resolvePromise(this);
      });

    const options = {
      width: 960,
      height: 540,
      transparent: false,
      antialias: false,
      preserveDrawingBuffer: false,
      resolution: 1,
      forceCanvas: false,
      backgroundColor: 0x1099bb,
      clearBeforeRender: true,
      roundPixels: false,
      forceFXAA: false,
      legacy: false,
      powerPreference: "high-performance"
    };

    this._stats = stats;

    const RendererType = window.PIXI.utils.isWebGLSupported()
      ? window.PIXI.Renderer || window.PIXI.WebGLRenderer
      : window.PIXI.CanvasRender;
    if (!RendererType) {
      return window.alert("No valid renderer found");
    }

    /**
     * WebGL renderer if available, otherwise CanvasRenderer
     *
     * @member {PIXI.WebGLRenderer|PIXI.CanvasRenderer}
     */
    if (this._renderer) {
    }

    if (window.PIXI.VERSION[0] === "5") {
      this._renderer = new RendererType(options);
    } else {
      this._renderer = new RendererType(options.width, options.height, options);
    }

    /**
     * The root display container that's rendered.
     *
     * @member {PIXI.Container}
     */
    this._stage = new window.PIXI.Container();

    this._screen = {
      width: options.width,
      height: options.height
    };

    /**
     * Ticker for doing render updates.
     *
     * @member {PIXI.ticker.Ticker}
     */
    this.ticker = window.PIXI.Ticker
      ? new window.PIXI.Ticker()
      : new window.PIXI.ticker.Ticker();
    this.ticker.add(this._render, this);
    this.ticker.start();

    this.canvas.classList.add("center");
    document.getElementById("frame").appendChild(this.canvas);
  }

  /**
   * Render the current stage.
   */
  _render() {
    this._stats.begin();
    this._renderer.render(this.stage);
    this._stats.end();
  }

  get canvas() {
    return this._renderer.view;
  }

  /**
   * The root display container that's rendered.
   *
   * @member {PIXI.Container}
   * @readonly
   */
  get stage() {
    return this._stage;
  }

  /**
   * Reference to the renderer's screen rectangle. Its safe to use as filterArea or hitArea for whole screen
   *
   * @member {Object}
   * @readonly
   */
  get screen() {
    return this._screen;
  }
}
