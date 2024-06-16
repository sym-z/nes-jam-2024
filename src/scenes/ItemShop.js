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
        this.SHOPPING = false
        // UI box
        this.UIX = tileSize*0
        this.UIY = tileSize*6
        this.UIW = tileSize*13
        this.UIH = tileSize*14
        this.DETX = tileSize*0
        this.DETY = tileSize*20
        this.DETW = tileSize*13
        this.DETH = tileSize*4
        this.CURSORX = tileSize*1
        this.CURSORY = tileSize*12
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
        this.keeperTileset = this.map.addTilesetImage('keeper', 'keeperPNG')
        this.tilesetArr.push(this.keeperTileset)
        // background layer
        this.backgroundLayer = this.map.createLayer('Background', this.tilesetArr, 0, 0)
        this.backgroundLayer.setCollisionByProperty({ collides: true })
        // wall layer
        this.wallsLayer = this.map.createLayer('Walls', this.tilesetArr, 0, 0)
        this.wallsLayer.setCollisionByProperty({ collides: true })
        // foreground layer
        this.foregroundLayer = this.map.createLayer('Foreground', this.tilesetArr, 0, 0)
        this.foregroundLayer.setCollisionByProperty({ collides: true })
        // animation setup
        this.animatedTiles.init(this.map)

        // -------------------------------------------------------------------------------- SHOP UI
        this.graphics = this.add.graphics()
        this.graphics.lineStyle(1, 0xffffff, 0)
        this.graphics.fillStyle(0x000000, 0)
        this.shopDetails = new Phaser.Geom.Rectangle(this.DETX, this.DETY, this.DETW, this.DETH)
        this.graphics.strokeRectShape(this.shopDetails)
        this.graphics.fillRectShape(this.shopDetails)
        this.shopBackground = new Phaser.Geom.Rectangle(this.UIX, this.UIY, this.UIW, this.UIH)
        this.graphics.strokeRectShape(this.shopBackground)
        this.graphics.fillRectShape(this.shopBackground)
        this.cursorLoc = 0
        this.selectLoc = 0
        this.shopText = this.add.bitmapText(this.UIX+tileSize, this.UIY+tileSize, 'digi',
        'UPGRADES\n\npurchase: A\nexit: B\n\n  max HP\n  max mana\n  atk dmg\n  crit %\n  crit dmg\n  mgc heal\n  mgc dmg'
        , 8).setOrigin(0).setDepth(1000).setAlpha(0)
        this.cursor = this.add.bitmapText(this.CURSORX, this.CURSORY, 'digi', '>', 8).setOrigin(0).setDepth(1000).setAlpha(0)
        this.detailText = this.add.bitmapText(this.DETX+tileSize, this.DETY+tileSize, 'digi', `${UPGRADES[this.selectLoc][1]}<${UPGRADES[this.selectLoc][2]}\ngold:${RICHES}`, 8).setOrigin(0).setDepth(1000).setAlpha(0)
        this.price = (UPGRADES[this.selectLoc][2])/5
        this.priceText = this.add.bitmapText(this.DETX+this.DETW-(tileSize*3), this.DETY+tileSize, 'digi', `${this.price}$`, 8).setOrigin(0).setDepth(1000).setAlpha(0)
        // ------------------------------------------------------------------------- STARTING SETUP
        this.player = new Player(this, this.PLAYERX, this.PLAYERY).setOrigin(0)
        this.player.anims.play('down')
    }

    update() {
        // dev tools
        this.devShop()
        // player movement
        if (this.SHOPPING == false) { this.movement() }
        this.purchase()
    }

    // ---------------------------------------------------------------------------------- ITEM SHOP
    // make purchases
    purchase() {
        this.tileLoc = this.world_to_tile(this.player.x, this.player.y-1, this.wallsLayer)
        this.tile = this.get_tile(this.tileLoc.x, this.tileLoc.y, this.wallsLayer);
        if (this.tile.properties.interactable) {
            if (this.SHOPPING == false && Phaser.Input.Keyboard.JustDown(A)) {
                this.uiAlpha(1)
                this.SHOPPING = true
            }
            if (this.SHOPPING == true && Phaser.Input.Keyboard.JustDown(B)) {
                this.uiAlpha(0)
                this.SHOPPING = false
            }
            if (Phaser.Input.Keyboard.JustDown(UP) && this.cursorLoc > 0 && this.SHOPPING == true) {
                this.cursorLoc--
                this.cursor.setY(this.cursor.y-tileSize)
                this.selection()
            }
            if (Phaser.Input.Keyboard.JustDown(DOWN) && this.cursorLoc < 6 && this.SHOPPING == true) {
                this.cursorLoc++
                this.cursor.setY(this.cursor.y+tileSize)
                this.selection()
            }
            if (this.SHOPPING == true) {
                this.completion()
                this.selection()
            }
        }
    }
    // helper function, set alpha
    uiAlpha(num) {
        this.graphics.clear()
        this.graphics.lineStyle(1, 0xffffff, num)
        this.graphics.fillStyle(0x000000, num)
        this.graphics.strokeRectShape(this.shopDetails)
        this.graphics.fillRectShape(this.shopDetails)
        this.graphics.strokeRectShape(this.shopBackground)
        this.graphics.fillRectShape(this.shopBackground)
        this.shopText.setAlpha(num)
        this.cursor.setAlpha(num)
        this.detailText.setAlpha(num)
        this.priceText.setAlpha(num)
    }
    // set detail text
    selection() {
        if (this.cursorLoc == 0) {
            // max hp
            this.selectLoc = 0
            this.price = (UPGRADES[this.selectLoc][2])/5
        } else if (this.cursorLoc == 1) {
            // max mana
            this.selectLoc = 2
            this.price = (UPGRADES[this.selectLoc][2])/5
        } else if (this.cursorLoc == 2) {
            // attack dmg
            this.selectLoc = 4
            this.price = (UPGRADES[this.selectLoc][2])
        } else if (this.cursorLoc == 3) {
            // crit chance
            this.selectLoc = 5
            this.price = (UPGRADES[this.selectLoc][2])-1
        } else if (this.cursorLoc == 4) {
            // crit dmg
            this.selectLoc = 6
            this.price = (UPGRADES[this.selectLoc][2])-3
        } else if (this.cursorLoc == 5) {
            // magic heal
            this.selectLoc = 7
            this.price = (UPGRADES[this.selectLoc][2])
        } else if (this.cursorLoc == 6) {
            // magic dmg
            this.selectLoc = 8
            this.price = (UPGRADES[this.selectLoc][2])-2
        }
        this.detailText.setText(`${UPGRADES[this.selectLoc][1]}<${UPGRADES[this.selectLoc][2]}\ngold:${RICHES}`)
        this.priceText.setText(`${this.price}$`)
    }
    // actually making the purchases
    completion() {
        if (RICHES >= this.price && Phaser.Input.Keyboard.JustDown(A)) {
            if (this.selectLoc == 0 || this.selectLoc == 2) {
                UPGRADES[this.selectLoc][1] += 5
                UPGRADES[this.selectLoc][2] += 5
            } else if (this.selectLoc == 4 || this.selectLoc == 6 || this.selectLoc == 8) {
                UPGRADES[this.selectLoc][1] += 2
                UPGRADES[this.selectLoc][2] += 2
            } else if (this.selectLoc == 5 || this.selectLoc == 7) {
                UPGRADES[this.selectLoc][1] += 3
                UPGRADES[this.selectLoc][2] += 3
            }
            RICHES -= this.price
            this.events.emit('takeRiches')
            this.events.emit('addUpgrades')
        }
    }

    // ------------------------------------------------------------------------------ GRID MOVEMENT
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
    // move player
    movement() {
        if (Phaser.Input.Keyboard.JustDown(LEFT)) {
            this.move(LEFT, this.wallsLayer, false)
            if (this.PLAYERDIRECT != 'left') {
                this.PLAYERDIRECT = 'left'
                this.player.anims.play(this.PLAYERDIRECT)
            }
            this.tileLoc = this.world_to_tile(this.player.x, this.player.y, this.backgroundLayer)
            this.tile = this.get_tile(this.tileLoc.x, this.tileLoc.y, this.backgroundLayer);
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
            this.tileLoc = this.world_to_tile(this.player.x, this.player.y, this.backgroundLayer)
            this.tile = this.get_tile(this.tileLoc.x, this.tileLoc.y, this.backgroundLayer);
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
            this.tileLoc = this.world_to_tile(this.player.x, this.player.y, this.backgroundLayer)
            this.tile = this.get_tile(this.tileLoc.x, this.tileLoc.y, this.backgroundLayer);
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
            this.tileLoc = this.world_to_tile(this.player.x, this.player.y, this.backgroundLayer)
            this.tile = this.get_tile(this.tileLoc.x, this.tileLoc.y, this.backgroundLayer);
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
    // all dev tools for item shop scene
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
}

