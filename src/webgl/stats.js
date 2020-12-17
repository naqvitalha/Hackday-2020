export const Stats = function () {

    var mode = 0;

    var container = document.createElement('div');
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

        for (var i = 0; i < container.children.length; i++) {

            container.children[i].style.display = i === id ? 'block' : 'none';

        }

        mode = id;

    }

    var beginTime = (performance || Date).now(), prevTime = beginTime, frames = 0;
    var count = 0;
    var trailCount = 0;
    var prevAverage = -1;
    var currentFrameCount = -1;
    var increaseObjectsCallback = null;
    var stopFlag = false;
    var onDone = null;
    return {

        onNext: function(_listener){
            increaseObjectsCallback = _listener
        },
        onDone: function(_listener){
            onDone = _listener
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
            var time = (performance || Date).now();


            if (time > prevTime + 1000) {
                let fps = (frames * 1000) / (time - prevTime);
                console.log('fps', fps)

                prevTime = time;
                frames = 0;

                count++
                // console.log('count', count)
                currentFrameCount += fps
                if (count === 5) {
                    count = 0;
                    trailCount++;
                    var currAvg = Math.round(currentFrameCount / 5);
                    currentFrameCount = 0;
                    if ((currAvg) > 50) {
                        prevAverage = currAvg;
                        console.log('increase objects. currAvg=',currAvg)
                        increaseObjectsCallback()
                    }else{
                        console.log('stop. trailCount = '+trailCount)
                        stopFlag = true
                        onDone()
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

    var min = Infinity, max = 0, round = Math.round;
    var PR = round(window.devicePixelRatio || 1);

    var WIDTH = 80 * PR, HEIGHT = 48 * PR,
        TEXT_X = 3 * PR, TEXT_Y = 2 * PR,
        GRAPH_X = 3 * PR, GRAPH_Y = 15 * PR,
        GRAPH_WIDTH = 74 * PR, GRAPH_HEIGHT = 30 * PR;

    var canvas = document.createElement('canvas');
    canvas.width = WIDTH;
    canvas.height = HEIGHT;
    canvas.style.cssText = 'width:80px;height:48px';

    var context = canvas.getContext('2d');
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