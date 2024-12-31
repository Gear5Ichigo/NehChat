export default class Controlls {
    constructor() {
        this.keys = {};

        this.keyDown = (e) => {
            console.log(e.key)
            this.keys[e.key.toLowerCase()] = true;
        }

        this.keyUp = (e) => {
            this.keys[e.key.toLowerCase()] = false;
        }
    }
}