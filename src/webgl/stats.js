export const Stats = function () {

    let mode = 0;

    const container = document.createElement('div');
    container.style.cssText = 'cursor:pointer;opacity:0.9';
    container.addEventListener('click', function (event) {

        event.preventDefault();
        showPanel(++mode % container.children.length);

    }, false);

    //

    function addPanel(panel) {
        container.appendChild(panel.dom);
        return panel;
    }

    function showPanel(id) {

        for (let i = 0; i < container.children.length; i++) {

            container.children[i].style.display = i === id ? 'block' : 'none';

        }

        mode = id;

    }

    let beginTime = (performance || Date).now(), prevTime = beginTime, frames = 0;
    let count = 0;
    let trailCount = 0;
    let currentFrameCount = -1;
    let increaseObjectsCallback = null;
    let stopFlag = false;
    let onDoneListeners = [];
    let totalFps = 0;
    let totalFpsMeasures = 0;
    return {

        onNext: function (_listener) {
            increaseObjectsCallback = _listener
        },
        onDone: function (_listener) {
            onDoneListeners.push(_listener)
        },

        REVISION: 16,

        domElement: container,

        addPanel: addPanel,
        showPanel: showPanel,

        setMode: showPanel, // backwards compatibility

        begin: function () {

            beginTime = (performance || Date).now();

        },

        end: function () {
            if (stopFlag) {
                return;
            }
            frames++;
            const time = (performance || Date).now();


            if (time > prevTime + 1000) {
                let fps = (frames * 1000) / (time - prevTime);
                // console.log('fps', fps)
                totalFps += fps
                totalFpsMeasures++
                prevTime = time;
                frames = 0;

                count++
                // console.log('count', count)
                currentFrameCount += fps
                if (count === 5) {
                    count = 0;
                    trailCount++;
                    const currAvg = Math.round(currentFrameCount / 5);
                    currentFrameCount = 0;
                    if ((currAvg) > 50) {
                        // console.log('increase objects. currAvg=', currAvg)
                        increaseObjectsCallback()
                    } else {
                        stopFlag = true
                        const score = Math.round((totalFps/totalFpsMeasures) * 100/60 * trailCount)
                        onDoneListeners.forEach(onDoneListener => onDoneListener(score))
                    }
                }
            }
            return time;
        },

        update: function () {
            // console.log('update')
            beginTime = this.end();
        }

    };

};

Stats.Panel = function (name, fg, bg) {

    let min = Infinity, max = 0;
    const round = Math.round;
    const PR = round(window.devicePixelRatio || 1);

    const WIDTH = 80 * PR, HEIGHT = 48 * PR,
        TEXT_X = 3 * PR, TEXT_Y = 2 * PR,
        GRAPH_X = 3 * PR, GRAPH_Y = 15 * PR,
        GRAPH_WIDTH = 74 * PR, GRAPH_HEIGHT = 30 * PR;

    const canvas = document.createElement('canvas');
    canvas.width = WIDTH;
    canvas.height = HEIGHT;
    canvas.style.cssText = 'width:80px;height:48px';

    const context = canvas.getContext('2d');
    context.font = 'bold ' + (9 * PR) + 'px Helvetica,Arial,sans-serif';
    context.textBaseline = 'top';

    context.fillStyle = bg;
    context.fillRect(0, 0, WIDTH, HEIGHT);

    context.fillStyle = fg;
    context.fillText(name, TEXT_X, TEXT_Y);
    context.fillRect(GRAPH_X, GRAPH_Y, GRAPH_WIDTH, GRAPH_HEIGHT);

    context.fillStyle = bg;
    context.globalAlpha = 0.9;
    context.fillRect(GRAPH_X, GRAPH_Y, GRAPH_WIDTH, GRAPH_HEIGHT);


    return {

        dom: canvas,

        update: function (value, maxValue) {
            min = Math.min(min, value);
            max = Math.max(max, value);
            // console.log('update', {min, max})

            context.fillStyle = bg;
            context.globalAlpha = 1;
            context.fillRect(0, 0, WIDTH, GRAPH_Y);
            context.fillStyle = fg;
            context.fillText(round(value) + ' ' + name + ' (' + round(min) + '-' + round(max) + ')', TEXT_X, TEXT_Y);

            context.drawImage(canvas, GRAPH_X + PR, GRAPH_Y, GRAPH_WIDTH - PR, GRAPH_HEIGHT, GRAPH_X, GRAPH_Y, GRAPH_WIDTH - PR, GRAPH_HEIGHT);

            context.fillRect(GRAPH_X + GRAPH_WIDTH - PR, GRAPH_Y, PR, GRAPH_HEIGHT);

            context.fillStyle = bg;
            context.globalAlpha = 0.9;
            context.fillRect(GRAPH_X + GRAPH_WIDTH - PR, GRAPH_Y, PR, round((1 - (value / maxValue)) * GRAPH_HEIGHT));
        }
    };
}