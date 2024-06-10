class Load extends Phaser.Scene {
    constructor() {
        super('loadScene')
    }

    preload() {
        // loading bar

        // ------------------------------------------------------------------------- LOADING ASSETS
        // load tiles
        this.load.image('test-SheetPNG', './assets/sprites/png/test-Sheet.png')
        this.load.image('brick-SheetPNG', './assets/sprites/png/aqua_jade_brick.png')
        this.load.tilemapTiledJSON('test', './assets/tiled/test.tmj')
        // load spritesheet for wiz
        this.load.spritesheet('wiz', './assets/spritesheets/wiz-Sheet.png', { frameWidth: bigTileSize, frameHeight: bigTileSize })
    }

    create() {
        // running checks
        console.log('%cLOAD SCENE :^)', testColor)
        window.localStorage ? console.log('%cLocal storage supported by this cat! (^･･^=)~', goodColor) : console.log('%cLocal storage not supported by this cat ~(=^･･^)', badColor)

        // create player character animation
        // neutral position is to face down, frame 0.
        this.anims.create({
            key: 'neutral',
            frames: this.anims.generateFrameNames('wiz', { start: 0, end: 0 }),
            frameRate: 1,
            repeat: -1
        })

        // move through
        this.scene.start('titleScene')
    }
}