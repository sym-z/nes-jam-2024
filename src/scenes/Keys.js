class Keys extends Phaser.Scene {
    constructor() {
        super({ key: 'keysScene', active: true })
    }

    create() {
        // running checks
        console.log('%cKEYS SCENE :^)', testColor)
        window.localStorage ? console.log('%cLocal storage supported by this cat! (^･･^=)~', goodColor + ' ' + logSize) : console.log('%cLocal storage not supported by this cat ~(=^･･^)', badColor + " " + logSize)

        // up down left right
        LEFT = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.A)
        RIGHT = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.D)
        UP = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.W)
        DOWN = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.S)
        // a b
        A = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.L)
        B = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.K)
        // select start
        SELECT = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.T)
        START = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.Y)
        // dev keys
        cursors = this.input.keyboard.createCursorKeys()
        ONE = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.ONE)
        TWO = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.TWO)
        THREE = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.THREE)
        FOUR = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.FOUR)
        FIVE = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.FIVE)
        SIX = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.SIX)
        SEVEN = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.SEVEN)
        EIGHT = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.EIGHT)
        NINE = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.NINE)
        TEN = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.ZERO)
        ELEVEN = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.O)
        TWELVE = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.P)
    }
}