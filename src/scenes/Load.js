class Load extends Phaser.Scene {
    constructor() {
        super('loadScene')
    }

    preload() {
        // loading bar

        // ------------------------------------------------------------------------- LOADING ASSETS
        // load images
        this.load.image('aqua_brickPNG', './assets/sprites/png/aqua_jade_brick.png')
        this.load.image('castle_wallsPNG', './assets/spritesheets/castle_walls_8x8.png')
        this.load.image('mossy_stonePNG', './assets/spritesheets/moss_block_8x8.png')
        this.load.image('rugPNG', './assets/spritesheets/rug.png')
        this.load.image('waterPNG', './assets/sprites/png/water.png')
        this.load.image('etherPNG', './assets/spritesheets/ether-Sheet.png')
        this.load.image('spacePNG', './assets/spritesheets/space-Sheet.png')
        // load tilesheets
        this.load.tilemapTiledJSON('castle', './assets/tiled/castle.tmj')
        this.load.tilemapTiledJSON('shop', './assets/tiled/shop.tmj')
        // load spritesheets
        this.load.spritesheet('wiz', './assets/spritesheets/wiz-Sheet.png', { frameWidth: tileSize, frameHeight: tileSize })
        this.load.spritesheet('temp', './assets/spritesheets/temp-Sheet.png', { frameWidth: tileSize, frameHeight: tileSize })
        // load attack spritesheets
        this.load.spritesheet('attackR', './assets/spritesheets/attackR-Sheet.png', { frameWidth: tileSize*3, frameHeight: tileSize*3 })
        this.load.spritesheet('attackL', './assets/spritesheets/attackL-Sheet.png', { frameWidth: tileSize*3, frameHeight: tileSize*3 })
        this.load.spritesheet('attackU', './assets/spritesheets/attackU-Sheet.png', { frameWidth: tileSize*3, frameHeight: tileSize*3 })
        this.load.spritesheet('attackD', './assets/spritesheets/attackD-Sheet.png', { frameWidth: tileSize*3, frameHeight: tileSize*3 })
        this.load.spritesheet('attackRC', './assets/spritesheets/attackRC-Sheet.png', { frameWidth: tileSize*3, frameHeight: tileSize*3 })
        this.load.spritesheet('attackLC', './assets/spritesheets/attackLC-Sheet.png', { frameWidth: tileSize*3, frameHeight: tileSize*3 })
        this.load.spritesheet('attackUC', './assets/spritesheets/attackUC-Sheet.png', { frameWidth: tileSize*3, frameHeight: tileSize*3 })
        this.load.spritesheet('attackDC', './assets/spritesheets/attackDC-Sheet.png', { frameWidth: tileSize*3, frameHeight: tileSize*3 })
    }

    create() {
        // running checks
        console.log('%cLOAD SCENE :^)', testColor)

        // player character animations
        this.anims.create({ key: 'down', frames: this.anims.generateFrameNames('wiz', { start: 0, end: 7 }), frameRate: 8, repeat: -1 })
        this.anims.create({ key: 'left', frames: this.anims.generateFrameNames('wiz', { start: 8, end: 15 }), frameRate: 8, repeat: -1 })
        this.anims.create({ key: 'right', frames: this.anims.generateFrameNames('wiz', { start: 16, end: 23 }), frameRate: 8, repeat: -1 })
        this.anims.create({ key: 'up', frames: this.anims.generateFrameNames('wiz', { start: 24, end: 31 }), frameRate: 8, repeat: -1 })
        // temp enemy animations
        this.anims.create({ key: 'green', frames: this.anims.generateFrameNames('temp', { start: 0, end: 1 }), frameRate: 3, repeat: -1 })
        this.anims.create({ key: 'purple', frames: this.anims.generateFrameNames('temp', { start: 2, end: 3 }), frameRate: 3, repeat: -1 })
        this.anims.create({ key: 'yellow', frames: this.anims.generateFrameNames('temp', { start: 4, end: 5 }), frameRate: 3, repeat: -1 })
        this.anims.create({ key: 'teal', frames: this.anims.generateFrameNames('temp', { start: 6, end: 7 }), frameRate: 3, repeat: -1 })
        this.anims.create({ key: 'blue', frames: this.anims.generateFrameNames('temp', { start: 8, end: 9 }), frameRate: 3, repeat: -1 })
        this.anims.create({ key: 'pink', frames: this.anims.generateFrameNames('temp', { start: 10, end: 11 }), frameRate: 3, repeat: -1 })
        // attack animations
        this.anims.create({ key: 'attackR', frames: this.anims.generateFrameNames('attackR', { start: 0, end: 7 }), frameRate: 10, repeat: -1 })
        this.anims.create({ key: 'attackL', frames: this.anims.generateFrameNames('attackL', { start: 0, end: 7 }), frameRate: 10, repeat: -1 })
        this.anims.create({ key: 'attackU', frames: this.anims.generateFrameNames('attackU', { start: 0, end: 7 }), frameRate: 10, repeat: -1 })
        this.anims.create({ key: 'attackD', frames: this.anims.generateFrameNames('attackD', { start: 0, end: 7 }), frameRate: 10, repeat: -1 })
        this.anims.create({ key: 'attackRC', frames: this.anims.generateFrameNames('attackRC', { start: 0, end: 9 }), frameRate: 10, repeat: -1 })
        this.anims.create({ key: 'attackLC', frames: this.anims.generateFrameNames('attackLC', { start: 0, end: 9 }), frameRate: 10, repeat: -1 })
        this.anims.create({ key: 'attackUC', frames: this.anims.generateFrameNames('attackUC', { start: 0, end: 9 }), frameRate: 10, repeat: -1 })
        this.anims.create({ key: 'attackDC', frames: this.anims.generateFrameNames('attackDC', { start: 0, end: 9 }), frameRate: 10, repeat: -1 })

        // move through
        this.scene.start('titleScene')
    }
}