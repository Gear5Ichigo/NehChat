import { Container, Graphics, Text } from "pixi.js";

export default class UiButton extends Container {
    /**
     * 
     */
    constructor(options = {}) {
        super({
            width: options.width || 250,
            height: options.height || 80,
            x: options.x || innerWidth/2,
            y: options.y || innerHeight/2,
            eventMode: "static",
            pivot: 0.5,
        })

        this.rect = new Graphics();
        this.rect.rect(0, 0, this.width, this.height);
        this.rect.fill(0x000000);
        this.rect.stroke({width:2, fill: 0xffffff});

        this.text = new Text({
            text: options.text,
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