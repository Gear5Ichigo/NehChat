import { Application,Assets,Sprite } from 'pixi.js';





const texture = await Assets.load('Images/Script.png');

const script = new Sprite(texture);





// Asynchronous IIFE
(async () =>
{
    // Create a PixiJS application.
    const app = new Application();

    // Intialize the application.
    await app.init({ background: '#ff0000', resizeTo: window });
    app.stage.addChild(script);
    script.anchor.set(0.5)

    script.x = app.screen.width / 2
    script.y = app.screen.height / 2
    // Then adding the application's canvas to the DOM body.
    document.body.appendChild(app.canvas);
})();