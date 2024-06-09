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
        // load sprites
        this.load.spritesheet('player', './assets/sprites/png/player.png', { frameWidth: 16, frameHeight: 16 })
        this.load.image('wiz', './assets/sprites/png/wiz.png')
    }

    create() {
        // running checks
        console.log('%cLOAD SCENE :^)', "color: #cfd1af")
        window.localStorage ? console.log('%cLocal storage supported by this cat! (^･･^=)~', "color: #91aa86") : console.log('%cLocal storage not supported by this cat ~(=^･･^)', "color: #c088ae")

        // create player character animation
        this.anims.create({
            key: 'neutral',
            frames: this.anims.generateFrameNames('player', { start: 0, end: 0 }),
            frameRate: 1,
            repeat: -1
        })

        // move through
        this.scene.start('titleScene')
    }
}