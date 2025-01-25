import { Application, Container, Graphics } from 'pixi.js';
import { Button, FancyButton, Input } from '@pixi/ui';
import { io } from 'socket.io-client';
import Controls from '../../$repeatedJS/controls';

(async () => {

    // Initializing stuff
    //==================================

    const socket = io('http://:8000/pizza', {
        transports: ['websocket'],
        withCredentials: true,
    })

    const controls = new Controls();

    const app = new Application();
    await app.init({
        width: innerWidth,
        height: innerHeight,
        backgroundColor: 0xffff55
    })

    app.canvas.style.display = "block";
    document.body.style.margin = 0;
    document.body.appendChild(app.canvas)

    //==

    const MainMenu = new Container();
    const GameScreen = new Container();

    const StartMenu = new Container();
    const LobbyMenu = new Container();

    MainMenu.addChild(StartMenu, LobbyMenu);

    const roomCodeLine = new Input({
        bg: new Graphics()
                .rect(0, 0, 250, 80)
                .fill(0x000000)
                .stroke({fill: 0xffffff, width: 2}),
        placeholder: "Enter Room Code",
        maxLength: 6,
        align: "center",
    });

    const joinRoom = new FancyButton({

    });
    joinRoom.ondo

    StartMenu.add(roomCodeLine, joinRoom);
    app.stage.add(MainMenu, GameScreen)

    //==

    app.ticker.add(ticker => {
        if (controls.getKey("KeyA")) {
            console.log("Left")
        }
    })

})();