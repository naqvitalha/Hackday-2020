import pixiScenes from './pixi/scenes.js'

export default class SceneController {
    constructor(app, stats, gui) {
        this._app = app;
        this._stats = stats;
        this._gui = gui;

        this._scenes = [];

        let sceneList;
        sceneList = pixiScenes;

        for (const Scene of sceneList) {
            this._scenes.push(new Scene(app, gui));
        }

        this._guiData = {
            scene: 0,
            objectCount: 10000
        };

        if (Number.isNaN(this._guiData.scene)) {
            this._guiData.scene = 0;
        }

        if (Number.isNaN(this._guiData.objectCount)) {
            this._guiData.objectCount = 10000;
        }


        const guiEntries = {};
        this._scenes.forEach((scene, index) => {
            guiEntries[scene.title] = index;
        })
        this._scenes[this._guiData.scene].changeObjectCount(this._guiData.objectCount);
        if(stats.onNext){
            let onNext = function(){
                this._guiData.objectCount *= 1.5
                this._scenes[this._guiData.scene].changeObjectCount(this._guiData.objectCount);
            };
            stats.onNext(onNext.bind(this))
        }

        if(stats.onDone){
            let onDone = function(){
                this._scenes[this._guiData.scene].stop();
            };
            stats.onDone(onDone.bind(this))
        }

        this._scenes[0].start(this._guiData.objectCount);
    }

}
