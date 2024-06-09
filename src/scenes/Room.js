class Room extends Phaser.Scene {
    constructor() {
        super('roomScene')
    }

    init() {
        this.PLAYERX = 4*tileSize
        this.PLAYERY = 4*tileSize
    }

    create() {
        // running checks
        console.log('%cROOM SCENE :^)', "color: #cfd1af")

        // ----------------------------------------------------------------------------- TILE SETUP
        this.cameras.main.setBackgroundColor('#FF0000') // background will display red in case of error
        this.map = this.make.tilemap({ key: 'test' })
        this.testTileset = this.map.addTilesetImage('test-Sheet', 'test-SheetPNG')
        this.brickTileset = this.map.addTilesetImage('aqua_jade_brick', 'brick-SheetPNG')
        // background layer
        this.backgroundLayer = this.map.createLayer('background', this.testTileset, 0, 0)
        this.backgroundLayer.setCollisionByProperty({ collides: true })
        // brick layer
        this.brickLayer = this.map.createLayer('brick', this.brickTileset, 0, 0)
        this.brickLayer.setCollisionByProperty({ collides: true })

        // ------------------------------------------------------------------------- STARTING SETUP
        this.player = new Player(this, this.PLAYERX, this.PLAYERY)
    }

    update() {
        if (cursors.down.isDown) { console.group('godown') }
    }
}