class Title extends Phaser.Scene {
    constructor() {
        super('titleScene')
    }

    create() {
        // running checks
        console.log('%cTITLE SCENE :^)', testColor)
        // moving through
        this.scene.start('roomScene')
    }
}