import { Application, Graphics } from 'pixi.js';
import { io } from 'socket.io-client';
import Controls from '../../$repeatedJS/controls';
import UiButton from '../../$repeatedJS/uibutton';

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

    //
    const playbutton = new UiButton({
        text: "Play!"
    })
    //

    app.ticker.add(ticker => {
        if (controls.getKey("KeyA")) {
            console.log("Left")
        }
    })

})();