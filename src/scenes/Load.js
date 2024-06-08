class Load extends Phaser.Scene {
    constructor() {
        super('loadScene')
    }

    preload() {
        // loading bar
        // load tiles
        this.load.image('test-SheetPNG', './assets/sprites/png/test-Sheet.png')
        this.load.image('brick-SheetPNG', './assets/sprites/png/aqua_jade_brick.png')
        this.load.tilemapTiledJSON('test', './assets/tiled/test.tmj')
    }

    create() {
        // running checks
        console.log('%cLOAD SCENE :^)', "color: #cfd1af")
        window.localStorage ? console.log('%cLocal storage supported by this cat! (^･･^=)~', "color: #91aa86") : console.log('%cLocal storage not supported by this cat ~(=^･･^)', "color: #c088ae")
        // move through
        this.scene.start('titleScene')
    }
}