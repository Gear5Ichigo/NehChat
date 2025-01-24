import {Application, Assets} from 'pixi.js';
import io from 'socket.io-client';
import Controlls from './controlls';
import * as GameAssets from './assetsimports'

(async()=>{
    const app = new Application();
    // const socket = io('http://localhost:8000', {});
    const controlls = new Controlls();

    await app.init({resizeTo:window});
    document.body.appendChild(app.canvas);

    const plrchrimg = Assets.load(GameAssets.plr_chr_sheet);
    Assets.add({
        alias:"plr_chr_sheet",
        src: "images/spritesheet.json",
        data: {texture: plrchrimg}
    })
    const plr_chr_sheet = Assets.load("plr_chr_sheet")

    app.stage.addChild(plr_chr_sheet)

    window.addEventListener('keydown', controlls.keyDown);
    window.addEventListener('keyup', controlls.keyUp);

    app.ticker.maxFPS = 60;
    app.ticker.add(time => {

    });
})();