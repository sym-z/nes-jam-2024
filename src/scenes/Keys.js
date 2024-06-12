class Keys extends Phaser.Scene {
    constructor() {
        super({ key: 'keysScene', active: true })
    }

    create() {
        // running checks
        console.log('%cKEYS SCENE :^)', testColor)
        window.localStorage ? console.log('%cLocal storage supported by this cat! (^･･^=)~', goodColor + ' ' + logSize) : console.log('%cLocal storage not supported by this cat ~(=^･･^)', badColor + " " + logSize)

        // define keys
        cursors = this.input.keyboard.createCursorKeys()

        // make keys that mimic the NES controller
        LEFT = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.A)
        RIGHT = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.D)
        UP = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.W)
        DOWN = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.S)

        A = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.L)
        B = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.K)

        SELECT = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.T)
        START = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.Y)
    }
}