class Room extends Phaser.Scene {
    constructor() {
        super('roomScene')
    }

    init() {
        // Changed this to 8 to make tile coordinates accurate to Tiled.
        this.PLAYERX = 8 * tileSize
        this.PLAYERY = 8 * tileSize
    }

    create() {
        // running checks
        console.log('%cROOM SCENE :^)', "color: #cfd1af")

        // ----------------------------------------------------------------------------- KEY SETUP
        this.keyScene = this.scene.get('keysScene')

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

        // This tests the NES controller implementation
        this.test_keys();

        console.log(this.get_tile_coords(this.player.x, this.player.y, this.backgroundLayer))
    }
    // Function to show control output.    
    test_keys() {
        if (this.keyScene.LEFT.isDown) console.log("LEFT")
        if (this.keyScene.RIGHT.isDown) console.log("RIGHT")
        if (this.keyScene.UP.isDown) console.log("UP")
        if (this.keyScene.DOWN.isDown) console.log("DOWN")
        if (this.keyScene.B.isDown) console.log("B")
        if (this.keyScene.A.isDown) console.log("A")
        if (this.keyScene.SELECT.isDown) console.log("SELECT")
        if (this.keyScene.START.isDown) console.log("START")
    }
    
    // This function takes world coordinates in as an argument, with a tilemap layer, and returns a Vector2 of the tile coords
    get_tile_coords(worldX,worldY,layer)
    {
        // Make empty Vector2
        let retval = new Phaser.Math.Vector2(-1,-1);

        // Assign the proper components to the vector
        retval.x = layer.worldToTileX(worldX)
        retval.y = layer.worldToTileY(worldY)

        return retval;
    }
}