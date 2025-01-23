import { Container } from "pixi.js";

export default class UiButton extends Container {
    /**
     * @param {{}} options 
     */
    constructor(options) {
        super({
            eventMode: "static",
            pivot: 0.5,
        })

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