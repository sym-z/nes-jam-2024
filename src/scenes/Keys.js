class Keys extends Phaser.Scene {
    constructor() {
        super({ key: 'keysScene', active: true })
    }

    create() {
        // running checks
        console.log('%cKEYS SCENE :^)', "color: #cfd1af")

        // define keys
        this.cursors = this.input.keyboard.createCursorKeys();
    }
}