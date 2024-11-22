export default class Controlls {
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