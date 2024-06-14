class Room extends Phaser.Scene {
    constructor() {
        super('roomScene')
    }

    init() {
        // Changed this to 8 to make tile coordinates accurate to Tiled.
        this.PLAYERX = 8 * tileSize
        this.PLAYERY = 8 * tileSize

        // For camera movement function
        this.SCREENX = 256;
        this.SCREENY = 240;

        this.turboCooldown = false;
        this.turboTick = 375;
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
        this.player.anims.play('neutral')
        // Fixes weird collision problem with Mr. Wiz
        this.player.setOrigin(0.25)
        // -------------------------------------------------------------------------------- TESTING
        // Test our conversion functions
        this.test_location();
        // Test tile grabber
        this.test_get_tile();

        // ------------------------------------------------------------------------- EVENT HANDLERS
        //LEFT.on("down", (key, event) => {
        if (Phaser.Input.Keyboard.JustDown(LEFT)) {
            this.move(LEFT, this.brickLayer, false)
            this.player.anims.play('right');
            this.player.flipX = true;
            console.log(this.player.x % this.SCREENX)
            // If the player is at the border of the screen, move it, and place them at an offset
            if (this.player.x % this.SCREENX <= 8) {
                this.move_cam('LEFT')
                for (let i = 0; i < this.player.transitionOffset; i++)
                    {
                        this.move(LEFT, this.brickLayer, true)
                    }
            }
            // Uncomment to test camera movement
            //this.move_cam('LEFT')
        }
        if (Phaser.Input.Keyboard.JustDown(RIGHT)) {
            this.move(RIGHT, this.brickLayer, false)
            this.player.anims.play('right');
            this.player.flipX = false;
            console.log(this.player.x % this.SCREENX)
            // If the player is at the border of the screen, move it, and place them at an offset
            if (this.player.x % this.SCREENX == 0 || (this.SCREENX - (this.player.x % this.SCREENX)) <= tileSize){
                this.move_cam('RIGHT')
                for (let i = 0; i < this.player.transitionOffset; i++)
                    {
                        this.move(RIGHT, this.brickLayer, true)
                    }
            }
            // Uncomment to test camera movement
            //this.move_cam('RIGHT')
        }
        if (Phaser.Input.Keyboard.JustDown(UP)) {
            this.move(UP, this.brickLayer, false)
            this.player.anims.play('up');
            // If the player is at the border of the screen, move it, and place them at an offset
            if (this.player.y % this.SCREENY <= tileSize) {
                this.move_cam('UP')
                for (let i = 0; i < this.player.transitionOffset; i++)
                    {
                        this.move(UP, this.brickLayer, true)
                    }
            }
            // Uncomment to test camera movement
            //this.move_cam('UP')
        }
        if (Phaser.Input.Keyboard.JustDown(DOWN)) {
            this.move(DOWN, this.brickLayer, false)
            this.player.anims.play('neutral');
            // If the player is at the border of the screen, move it, and place them at an offset
            if (this.player.y % this.SCREENY == 0 || (this.SCREENY - (this.player.y % this.SCREENY)) <= tileSize) {
                this.move_cam('DOWN')
                for (let i = 0; i < this.player.transitionOffset; i++)
                    {
                        this.move(DOWN, this.brickLayer, true)
                    }
            }
            // Uncomment to test camera movement
            //this.move_cam('DOWN')
        }
    }

    update() {
        // This tests the NES controller implementation
        this.test_keys()
        this.test_levels()
        if(RIGHT.isDown)
        {
            if (!this.turboCooldown) 
            {
                this.time.delayedCall(this.turboTick, () => 
                {
                    if (RIGHT.isDown) 
                    {
                        this.turboCoolDown = true;
                        this.move(RIGHT, this.brickLayer, false)
                        this.player.anims.play('right');
                        this.player.flipX = false;
                        console.log(this.player.x % this.SCREENX)
                        // If the player is at the border of the screen, move it, and place them at an offset
                        if (this.player.x % this.SCREENX == 0 || (this.SCREENX - (this.player.x % this.SCREENX)) <= tileSize) 
                        {
                            this.move_cam('RIGHT')
                            for (let i = 0; i < this.player.transitionOffset; i++) 
                            {
                                this.move(RIGHT, this.brickLayer, true)
                            }
                        }
                    }
                
                })
                this.turboCooldown = false; 
            }
        }
        if(LEFT.isDown)
        {
            if (!this.turboCooldown) {
                this.time.delayedCall(this.turboTick, () => {
                    if (LEFT.isDown) {
                        this.turboCoolDown = true;
                        this.move(LEFT, this.brickLayer, false)
                        this.player.anims.play('right');
                        this.player.flipX = true;
                        console.log(this.player.x % this.SCREENX)
                        // If the player is at the border of the screen, move it, and place them at an offset
                        if (this.player.x % this.SCREENX <= tileSize) {
                            this.move_cam('LEFT')
                            for (let i = 0; i < this.player.transitionOffset; i++) {
                                this.move(LEFT, this.brickLayer, true)
                            }
                        }
                    }
                })
            }
            this.turboCooldown = false;
        }
        if (UP.isDown) {
            if (!this.turboCooldown) {

                this.time.delayedCall(this.turboTick, () => {
                    if (UP.isDown) {
                        this.turboCoolDown = true;
                        this.move(UP, this.brickLayer, false)
                        this.player.anims.play('up');
                        console.log(this.player.y % this.SCREENY)
                        // If the player is at the border of the screen, move it, and place them at an offset
                        if (this.player.y % this.SCREENY <= tileSize) {
                            this.move_cam('UP')
                            for (let i = 0; i < this.player.transitionOffset; i++) {
                                this.move(UP, this.brickLayer, true)
                            }
                        }
                    }
                })
                this.turboCooldown = false;
            }
        }
        
        if(DOWN.isDown){
            if (!this.turboCooldown) 
                {
                
                this.time.delayedCall(this.turboTick, () => {
                    if (DOWN.isDown) {
                        this.turboCoolDown = true;
                        this.move(DOWN, this.brickLayer, false)
                        this.player.anims.play('neutral');
                        console.log(this.player.y % this.SCREENY)                            // If the player is at the border of the screen, move it, and place them at an offset
                            if (this.player.y % this.SCREENY == 0 || (this.SCREENY - (this.player.y % this.SCREENY)) <= tileSize) {
                                this.move_cam('DOWN')
                                for (let i = 0; i < this.player.transitionOffset; i++) {
                                    this.move(DOWN, this.brickLayer, true)
                                }
                            }
                        }
                })
            }
            this.turboCooldown = false;
        }
    }
        //this.test_scan(this.brickLayer)
        //this.process_movement()
        //console.log(this.get_tile_coords(this.player.x, this.player.y, this.backgroundLayer))
        // when player exits, update FLOOR variable
    


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
    // This function tells whether the tile in the direction inputted is available to be moved to
    test_scan(layer) {
        if (LEFT.isDown) {
            let tileLoc = this.world_to_tile(this.player.x, this.player.y, layer);
            let destinationTile = this.get_tile(tileLoc.x - 1, tileLoc.y, layer)
            if (destinationTile != null && !destinationTile.properties.collides) {
                console.log("The tile to the left is a walkable tile, the tile is: ", destinationTile)
            }
            else {
                console.log("The tile to the left is not walkable, the tile is: ", destinationTile)
            }
        }
        if (RIGHT.isDown) {
            let tileLoc = this.world_to_tile(this.player.x, this.player.y, layer);
            let destinationTile = this.get_tile(tileLoc.x + 1, tileLoc.y, layer)
            if (destinationTile != null && !destinationTile.properties.collides) {
                console.log("The tile to the right is a walkable tile, the tile is: ", destinationTile)
            }
            else {
                console.log("The tile to the right is not walkable, the tile is: ", destinationTile)
            }
        }
        if (UP.isDown) {
            let tileLoc = this.world_to_tile(this.player.x, this.player.y, layer);
            let destinationTile = this.get_tile(tileLoc.x, tileLoc.y - 1, layer)
            if (destinationTile != null && !destinationTile.properties.collides) {
                console.log("The tile upward is a walkable tile, the tile is: ", destinationTile)
            }
            else {
                console.log("The tile upward is not walkable, the tile is: ", destinationTile)
            }
        }
        if (DOWN.isDown) {
            let tileLoc = this.world_to_tile(this.player.x, this.player.y, layer);
            let destinationTile = this.get_tile(tileLoc.x - 1, tileLoc.y + 1, layer)
            if (destinationTile != null && !destinationTile.properties.collides) {
                console.log("The tile downward is a walkable tile, the tile is: ", destinationTile)
            }
            else {
                console.log("The tile downward is not walkable, the tile is: ", destinationTile)
            }
        }
    }
    // This function tests the functions we will use to traverse 
    // the tilemap as an Arcade sprite having to convert between 
    // world and tile coordinates.
    test_location() {
        let tileLoc = this.world_to_tile(this.player.x, this.player.y, this.backgroundLayer);
        let worldLoc = this.tile_to_world(tileLoc.x, tileLoc.y, this.backgroundLayer);
        console.log("Wiz Tile Location: ", tileLoc)
        console.log("Wiz World Location: ", worldLoc)
        console.log("Wiz Default Location: ", this.player.x, this.player.y)
    }
    // This function is meant to test level/depth before full implimentation
    test_levels() {
        if (cursors.shift.isDown && Phaser.Input.Keyboard.JustDown(cursors.down)) {
            RICHES += 1
            console.log(RICHES)
            this.events.emit('addRiches')
        }
    }
    // Testing the tile grabbing function
    test_get_tile() {
        let tileX = this.world_to_tile(this.player.x, this.player.y, this.backgroundLayer).x
        let tileY = this.world_to_tile(this.player.x, this.player.y, this.backgroundLayer).y
        console.log("The player is standing on the tile: ", this.get_tile(tileX, tileY, this.backgroundLayer))
    }

    // --------------------------------------------------- FUNCTIONS TO SIMPLIFY GRID MOVEMENT CODE
    // This function takes world coordinates in as an argument, 
    // with a tilemap layer, and returns a Vector2 of the tile coords
    world_to_tile(worldX, worldY, layer) {
        // Make empty Vector2
        let retval = new Phaser.Math.Vector2(-1, -1);

        // Assign the proper components to the vector
        retval.x = layer.worldToTileX(worldX)
        retval.y = layer.worldToTileY(worldY)

        return retval;
    }
    // This function takes tile coordinates in as an argument, with a 
    // tilemap layer, and returns a Vector2 of the world coords
    tile_to_world(tileX, tileY, layer) {
        // Make empty Vector2
        let retval = new Phaser.Math.Vector2(-1, -1);

        // Assign the proper components to the vector
        retval.x = layer.tileToWorldX(tileX)
        retval.y = layer.tileToWorldY(tileY)

        return retval;
    }
    // Returns a Tile data type at the given coordinates (in tile-based coordinate system)
    get_tile(tileX, tileY, layer) {
        // Instead of returning a null tile, empty tiles return tiles of index -1
        let retval = this.map.getTileAt(tileX, tileY, true, layer)
        if (retval === null) console.log("ERROR in get_tile(): Returning null tile.", badColor)
        return retval;
    }
    // ------------------------------------------------------------------------ GRID MOVEMENT CODE
    // This function takes in the input from the handlers in create and moves the player
    // isChangingRooms is used to make sure that the offset when entering a room isn't affected
        // by sprinting
    move(input, layer, isChangingRooms) {
        let tileLoc = this.world_to_tile(this.player.x, this.player.y, layer);
        switch (input) {
            case LEFT:
                // See if tile exists and doesn't collide
                var destTile = this.get_tile(tileLoc.x - 1 * this.player.movementSpeed, tileLoc.y, layer)
                if(isChangingRooms) destTile = this.get_tile(tileLoc.x - 1 , tileLoc.y, layer)
                if (!destTile.properties.collides) {
                    let worldDest = this.tile_to_world(destTile.x, destTile.y, layer)
                    this.player.x = worldDest.x;
                    this.player.y = worldDest.y;
                }
                break;
            case RIGHT:
                var destTile = this.get_tile(tileLoc.x + 1 * this.player.movementSpeed, tileLoc.y, layer)
                if(isChangingRooms) destTile = this.get_tile(tileLoc.x + 1 , tileLoc.y, layer)
                if (!destTile.properties.collides) {
                    let worldDest = this.tile_to_world(destTile.x, destTile.y, layer)
                    this.player.x = worldDest.x;
                    this.player.y = worldDest.y;
                }
                break;
            case UP:
                var destTile = this.get_tile(tileLoc.x, tileLoc.y - 1 * this.player.movementSpeed, layer)
                if(isChangingRooms) destTile = this.get_tile(tileLoc.x, tileLoc.y - 1, layer)
                if (!destTile.properties.collides) {
                    let worldDest = this.tile_to_world(destTile.x, destTile.y, layer)
                    this.player.x = worldDest.x;
                    this.player.y = worldDest.y;
                }
                break;
            case DOWN:
                var destTile = this.get_tile(tileLoc.x, tileLoc.y + 1 * this.player.movementSpeed, layer)
                if(isChangingRooms) destTile = this.get_tile(tileLoc.x, tileLoc.y + 1, layer)
                if (!destTile.properties.collides) {
                    let worldDest = this.tile_to_world(destTile.x, destTile.y, layer)
                    this.player.x = worldDest.x;
                    this.player.y = worldDest.y;
                }
                break;
            default:
                break;
        }
    }
    // ---------------------------------------------------------------------- CAMERA MOVEMENT CODE
    // Moves camera based on direction given as a parameter, (LEFT,RIGHT,UP,DOWN)
    move_cam(direction) {
        // Using these variables declutters the switch statement
        let deltaX = 0;
        let deltaY = 0;
        switch (direction) {
            case 'LEFT':
                deltaX = -this.SCREENX;
                break;
            case 'RIGHT':
                deltaX = this.SCREENX;
                break;
            case 'UP':
                deltaY = -this.SCREENY;
                break;
            case 'DOWN':
                deltaY = this.SCREENY;
                break;
            default:
                break;
        }
        // Move camera based on argument
        this.cameras.main.scrollX += deltaX;
        this.cameras.main.scrollY += deltaY;
    }
}