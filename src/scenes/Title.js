class Title extends Phaser.Scene {
    constructor() {
        super('titleScene')
    }

    create() {
        // running checks
        console.log('%cTITLE SCENE :^)', "color: #cfd1af")
        // moving through
        this.scene.start('roomScene')
    }
}