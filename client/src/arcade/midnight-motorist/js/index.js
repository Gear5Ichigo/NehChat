import {Application, Assets, Sprite} from 'pixi.js'
import {Sound, sound} from '@pixi/sound'

import smashingwindshieldsURL from '../assets/Smashing Windshields.wav';
import guypng from '../assets/guy.png';

import Controlls from './controlls';

(async () => {

    const game_div = document.querySelector("#root > #game")
    const app = new Application()
    const controlls = new Controlls();
    console.log(controlls.keys)
    app.maxFPS = 60;

    sound.add('Smashing Windshields', {
        url: smashingwindshieldsURL,
        preload: true,
        loop: true,
        volume: 0.2
    })

    await app.init({
        background: "#2e003b",
        width: game_div.clientWidth
    })

    game_div.appendChild(app.canvas)

    window.addEventListener('keyup', controlls.keyUp);
    window.addEventListener('keydown', controlls.keyDown);

    sound.play('Smashing Windshields')

    const player_texture = await Assets.load(guypng);
    const player = Sprite.from(player_texture)
    player.scale.set(2.5, 2.5)
    const speed = 4;

    player.anchor.set(0.5)
    player.x = app.screen.width/2
    player.y = app.screen.height/2

    app.stage.addChild(player);

    app.ticker.add(time => {
        if (controlls.keys[68]) {
            player.x += speed
        }
        if (controlls.keys[65]) {
            player.x -= speed/2
        }
        if (controlls.keys[87]) {
            player.y -= speed/2
        }
        if (controlls.keys[83]) {
            player.y += speed/2
        }
    })

})();
