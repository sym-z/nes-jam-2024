class Reload extends Phaser.Scene {
    constructor() {
        super('reloadScene')
    }

    create() {
        // running checks
        console.log('%cRELOAD SCENE :^)', testColor)

        this.priceText = this.add.bitmapText(tileSize, tileSize, 'digi', 'PLEASE RELOAD', 8)
    }
}