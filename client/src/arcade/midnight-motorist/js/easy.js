import { Container, Graphics, Text } from "pixi.js";

class Controlls {
    constructor() {
        this.keys = [];

        this.keyDown = (e) => {
            console.log(e.keyCode)
            this.keys[e.keyCode] = true;
        }

        this.keyUp = (e) => {
            this.keys[e.keyCode] = false;
        }
    }
}

class MenuButton extends Container {
    constructor({text}) {
        super({
            eventMode: "static",
            pivot: (125, 40),
        });

        this.rect = new Graphics();
        this.rect.rect(0, 0, 250, 80);
        this.rect.fill(0x000000);
        this.rect.stroke({width:2, fill: 0xffffff});

        this.text = new Text({
            text: text,
            zIndex: 10,
            anchor: 0.5,
            x: this.rect.width/2, y: this.rect.height/2,
            style: {
                fill: 0xffffff
            }
        });

        this.addChild(this.text, this.rect)
    }
}

export { MenuButton, Controlls }