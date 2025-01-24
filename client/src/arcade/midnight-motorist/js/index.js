import { io } from 'socket.io-client'
import {Application, Assets, Container, Graphics, Sprite, Text} from 'pixi.js'
import {Sound, sound} from '@pixi/sound'

import smashingwindshieldsURL from '../assets/Smashing Windshields.wav';
import guypng from '../assets/guy3x.png';

import { Controlls, MenuButton } from './easy';

const socket = io('http://:8000', {
    autoConnect: false,
    withCredentials: true
});

socket.on("connect_error", (err) => {
    console.log(err)
});

(async () => {

    const game_div = document.body
    const app = new Application()
    const controlls = new Controlls();

    sound.add('Smashing Windshields', {
        url: smashingwindshieldsURL,
        preload: true,
        loop: true,
        volume: 0.1
    })

    await app.init({
        background: "#2e003b",
        width: game_div.clientWidth,
    })

    app.ticker.maxFPS = 60;

    game_div.appendChild(app.canvas)

    window.addEventListener('keyup', controlls.keyUp);
    window.addEventListener('keydown', controlls.keyDown);

    sound.play('Smashing Windshields')

    const play_solo = new MenuButton({text: "Play Solo"});
    play_solo.x = app.screen.width/2;
    play_solo.y = app.screen.height/2-100;
    play_solo.on('pointerdown', (e) => {
        console.log("PLAY")
    });

    const play_multi = new MenuButton({text: "Play Multiplayer"});
    play_multi.x = app.screen.width/2;
    play_multi.y = app.screen.height/2;
    play_multi.on('pointerdown', (e) => {
        socket.connect();
        socket.emit('midnight motorist');
    });

    const back_to = new MenuButton({text: "Exit"});
    back_to.x = app.screen.width/2;
    back_to.y = app.screen.height/2 + 100;
    back_to.on('pointerdown', (e) => {
        window.location.href = "/allchat";
    });

    const player_texture = await Assets.load(guypng);
    const player = Sprite.from(player_texture)
    player.scale.set(2, 2)
    const speed = 12;

    player.anchor.set(0.5)
    player.x = app.screen.width/2
    player.y = app.screen.height/2

    app.stage.addChild(player);
    app.stage.addChild(play_solo);
    app.stage.addChild(play_multi);
    app.stage.addChild(back_to);

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
