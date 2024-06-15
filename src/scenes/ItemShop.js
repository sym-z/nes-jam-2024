class ItemShop extends Phaser.Scene {
    constructor() {
        super('itemShopScene')
    }

    init() {
        // screen x and y for camera movement
        this.SCREENX = 256
        this.SCREENY = 240
        // initial player coords
        this.PLAYERX = this.SCREENX / 2 
        this.PLAYERY = this.SCREENY / 2
        this.PLAYERDIRECT = 'down'
    }

    preload() {
        // load tile animation plugin
        this.load.scenePlugin('AnimatedTiles', './lib/AnimatedTiles.js', 'animatedTiles', 'animatedTiles');
    }

    create() {
        // running checks
        console.log('%cITEM SHOP SCENE :^)', testColor)
        // ----------------------------------------------------------------------------- TILE SETUP
        this.cameras.main.setBackgroundColor('#FF0000') // background will display red in case of error
        // create map
        this.map = this.make.tilemap({ key: 'shop' })
        // tileset variables + array
        this.tilesetArr = []
        this.brickTileset = this.map.addTilesetImage('aqua_brick', 'aqua_brickPNG')
        this.tilesetArr.push(this.brickTileset)
        this.etherTileset = this.map.addTilesetImage('ether', 'etherPNG')
        this.tilesetArr.push(this.etherTileset)
        this.spaceTileset = this.map.addTilesetImage('space', 'spacePNG')
        this.tilesetArr.push(this.spaceTileset)
        this.waterTileset = this.map.addTilesetImage('water', 'waterPNG')
        this.tilesetArr.push(this.waterTileset)
        // background layer
        this.backgroundLayer = this.map.createLayer('Background', this.tilesetArr, 0, 0)
        this.backgroundLayer.setCollisionByProperty({ collides: true })
        // wall layer
        this.wallsLayer = this.map.createLayer('Walls', this.tilesetArr, 0, 0)
        this.wallsLayer.setCollisionByProperty({ collides: true })
        // foreground layer
        this.foregroundLayer = this.map.createLayer('Foreground', this.tilesetArr, 0, 0)
        this.foregroundLayer.setCollisionByProperty({ collides: true })

        this.animatedTiles.init(this.map)
        // ------------------------------------------------------------------------- STARTING SETUP
        this.player = new Player(this, this.PLAYERX, this.PLAYERY).setOrigin(0)
        this.player.anims.play('down')
    }

    update() {
        // dev tools
        this.devShop()
        this.consoleShop()
        // player movement
        this.movement()
    }

    // --------------------------------------------------- FUNCTIONS TO SIMPLIFY GRID MOVEMENT CODE
    // This function takes world coordinates in as an argument, 
    // with a tilemap layer, and returns a Vector2 of the tile coords
    world_to_tile(worldX, worldY, layer) {
        // Make empty Vector2
        let retval = new Phaser.Math.Vector2(-1, -1)
        // Assign the proper components to the vector
        retval.x = layer.worldToTileX(worldX)
        retval.y = layer.worldToTileY(worldY)
        return retval
    }
    // This function takes tile coordinates in as an argument, with a 
    // tilemap layer, and returns a Vector2 of the world coords
    tile_to_world(tileX, tileY, layer) {
        // Make empty Vector2
        let retval = new Phaser.Math.Vector2(-1, -1)
        // Assign the proper components to the vector
        retval.x = layer.tileToWorldX(tileX)
        retval.y = layer.tileToWorldY(tileY)
        return retval
    }
    // Returns a Tile data type at the given coordinates (in tile-based coordinate system)
    get_tile(tileX, tileY, layer) {
        // Instead of returning a null tile, empty tiles return tiles of index -1
        let retval = this.map.getTileAt(tileX, tileY, true, layer)
        if (retval === null) console.log("ERROR in get_tile(): Returning null tile.", badColor)
        return retval
    }

    // ------------------------------------------------------------------------ GRID MOVEMENT CODE
    movement() {
        if (Phaser.Input.Keyboard.JustDown(LEFT)) {
            this.move(LEFT, this.wallsLayer, false)
            if (this.PLAYERDIRECT != 'left') {
                this.PLAYERDIRECT = 'left'
                this.player.anims.play(this.PLAYERDIRECT)
            }
            this.tileLoc = this.world_to_tile(this.player.x,this.player.y, this.backgroundLayer)
            this.tile = this.get_tile(this.tileLoc.x,this.tileLoc.y,this.backgroundLayer);
            if (this.tile.properties.to_castle) {
                this.scene.start("roomScene")
            }
        }
        if (Phaser.Input.Keyboard.JustDown(RIGHT)) {
            this.move(RIGHT, this.wallsLayer, false)
            if (this.PLAYERDIRECT != 'right') {
                this.PLAYERDIRECT = 'right'
                this.player.anims.play(this.PLAYERDIRECT)
            }
            this.tileLoc = this.world_to_tile(this.player.x,this.player.y, this.backgroundLayer)
            this.tile = this.get_tile(this.tileLoc.x,this.tileLoc.y,this.backgroundLayer);
            if (this.tile.properties.to_castle) {
                this.scene.start("roomScene")
            } 
        }
        if (Phaser.Input.Keyboard.JustDown(UP)) {
            this.move(UP, this.wallsLayer, false)
            if (this.PLAYERDIRECT != 'up') {
                this.PLAYERDIRECT = 'up'
                this.player.anims.play(this.PLAYERDIRECT)
            }
            this.tileLoc = this.world_to_tile(this.player.x,this.player.y, this.backgroundLayer)
            this.tile = this.get_tile(this.tileLoc.x,this.tileLoc.y,this.backgroundLayer);
            if (this.tile.properties.to_castle) {
                    this.scene.start("roomScene")
                }
        }
        if (Phaser.Input.Keyboard.JustDown(DOWN)) {
            this.move(DOWN, this.wallsLayer, false)
            if (this.PLAYERDIRECT != 'down') {
                this.PLAYERDIRECT = 'down'
                this.player.anims.play(this.PLAYERDIRECT)
            }
            this.tileLoc = this.world_to_tile(this.player.x,this.player.y, this.backgroundLayer)
            this.tile = this.get_tile(this.tileLoc.x,this.tileLoc.y,this.backgroundLayer);
            if (this.tile.properties.to_castle) {
                this.scene.start("roomScene")
            }
        }
        
    }
    // This function takes in the input from the handlers in create and moves the player
    // isChangingRooms is used to make sure that the offset when entering a room isn't affected
    // by sprinting
    move(input, layer, isChangingRooms) {
        let tileLoc = this.world_to_tile(this.player.x, this.player.y, layer)
        // See if tile exists and doesn't collide
        switch (input) {
            case LEFT:
                var destTile = this.get_tile(tileLoc.x - 1 * this.player.movementSpeed, tileLoc.y, layer)
                if (isChangingRooms) destTile = this.get_tile(tileLoc.x - 1, tileLoc.y, layer)
                if (!destTile.properties.collides) {
                    let worldDest = this.tile_to_world(destTile.x, destTile.y, layer)
                    this.player.x = worldDest.x
                    this.player.y = worldDest.y
                }
                break
            case RIGHT:
                var destTile = this.get_tile(tileLoc.x + 1 * this.player.movementSpeed, tileLoc.y, layer)
                if (isChangingRooms) destTile = this.get_tile(tileLoc.x + 1, tileLoc.y, layer)
                if (!destTile.properties.collides) {
                    let worldDest = this.tile_to_world(destTile.x, destTile.y, layer)
                    this.player.x = worldDest.x
                    this.player.y = worldDest.y
                }
                break
            case UP:
                var destTile = this.get_tile(tileLoc.x, tileLoc.y - 1 * this.player.movementSpeed, layer)
                if (isChangingRooms) destTile = this.get_tile(tileLoc.x, tileLoc.y - 1, layer)
                if (!destTile.properties.collides) {
                    let worldDest = this.tile_to_world(destTile.x, destTile.y, layer)
                    this.player.x = worldDest.x
                    this.player.y = worldDest.y
                }
                break
            case DOWN:
                var destTile = this.get_tile(tileLoc.x, tileLoc.y + 1 * this.player.movementSpeed, layer)
                if (isChangingRooms) destTile = this.get_tile(tileLoc.x, tileLoc.y + 1, layer)
                if (!destTile.properties.collides) {
                    let worldDest = this.tile_to_world(destTile.x, destTile.y, layer)
                    this.player.x = worldDest.x
                    this.player.y = worldDest.y
                }
                break
            default:
                break
        }
    }

    // ---------------------------------------------------------------------- CAMERA MOVEMENT CODE
    // Moves camera based on direction given as a parameter, (LEFT,RIGHT,UP,DOWN)
    move_cam(direction) {
        // Using these variables declutters the switch statement
        let deltaX = 0
        let deltaY = 0
        switch (direction) {
            case 'LEFT':
                deltaX = -this.SCREENX
                break
            case 'RIGHT':
                deltaX = this.SCREENX
                break
            case 'UP':
                deltaY = -this.SCREENY
                break
            case 'DOWN':
                deltaY = this.SCREENY
                break
            default:
                break
        }
        // Move camera based on argument
        this.cameras.main.scrollX += deltaX
        this.cameras.main.scrollY += deltaY
    }

    // ---------------------------------------------------------------------------------- DEV TOOLS
    devShop() {
        if (cursors.shift.isDown && Phaser.Input.Keyboard.JustDown(cursors.up)) {
            RICHES += 1
            this.events.emit('addRiches')
        }
        if (cursors.shift.isDown && Phaser.Input.Keyboard.JustDown(cursors.down)) {
            RICHES -= 1
            this.events.emit('addRiches')
        }
    }
    consoleShop() {
        if (Phaser.Input.Keyboard.JustDown(ONE)) {
            console.log('one')
        }
    }
}

