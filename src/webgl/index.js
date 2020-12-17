import {loadScript, pollyfillPixi} from "./utils";
import {Stats} from "./stats";
import {App} from "./app";
import SceneController from "./SceneController";

export function renderMaxPossibleObjects() {
    return new Promise((resolve, reject) => {
        var stats = new Stats();
        const frameDiv = document.createElement("div");
        frameDiv.id = "frame";
        frameDiv.style.visibility='hidden'
        frameDiv.classList.add("center");
        frameDiv.append(stats.domElement);
        document.body.append(frameDiv);

        const libUrl = `https://pixijs.download/v5.3.3/pixi.min.js`;
        loadScript(libUrl).then((value) => {
            console.log("script loaded!");
            pollyfillPixi();

            function cb() {
            }

            const app = new App(cb, stats);
            new SceneController(app, stats, {});
            // frameDiv.style.visibility = "visible";

        })

        stats.onDone((maxObjects) => {
            resolve(maxObjects)
        })
    })
        ;
}
