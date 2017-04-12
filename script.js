"use strict";


{

    let app;

    const content = {
        containers: [],
        numRect: 0,
        numLine: 0,
        numText: 0,
        text: new PIXI.Text('', {fill: 0xFFFFFF, stroke: 0xFF0000}),

        updateText() {
            this.text.text =
                `Total: ${this.containers.length} | Rect: ${this.numRect} | Line: ${this.numLine}| Text: ${this.numText}`
            this.text.position = {
                x: app.renderer.width - this.text.width,
                y: 0
            };
        },

        addRect(g) {
            app.stage.addChild(g);
            this.containers.push(g);
            this.numRect++;
        },

        addLine(g) {
            app.stage.addChild(g);
            this.containers.push(g);
            this.numLine++;
        },

        addText(t) {
            app.stage.addChild(t);
            this.containers.push(t);
            this.numText++;
        },

        addOther(c) {
            app.stage.addChild(c);
            this.containers.push(c);
        }
    };

    const fpsDisplay = {
        framedeltas: new Array(5).fill(0),
        lastFrameTime: Date.now(),
        avgFps: 0,
        text: new PIXI.Text('', {fill: 0xFF0000}),
        displayBuffer: 0,

        addFrame() {
            const nowTime = Date.now();
            this.framedeltas.shift();
            this.framedeltas.push(nowTime - this.lastFrameTime);
            this.lastFrameTime = nowTime;
            this.avgFps =
                Math.round(
                    this.framedeltas.length /
                    this.framedeltas.reduce((acc, val) => acc + val, 0)
                    * 1000);

            this.displayBuffer = (++this.displayBuffer) % 3;
            if (this.displayBuffer === 0) {
                this.text.text = this.avgFps.toString();
            }
        }
    };


    const setupApp = function () {
        app = new PIXI.Application({
            width: 1100,
            height: 600,
            antialias: true,
            forceCanvas: false
        });

        document.getElementById('pixi').appendChild(app.view);
    };


    const initDrawing = function () {
        fpsDisplay.text.position = {x: 0, y: 0};
        content.addOther(
            new PIXI.Graphics()
                .lineStyle(0)
                .beginFill(0xFFFFFF)
                .drawRect(0, 0, 37, 31)
                .endFill());
        content.addOther(fpsDisplay.text);

        content.addOther(content.text);
    };

    const initEventListeners = function () {
        function addRectangle() {
            const g = new PIXI.Graphics();
            g
                .lineStyle(0)
                .beginFill(randomInt(0x222222, 0xFFFFFF), Math.random() * .7)
                .drawRect(
                    randomInt(30, app.renderer.width - 50),
                    randomInt(30, app.renderer.height - 50),
                    randomInt(10, 50),
                    randomInt(10, 50))
                .endFill();
            content.addRect(g);
        }

        function addLine() {
            const g = new PIXI.Graphics();
            g
                .lineStyle(randomInt(1, 4), randomInt(0x222222, 0xFFFFFF), Math.random() * .7)
                .moveTo(
                    randomInt(30, app.renderer.width - 30),
                    randomInt(30, app.renderer.height - 30))
                .lineTo(
                    randomInt(30, app.renderer.width - 30),
                    randomInt(30, app.renderer.height - 30));
            content.addLine(g);
        }

        function addText() {
            const t = new PIXI.Text(
                randomInt(1000, 100000).toString(),
                {
                    fill: randomInt(0x222222, 0xFFFFFF),
                    fontSize: randomInt(10, 50)
                }
            );
            t.position = {
                x: randomInt(30, app.renderer.width - 30),
                y: randomInt(30, app.renderer.height - 30)
            };
            content.addText(t);
        }

        document.addEventListener('keypress', (e) => {
            let fn = function () {
            };
            switch (e.key) {
                case 'r':
                case 'R':
                    fn = addRectangle;
                    break;
                case 'l':
                case 'L':
                    fn = addLine;
                    break;
                case 't':
                case 'T':
                    fn = addText;
                    break;
            }

            const repeat = e.shiftKey ? 5 : 1;
            for (let i = 0; i < repeat; i++) {
                fn();
            }

        });
    };


    const eventLoop = function () {
        requestAnimationFrame(eventLoop);
        fpsDisplay.addFrame();
        content.updateText();

        app.render();
    };


    setupApp();
    initDrawing();
    initEventListeners();
    eventLoop();

}

function randomInt(min, maxExclusive) {
    return Math.floor(
            Math.random() * (maxExclusive - min))
        + min;
}