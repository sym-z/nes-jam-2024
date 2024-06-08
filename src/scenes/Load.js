class Load extends Phaser.Scene {
    constructor() {
        super('loadScene')
    }

    preload() {
        // loading bar
    }

    create() {
        // running checks
        console.log('%cLOAD SCENE :^)', "color: #cfd1af")
        window.localStorage ? console.log('%cLocal storage supported by this cat! (^･･^=)~', "color: #91aa86") : console.log('%cLocal storage not supported by this cat ~(=^･･^)', "color: #c088ae")
        // moving through
        this.scene.start('titleScene')
    }
}