class Keys extends Phaser.Scene {
    constructor() {
        super({ key: 'keysScene', active: true })
    }

    create() {
        // running checks
        console.log('%cKEYS SCENE :^)', "color: #cfd1af")

        // define keys
        cursors = this.input.keyboard.createCursorKeys()

        // make keys that mimic the NES controller
        this.LEFT = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.A)
        this.RIGHT = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.D)
        this.UP = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.W)
        this.DOWN = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.S)

        this.A = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.L)
        this.B = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.K)

        this.SELECT = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.T)
        this.START = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.Y)

    }
}