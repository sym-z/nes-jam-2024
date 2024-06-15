class Load extends Phaser.Scene {
    constructor() {
        super('loadScene')
    }

    preload() {
        // loading bar

        // ------------------------------------------------------------------------- LOADING ASSETS
        // load tiles
        this.load.image('test-SheetPNG', './assets/sprites/png/test-Sheet.png')
        //this.load.image('brick-SheetPNG', './assets/sprites/png/aqua_jade_brick.png')
        this.load.image('aqua_brickPNG', './assets/sprites/png/aqua_jade_brick.png')
        this.load.image('castle_wallsPNG', './assets/spritesheets/castle_walls_8x8.png')
        this.load.image('mossy_stonePNG', './assets/spritesheets/moss_block_8x8.png')
        this.load.image('rugPNG', './assets/spritesheets/rug.png')
        this.load.image('waterPNG', './assets/sprites/png/water.png')


        //this.load.tilemapTiledJSON('test', './assets/tiled/test.tmj')
        this.load.tilemapTiledJSON('castle', './assets/tiled/castle.tmj')
        // load spritesheet for wiz
        this.load.spritesheet('wiz', './assets/spritesheets/wiz-Sheet.png', { frameWidth: tileSize, frameHeight: tileSize })
    }

    create() {
        // running checks
        console.log('%cLOAD SCENE :^)', testColor)
        window.localStorage ? console.log('%cLocal storage supported by this cat! (^･･^=)~', goodColor) : console.log('%cLocal storage not supported by this cat ~(=^･･^)', badColor)

        // create player character animation
        this.anims.create({
            key: 'down',
            frames: this.anims.generateFrameNames('wiz', { start: 0, end: 7 }),
            frameRate: 6,
            repeat: -1
        })
        this.anims.create({
            key: 'left',
            frames: this.anims.generateFrameNames('wiz', { start: 8, end: 15 }),
            frameRate: 6,
            repeat: -1
        })
        this.anims.create({
            key: 'right',
            frames: this.anims.generateFrameNames('wiz', { start: 16, end: 23 }),
            frameRate: 6,
            repeat: -1
        })
        this.anims.create({
            key: 'up',
            frames: this.anims.generateFrameNames('wiz', { start: 24, end: 31 }),
            frameRate: 6,
            repeat: -1
        })

        // move through
        this.scene.start('titleScene')
    }
}