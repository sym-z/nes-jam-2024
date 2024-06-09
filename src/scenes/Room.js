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
        console.log('%cROOM SCENE :^)', testColor)

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
        // -------------------------------------------------------------------------------- TESTING
        // Test our conversion functions
        this.test_location();
    }

    update() {
        // This tests the NES controller implementation
        this.test_keys()
        this.test_levels()

        //console.log(this.get_tile_coords(this.player.x, this.player.y, this.backgroundLayer))
    }

    // --------------------------------------------------------------------------- TESTER FUNCTIONS
    // Function to show control output.    
    test_keys() {
        if (LEFT.isDown) console.log("LEFT")
        if (RIGHT.isDown) console.log("RIGHT")
        if (UP.isDown) console.log("UP")
        if (DOWN.isDown) console.log("DOWN")
        if (B.isDown) console.log("B")
        if (A.isDown) console.log("A")
        if (SELECT.isDown) console.log("SELECT")
        if (START.isDown) console.log("START")
    }
    // This function tests the functions we will use to traverse 
        // the tilemap as an Arcade sprite having to convert between 
        // world and tile coordinates.
    test_location() {
        let tileLoc = this.world_to_tile(this.player.x, this.player.y, this.backgroundLayer);
        let worldLoc = this.tile_to_world(tileLoc.x, tileLoc.y, this.backgroundLayer);
        console.log("Wiz Tile Location: ", tileLoc)
        console.log("Wiz World Location: ", worldLoc)
        console.log("Wiz Default Location: ", this.player.x,this.player.y)
    }
    // This function is meant to test level/depth before full implimentation
    test_levels() {
        if (Phaser.Input.Keyboard.JustDown(cursors.down)) {
            RICHES += 1
            console.log(RICHES)
            this.events.emit('addRiches')
        }
    }
    
    // --------------------------------------------------- FUNCTIONS TO SIMPLIFY GRID MOVEMENT CODE
    // This function takes world coordinates in as an argument, 
        // with a tilemap layer, and returns a Vector2 of the tile coords
    world_to_tile(worldX,worldY,layer) {
        // Make empty Vector2
        let retval = new Phaser.Math.Vector2(-1,-1);

        // Assign the proper components to the vector
        retval.x = layer.worldToTileX(worldX)
        retval.y = layer.worldToTileY(worldY)

        return retval;
    }
    // This function takes tile coordinates in as an argument, with a 
        // tilemap layer, and returns a Vector2 of the world coords
    tile_to_world(tileX,tileY,layer) {
        // Make empty Vector2
        let retval = new Phaser.Math.Vector2(-1,-1);

        // Assign the proper components to the vector
        retval.x = layer.tileToWorldX(tileX)
        retval.y = layer.tileToWorldY(tileY)

        return retval;
    }
}