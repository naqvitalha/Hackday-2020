export function loadScript(url) {
    return new Promise((resolve, reject) => {
        const script = document.createElement("script");
        script.type = "text/javascript";
        script.src = url;
        script.async = true;
        script.addEventListener("load", resolve)
        script.addEventListener("error", reject)
        document.body.appendChild(script);
    });
}

export function pollyfillPixi() {
    if (window.PIXI) {
        // v3 does not have .from, so since we preload assets, use fromFrame instead
        if (!window.PIXI.Sprite.from) {
           window.PIXI.Sprite.from =window.PIXI.Sprite.fromFrame;
        }

        // move v3 and v4 loaders to the v5 area
        if (!window.PIXI.Loader || !window.PIXI.Loader.shared) {
           window.PIXI.Loader = {
                shared:window.PIXI.loader
            }
        }

        // move v3 and v4 BitmapText to the v5 area
        if (!window.PIXI.BitmapText) {
           window.PIXI.BitmapText =window.PIXI.extras.BitmapText;
        }
        // v3 does not contain this function natively
        if (!window.PIXI.Graphics.prototype.drawStar) {
           window.PIXI.Graphics.prototype.drawStar = function (x, y, points, radius, innerRadius, rotation = 0) {
                innerRadius = innerRadius || radius / 2;

                const startAngle = (-1 * Math.PI / 2) + rotation;
                const len = points * 2;
                const delta =window.PIXI.PI_2 / len;
                const polygon = [];

                for (let i = 0; i < len; i++) {
                    const r = i % 2 ? innerRadius : radius;
                    const angle = (i * delta) + startAngle;

                    polygon.push(
                        x + (r * Math.cos(angle)),
                        y + (r * Math.sin(angle))
                    );
                }

                return this.drawPolygon(polygon);
            }
        }
    }
}