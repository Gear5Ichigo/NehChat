export default class Controls {

    #keyCodes

    constructor() {
        this.#keyCodes = {};
        window.addEventListener('keydown', e => this.#keyCodes[e.code] = true)
        window.addEventListener('keyup', e => this.#keyCodes[e.code] = false)
    }

    out() {
        console.log(this.#keyCodes);
    }

    /**
     * @param {String} keyCode 
     * @returns {Boolean}
     */
    getKey(keyCode) {
        return this.#keyCodes[keyCode] || false;
    }
}