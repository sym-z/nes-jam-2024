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
        this.load.image('navPNG', './assets/spritesheets/nav_layer.png')
        this.load.image('spawnPNG', './assets/spritesheets/spawn.png')
        this.load.image('keeperPNG', './assets/spritesheets/keeper-Sheet.png')
        this.load.image('doorsPNG', './assets/spritesheets/lock-Sheet.png')
        // load bitmap font
        this.load.bitmapFont('digi', './assets/fonts/digi.png', './assets/fonts/digi.xml')
        // load tilesheets
        this.load.tilemapTiledJSON('castle', './assets/tiled/castle.tmj')
        this.load.tilemapTiledJSON('shop', './assets/tiled/shop.tmj')
        // load spritesheets
        this.load.spritesheet('wiz', './assets/spritesheets/wiz-Sheet.png', { frameWidth: tileSize, frameHeight: tileSize })
        this.load.spritesheet('temp', './assets/spritesheets/temp-Sheet.png', { frameWidth: tileSize, frameHeight: tileSize })
        // load attack spritesheets
        this.load.spritesheet('attack', './assets/spritesheets/attack-Sheet.png', { frameWidth: tileSize*3, frameHeight: tileSize*3 })
        this.load.spritesheet('crit', './assets/spritesheets/crit-Sheet.png', { frameWidth: tileSize*3, frameHeight: tileSize*3 })
        this.load.spritesheet('magic', './assets/spritesheets/magic-Sheet.png', { frameWidth: (tileSize*3)+2, frameHeight: (tileSize*3)+2 })
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
        this.anims.create({ key: 'upAttack', frames: this.anims.generateFrameNames('attack', { start: 0, end: 7 }), frameRate: 20, repeat: 0 })
        this.anims.create({ key: 'rightAttack', frames: this.anims.generateFrameNames('attack', { start: 8, end: 15 }), frameRate: 20, repeat: 0 })
        this.anims.create({ key: 'downAttack', frames: this.anims.generateFrameNames('attack', { start: 16, end: 23 }), frameRate: 20, repeat: 0 })
        this.anims.create({ key: 'leftAttack', frames: this.anims.generateFrameNames('attack', { start: 24, end: 31 }), frameRate: 20, repeat: 0 })
        this.anims.create({ key: 'rightCrit', frames: this.anims.generateFrameNames('crit', { start: 0, end: 9 }), frameRate: 20, repeat: 0 })
        this.anims.create({ key: 'downCrit', frames: this.anims.generateFrameNames('crit', { start: 10, end: 19 }), frameRate: 20, repeat: 0 })
        this.anims.create({ key: 'leftCrit', frames: this.anims.generateFrameNames('crit', { start: 20, end: 29 }), frameRate: 20, repeat: 0 })
        this.anims.create({ key: 'upCrit', frames: this.anims.generateFrameNames('crit', { start: 30, end: 39 }), frameRate: 20, repeat: 0 })
        this.anims.create({ key: 'rightMagic', frames: this.anims.generateFrameNames('magic', { start: 0, end: 13 }), frameRate: 20, repeat: 0 })
        this.anims.create({ key: 'downMagic', frames: this.anims.generateFrameNames('magic', { start: 14, end: 27 }), frameRate: 20, repeat: 0 })
        this.anims.create({ key: 'leftMagic', frames: this.anims.generateFrameNames('magic', { start: 28, end: 41 }), frameRate: 20, repeat: 0 })
        this.anims.create({ key: 'upMagic', frames: this.anims.generateFrameNames('magic', { start: 42, end: 55 }), frameRate: 20, repeat: 0 })

        // move through
        this.scene.start('titleScene')
    }
}