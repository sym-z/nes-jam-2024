class Room extends Phaser.Scene {
    constructor() {
        super('roomScene')
    }

    init() {
        // screen x and y for camera movement
        this.SCREENX = 256
        this.SCREENY = 240
        // initial player coords
        this.PLAYERX = this.SCREENX / 2
        this.PLAYERY = this.SCREENY / 2
        this.PLAYERDIRECT = 'down'
        this.OCCUPIED = false
        // grab player shorthands from UPGRADES array
        console.log(UPGRADES[0][1])
        this.HP = UPGRADES[0][1]
        this.MANA = UPGRADES[2][1]
        this.ATKDMG = UPGRADES[4][1]
        this.CRITP = UPGRADES[5][1]
        this.CRITDMG = UPGRADES[4][1] + UPGRADES[6][1]
        this.MGCHEAL = UPGRADES[7][1]
        this.MGCDMG = UPGRADES[4][1] + UPGRADES[8][1]
        // temp initial enemy coords
        this.ENEMYX = 300
        this.ENEMYY = 8
        // Enemy will detect you if you are 8 tiles away
        this.enemyRange = 8
        // This is so the player cannot be hit too many times per second
        this.can_hit = true
        this.hitCooldown = 500
        if (LEVEL <= 5) {
            this.COLOR = 'green'
        } else if (LEVEL <= 5) {
            this.COLOR = 'purple'
        } else if (LEVEL <= 12) {
            this.COLOR = 'yellow'
        } else if (LEVEL <= 20) {
            this.COLOR = 'teal'
        } else if (LEVEL <= 35) {
            this.COLOR = 'blue'
        } else {
            this.COLOR = 'pink'
        }
    }

    preload() {
        // load tile animation plugin
        this.load.scenePlugin('AnimatedTiles', './lib/AnimatedTiles.js', 'animatedTiles', 'animatedTiles');
    }

    create() {
        // running checks
        console.log('%cROOM SCENE :^)', testColor)

        // ----------------------------------------------------------------------------- TILE SETUP
        this.cameras.main.setBackgroundColor('#FF0000') // background will display red in case of error
        // create map
        this.map = this.make.tilemap({ key: 'castle' })
        // tileset variables + array
        this.tilesetArr = []
        this.brickTileset = this.map.addTilesetImage('aqua_brick', 'aqua_brickPNG')
        this.tilesetArr.push(this.brickTileset)
        this.castleTileset = this.map.addTilesetImage('castle_walls', 'castle_wallsPNG')
        this.tilesetArr.push(this.castleTileset)
        this.stoneTileset = this.map.addTilesetImage('mossy_stone', 'mossy_stonePNG')
        this.tilesetArr.push(this.stoneTileset)
        this.rugTileset = this.map.addTilesetImage('rug', 'rugPNG')
        this.tilesetArr.push(this.rugTileset)
        this.waterTileset = this.map.addTilesetImage('water', 'waterPNG')
        this.tilesetArr.push(this.waterTileset)
        this.navTileset = this.map.addTilesetImage('nav_layer', 'navPNG')
        this.tilesetArr.push(this.navTileset)
        this.spawnTileset = this.map.addTilesetImage('spawn_layer', 'spawnPNG')
        this.tilesetArr.push(this.spawnTileset)
        this.doorsTileset = this.map.addTilesetImage('doors', 'doorsPNG')
        this.tilesetArr.push(this.doorsTileset)
        // background layer
        this.backgroundLayer = this.map.createLayer('Background', this.tilesetArr, 0, 0)
        this.backgroundLayer.setCollisionByProperty({ collides: true })
        // brick layer
        this.wallsLayer = this.map.createLayer('Walls', this.tilesetArr, 0, 0)
        this.wallsLayer.setCollisionByProperty({ collides: true })
        // foreground layer
        this.foregroundLayer = this.map.createLayer('Foreground', this.tilesetArr, 0, 0)
        this.foregroundLayer.setCollisionByProperty({ collides: true })
        // enemy navigation layer
        this.navLayer = this.map.createLayer('Nav', this.tilesetArr, 0, 0)
        this.navLayer.setCollisionByProperty({ collides: true })
        this.navLayer.visible = false
        // enemy spawning layer
        this.spawnLayer = this.map.createLayer('Spawn', this.tilesetArr, 0, 0)
        this.spawnLayer.setCollisionByProperty({ collides: true })
        this.spawnLayer.visible = false
        // animation setup
        this.animatedTiles.init(this.map)
        //console.log(this.spawnLayer)
        // door setup
        this.doorTiles = []
        this.wallsLayer.forEachTile((tile) => {
            //console.log(tile)
            if (tile && tile.index != -1) {
                console.log(tile.properties.isDoor)
                if (tile.properties.collides && tile.properties.isDoor) {
                    this.doorTiles.push(tile)
                }
            }
        })
        // ------------------------------------------------------------------------- PATHFINDING SETUP
        // Create room names
        this.ROOMS = {
            ITEMSHOP: 0,
            COURTYARD: 1,
            CASTLE: 2,
            DUNGEON: 3
        }
        // Create Array to hold tiles
        this.grid = []
        // Load in tiles from navLayer
        for (let y = 0; y < this.map.height; y += 1) {
            this.grid[y] = []
        }
        for (let y = 0; y < this.map.height; y += 1) {
            for (let x = 0; x < this.map.width; x += 1) {
                let tile = this.navLayer.getTileAt(x, y)
                if (tile) this.grid[y][x] = tile.index
            }
        }
        // Tell easy star what tiles can be walked on
        this.walkables = [62]
        // Create easystar obj
        this.finder = new EasyStar.js()
        // Set its grid
        this.finder.setGrid(this.grid)
        // Set walkable tiles
        this.finder.setAcceptableTiles(this.walkables)
        // ------------------------------------------------------------------------- STARTING SETUP
        this.player = new Player(this, this.PLAYERX, this.PLAYERY).setOrigin(0)
        this.player.anims.play('down')
        this.player.set_room(this.ROOMS.COURTYARD)
        // Holds the enemies in each room
        this.enemyArr1 = []
        this.enemyArr2 = []
        this.enemyArr3 = []
        this.spawn_enemies()
        this.room1_enemy_count = this.enemyArr1.length
        this.room2_enemy_count = this.enemyArr2.length
        this.room3_enemy_count = this.enemyArr3.length
        this.riches = 0
    }

    update() {
        // player movement, attack, magical attack
        if (this.OCCUPIED == false) { this.movement() }
        this.attack()
        this.magic()
        // dev tools
        this.devRoom()
        this.enemy_ai()
        this.enemy_attack()

    }

    // ----------------------------------------------------------------------------- COMBAT HELPERS
    // attack
    attack() {
        if (Phaser.Input.Keyboard.JustDown(A) && this.OCCUPIED == false) {
            // prevent player from moving
            this.OCCUPIED = true
            // src = https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Math/random
            if (Math.floor(Math.random() * 100) < this.CRITP) {
                this.grab_facing_tiles(this.CRITDMG)
                var anim = this.add.sprite(this.player.x - tileSize, this.player.y - tileSize, 'crit').setOrigin(0).play(this.PLAYERDIRECT + 'Crit').once('animationcomplete', () => {
                    anim.destroy()
                    this.time.delayedCall(50, () => { this.OCCUPIED = false })
                })
            } else {
                this.grab_facing_tiles(this.ATKDMG)
                var anim = this.add.sprite(this.player.x - tileSize, this.player.y - tileSize, 'attack').setOrigin(0).play(this.PLAYERDIRECT + 'Attack').once('animationcomplete', () => {
                    anim.destroy()
                    this.time.delayedCall(50, () => { this.OCCUPIED = false })
                })
            }
        }
    }
    // magical attack
    magic() {
        if (Phaser.Input.Keyboard.JustDown(B) && this.OCCUPIED == false) {
            // prevent player from moving
            this.OCCUPIED = true
            this.grab_facing_tiles(this.MGCDMG)
            var anim = this.add.sprite(this.player.x - tileSize - 1, this.player.y - tileSize - 1, 'magic').setOrigin(0).play(this.PLAYERDIRECT + 'Magic').once('animationcomplete', () => {
                anim.destroy()
                this.time.delayedCall(50, () => { this.OCCUPIED = false })
            })
        }
    }

    // -------------------------------------------------------------------------------GRID MOVEMENT
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
    // Allows for player grid movement, and camera movement at exit
    movement() {
        if (Phaser.Input.Keyboard.JustDown(LEFT)) {
            this.move(LEFT, this.wallsLayer, false)
            if (this.PLAYERDIRECT != 'left') {
                this.PLAYERDIRECT = 'left'
                this.player.anims.play(this.PLAYERDIRECT)
            }
            // If the player is at the border of the screen, move it, and place them at an offset
            if (this.player.x % this.SCREENX == 0) {
                this.move_cam('LEFT')
                for (let i = 0; i < this.player.transitionOffset; i++) {
                    this.move(LEFT, this.wallsLayer, true)
                }
                // If they moved BACK into the courtyard, dont lock the doors
                if(this.room1_enemy_count != 0) this.lock_rooms()
            }
        }
        if (Phaser.Input.Keyboard.JustDown(RIGHT)) {
            this.move(RIGHT, this.wallsLayer, false)
            if (this.PLAYERDIRECT != 'right') {
                this.PLAYERDIRECT = 'right'
                this.player.anims.play(this.PLAYERDIRECT)
            }
            // If the player is at the border of the screen, move it, and place them at an offset
            if (this.player.x % this.SCREENX == 0 || (this.SCREENX - (this.player.x % this.SCREENX)) <= tileSize) {
                this.move_cam('RIGHT')
                for (let i = 0; i < this.player.transitionOffset; i++) {
                    this.move(RIGHT, this.wallsLayer, true)
                }
                // If they moved BACK into the CASTLE
                if(this.room2_enemy_count != 0) this.lock_rooms()
            }
        }
        if (Phaser.Input.Keyboard.JustDown(UP)) {
            this.move(UP, this.wallsLayer, false)
            if (this.PLAYERDIRECT != 'up') {
                this.PLAYERDIRECT = 'up'
                this.player.anims.play(this.PLAYERDIRECT)
            }
            // If the player is at the border of the screen, move it, and place them at an offset
            if (this.player.y % this.SCREENY == 0) {
                this.move_cam('UP')
                for (let i = 0; i < this.player.transitionOffset; i++) {
                    this.move(UP, this.wallsLayer, true)
                }
                // If they moved BACK into the CASTLE
                if(this.room2_enemy_count != 0) this.lock_rooms()
            }
        }
        if (Phaser.Input.Keyboard.JustDown(DOWN)) {
            this.move(DOWN, this.wallsLayer, false)
            if (this.PLAYERDIRECT != 'down') {
                this.PLAYERDIRECT = 'down'
                this.player.anims.play(this.PLAYERDIRECT)
            }
            // If the player is at the border of the screen, move it, and place them at an offset
            if (this.player.y % this.SCREENY == 0 || (this.SCREENY - (this.player.y % this.SCREENY)) <= tileSize) {
                this.move_cam('DOWN')
                for (let i = 0; i < this.player.transitionOffset; i++) {
                    this.move(DOWN, this.wallsLayer, true)
                }
                // If they moved BACK into the DUNGEON
                if(this.room3_enemy_count != 0) this.lock_rooms()
            }
        }
    }
    // This function takes in the input from the handlers in create and moves the player
    // isChangingRooms is used to make sure that the offset when entering a room isn't affected
    // by sprinting
    move(input, layer, isChangingRooms) {
        let tileLoc = this.world_to_tile(this.player.x, this.player.y, layer)
        switch (input) {
            case LEFT:
                // See if tile exists and doesn't collide
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
    // Grabs tiles that are part of the player's attack's hitbox
    grab_facing_tiles(damage) {
        // GOING TO BE GRABBING 5 TILES
        // List of tiles hit
        this.hitTiles = []
        // List of enemies in the room
        this.enemyList = []
        // Player's tile location
        this.tileLocX = this.world_to_tile(this.player.x, this.player.y, this.backgroundLayer).x
        this.tileLocY = this.world_to_tile(this.player.x, this.player.y, this.backgroundLayer).y
        // Figure out the enemies in the room
        if (this.player.room == this.ROOMS.COURTYARD) {
            this.enemyList = this.enemyArr1
        }
        else if (this.player.room == this.ROOMS.CASTLE) {
            this.enemyList = this.enemyArr2
        }
        else if (this.player.room == this.ROOMS.DUNGEON) {
            this.enemyList = this.enemyArr3
        }
        // Based on where we are looking, grab the proper tiles
        switch (this.PLAYERDIRECT) {
            case 'up':
                // Grab tiles
                // Left Tile 
                let tile1 = new Phaser.Math.Vector2()
                tile1.x = this.tileLocX - 1
                tile1.y = this.tileLocY
                this.hitTiles.push(tile1)
                // Top Left Tile 
                let tile2 = new Phaser.Math.Vector2()
                tile2.x = this.tileLocX - 1
                tile2.y = this.tileLocY - 1
                this.hitTiles.push(tile2)
                // Top Middle Tile 
                let tile3 = new Phaser.Math.Vector2()
                tile3.x = this.tileLocX
                tile3.y = this.tileLocY - 1
                this.hitTiles.push(tile3)
                // Top Right Tile 
                let tile4 = new Phaser.Math.Vector2()
                tile4.x = this.tileLocX + 1
                tile4.y = this.tileLocY - 1
                this.hitTiles.push(tile4)
                // Right Tile 
                let tile5 = new Phaser.Math.Vector2()
                tile5.x = this.tileLocX + 1
                tile5.y = this.tileLocY
                this.hitTiles.push(tile5)
                break
            case 'down': //TODO: FINISH UP HERE
                // Left Tile 
                let tile6 = new Phaser.Math.Vector2()
                tile6.x = this.tileLocX - 1
                tile6.y = this.tileLocY
                this.hitTiles.push(tile6)
                // Bottom Left Tile 
                let tile7 = new Phaser.Math.Vector2()
                tile7.x = this.tileLocX - 1
                tile7.y = this.tileLocY + 1
                this.hitTiles.push(tile7)
                // Bottom Middle Tile 
                let tile8 = new Phaser.Math.Vector2()
                tile8.x = this.tileLocX
                tile8.y = this.tileLocY + 1
                this.hitTiles.push(tile8)
                // Bottom Right Tile 
                let tile9 = new Phaser.Math.Vector2()
                tile9.x = this.tileLocX + 1
                tile9.y = this.tileLocY + 1
                this.hitTiles.push(tile9)
                // Right Tile 
                let tile10 = new Phaser.Math.Vector2()
                tile10.x = this.tileLocX + 1
                tile10.y = this.tileLocY
                this.hitTiles.push(tile10)
                break
            case 'left':
                // Left Tile 
                let tile11 = new Phaser.Math.Vector2()
                tile11.x = this.tileLocX - 1
                tile11.y = this.tileLocY
                this.hitTiles.push(tile11)
                // Top Left Tile 
                let tile12 = new Phaser.Math.Vector2()
                tile12.x = this.tileLocX - 1
                tile12.y = this.tileLocY - 1
                this.hitTiles.push(tile12)
                // Top Middle Tile 
                let tile13 = new Phaser.Math.Vector2()
                tile13.x = this.tileLocX
                tile13.y = this.tileLocY - 1
                this.hitTiles.push(tile13)
                // Top Right Tile 
                let tile14 = new Phaser.Math.Vector2()
                tile14.x = this.tileLocX + 1
                tile14.y = this.tileLocY + 1
                this.hitTiles.push(tile14)
                // Right Tile 
                let tile15 = new Phaser.Math.Vector2()
                tile15.x = this.tileLocX - 1
                tile15.y = this.tileLocY
                this.hitTiles.push(tile15)
                break
            case 'right':
                // Left Tile 
                let tile16 = new Phaser.Math.Vector2()
                tile16.x = this.tileLocX - 1
                tile16.y = this.tileLocY
                this.hitTiles.push(tile16)
                // Top Left Tile 
                let tile17 = new Phaser.Math.Vector2()
                tile17.x = this.tileLocX - 1
                tile17.y = this.tileLocY - 1
                this.hitTiles.push(tile17)
                // Top Middle Tile 
                let tile18 = new Phaser.Math.Vector2()
                tile18.x = this.tileLocX
                tile18.y = this.tileLocY - 1
                this.hitTiles.push(tile18)
                // Top Right Tile 
                let tile19 = new Phaser.Math.Vector2()
                tile19.x = this.tileLocX + 1
                tile19.y = this.tileLocY + 1
                this.hitTiles.push(tile19)
                // Right Tile 
                let tile20 = new Phaser.Math.Vector2()
                tile20.x = this.tileLocX - 1
                tile20.y = this.tileLocY
                this.hitTiles.push(tile20)
                break
        }
        for (let tile of this.hitTiles) {
            console.log('something is happening')
            for (let enemy of this.enemyList) {
                let eTileX = this.world_to_tile(enemy.x, enemy.y, this.backgroundLayer).x
                let eTileY = this.world_to_tile(enemy.x, enemy.y, this.backgroundLayer).y
                if ((tile.x == eTileX && tile.y == eTileY)) {
                    // play enemy hurt anims
                    try {
                        enemy.anims.play(enemy.color + 'Hurt').once('animationcomplete', () => {
                            enemy.anims.play(enemy.color)
                        })
                    } catch { }
                    enemy.HP -= damage
                    if (enemy.HP <= 0) {
                        RICHES += enemy.maxHP
                        this.riches += enemy.maxHP
                        this.events.emit('addRiches')
                        enemy.alive = false
                        enemy.destroy()
                        this.update_count()
                        switch(this.player.room) {
                            case this.ROOMS.COURTYARD:
                                if(this.room1_enemy_count == 0)
                                    {
                                        this.unlock_rooms()
                                    }
                                break
                            case this.ROOMS.CASTLE:
                                if(this.room2_enemy_count == 0)
                                    {
                                        this.unlock_rooms()
                                    }
                                break
                            case this.ROOMS.DUNGEON:
                                if(this.room3_enemy_count == 0)
                                    {
                                        this.unlock_rooms()
                                    }
                                break
                        }
                    }
                }
            }
        }
    }
    recalculate_paths(enemy = null) {
        // src = https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Math/random
        this.wiggleX = Math.floor(Math.random() * (Math.floor(2) - Math.ceil(-1)) + Math.ceil(-1))
        this.wiggleY = Math.floor(Math.random() * (Math.floor(2) - Math.ceil(-1)) + Math.ceil(-1))
        //console.log(this.tweens.tweens)
        if (enemy == null) {
            switch (this.player.room) {
                case this.ROOMS.COURTYARD:
                    for (let enemy of this.enemyArr1) {
                        if (!enemy.isMoving) {
                            // Calculate distance from player to enemy, if theyre out of range, dont bother
                            if (Math.floor(Math.sqrt(Math.pow(this.player.x - enemy.x, 2) + Math.pow(this.player.y - enemy.y, 2)) / tileSize) > this.enemyRange) continue
                            if (enemy.room != this.player.room) continue
                            this.enemyLocX = this.world_to_tile(enemy.x, enemy.y, this.navLayer).x
                            this.enemyLocY = this.world_to_tile(enemy.y, enemy.y, this.navLayer).y
                            this.playerLocX = this.world_to_tile(this.player.x, this.player.y, this.navLayer).x
                            this.playerLocY = this.world_to_tile(this.player.y, this.player.y, this.navLayer).y
                            this.result = enemy.find_path(this.enemyLocX, this.enemyLocY, this.playerLocX + this.wiggleX, this.playerLocY + this.wiggleY)
                            if (!this.result) console.log("Hit player")
                        }
                    }
                    break
                case this.ROOMS.CASTLE:
                    for (let enemy of this.enemyArr2) {
                        if (!enemy.isMoving) {
                            if (Math.floor(Math.sqrt(Math.pow(this.player.x - enemy.x, 2) + Math.pow(this.player.y - enemy.y, 2)) / tileSize) > this.enemyRange) continue
                            if (enemy.room != this.player.room) continue
                            this.enemyLocX = this.world_to_tile(enemy.x, enemy.y, this.navLayer).x
                            this.enemyLocY = this.world_to_tile(enemy.y, enemy.y, this.navLayer).y
                            this.playerLocX = this.world_to_tile(this.player.x, this.player.y, this.navLayer).x
                            this.playerLocY = this.world_to_tile(this.player.y, this.player.y, this.navLayer).y
                            enemy.find_path(this.enemyLocX, this.enemyLocY, this.playerLocX + this.wiggleX, this.playerLocY + this.wiggleY)
                        }
                    }
                    break
                case this.ROOMS.DUNGEON:
                    for (let enemy of this.enemyArr3) {
                        if (!enemy.isMoving) {
                            if (Math.floor(Math.sqrt(Math.pow(this.player.x - enemy.x, 2) + Math.pow(this.player.y - enemy.y, 2)) / tileSize) > this.enemyRange) continue
                            if (enemy.room != this.player.room) continue
                            this.enemyLocX = this.world_to_tile(enemy.x, enemy.y, this.navLayer).x
                            this.enemyLocY = this.world_to_tile(enemy.y, enemy.y, this.navLayer).y
                            this.playerLocX = this.world_to_tile(this.player.x, this.player.y, this.navLayer).x
                            this.playerLocY = this.world_to_tile(this.player.y, this.player.y, this.navLayer).y
                            enemy.find_path(this.enemyLocX, this.enemyLocY, this.playerLocX + this.wiggleX, this.playerLocY + this.wiggleY)
                        }
                    }
                    break
            }
        } else {
            if (Math.floor(Math.sqrt(Math.pow(this.player.x - enemy.x, 2) + Math.pow(this.player.y - enemy.y, 2)) / tileSize) > this.enemyRange) return
            if (enemy.room != this.player.room) return
            this.enemyLocX = this.world_to_tile(enemy.x, enemy.y, this.navLayer).x
            this.enemyLocY = this.world_to_tile(enemy.y, enemy.y, this.navLayer).y
            this.playerLocX = this.world_to_tile(this.player.x, this.player.y, this.navLayer).x
            this.playerLocY = this.world_to_tile(this.player.y, this.player.y, this.navLayer).y
            enemy.find_path(this.enemyLocX, this.enemyLocY, this.playerLocX + this.wiggleX, this.playerLocY + this.wiggleY)
        }
    }
    // ---------------------------------------------------------------------- CAMERA MOVEMENT CODE
    // Moves camera based on direction given as a parameter, (LEFT,RIGHT,UP,DOWN)
    move_cam(direction) {
        // Using these variables declutters the switch statement
        let deltaX = 0
        let deltaY = 0
        switch (direction) {
            // Moving from CASTLE to COURTYARD
            case 'LEFT':
                deltaX = -this.SCREENX
                this.player.room = this.ROOMS.COURTYARD
                break
            // Moving from COURTYARD to CASTLE 
            case 'RIGHT':
                deltaX = this.SCREENX
                this.player.room = this.ROOMS.CASTLE
                break
            // Moving from DUNGEON to CASTLE 
            case 'UP':
                deltaY = -this.SCREENY
                this.player.room = this.ROOMS.CASTLE
                break
            // Moving from CASTLE to DUNGEON 
            case 'DOWN':
                deltaY = this.SCREENY
                this.player.room = this.ROOMS.DUNGEON
                break
            default:
                break
        }
        //console.log(this.player.room)
        // Move camera based on argument
        this.cameras.main.scrollX += deltaX
        this.cameras.main.scrollY += deltaY
    }

    // ---------------------------------------------------------------------------------- ENEMY SPAWNING
    spawn_enemies() {
        // Gather possible spawn points for each room
        let room1_spawns = []
        let room2_spawns = []
        let room3_spawns = []
        this.spawnLayer.forEachTile((tile) => {
            //console.log(tile)
            if (tile && tile.index != -1) {
                if (tile.properties.room == 1) {
                    room1_spawns.push(tile)
                } else if (tile.properties.room == 2) {
                    room2_spawns.push(tile)
                } else if (tile.properties.room == 3) {
                    room3_spawns.push(tile)
                } else {
                    console.warn("Grabbed bad tile in spawn enemies function...")
                }
            }
        })
        // Figure out number of enemies to spawn in each room
        // TODO: ADJUST SCALE OF ENEMY COUNT
        let room1_count = (ROOM + 0) + 3
        let room2_count = (ROOM + 1) + 3
        let room3_count = (ROOM + 2) + 3
        // Pull that number of random indices from the arrays and store them in arrays

        let room1_points = []
        for (let i = 0; i < room1_count; i += 1) {
            let index = Math.floor(Math.random() * room1_spawns.length - 1)
            room1_points.push(room1_spawns[index])
        }
        let room2_points = []
        for (let i = 0; i < room2_count; i += 1) {
            let index = Math.floor(Math.random() * room2_spawns.length - 1)
            room2_points.push(room2_spawns[index])
        }
        let room3_points = []
        for (let i = 0; i < room3_count; i += 1) {
            let index = Math.floor(Math.random() * room3_spawns.length - 1)
            room3_points.push(room3_spawns[index])
        }

        //console.log("ROOM 1 SPAWNS: ", room1_points)
        //console.log("ROOM 2 SPAWNS: ", room2_points)
        //console.log("ROOM 3 SPAWNS: ", room3_points)
        // Spawn an enemy at each of the tile's locations
        for (let tile of room1_points) {
            if (!tile) continue
            let worldCoord = this.tile_to_world(tile.x, tile.y, this.spawnLayer)
            //console.log(worldCoord)
            var enemy = new Enemy(this, worldCoord.x, worldCoord.y, this.finder, this.map, this.ROOMS.COURTYARD, this.COLOR).setOrigin(0)
            enemy.anims.play(enemy.color)
            // Load enemies into array so that their pathfinding can be generalized
            this.enemyArr1.push(enemy)
        }
        for (let tile of room2_points) {
            if (!tile) continue
            let worldCoord = this.tile_to_world(tile.x, tile.y, this.spawnLayer)
            var enemy = new Enemy(this, worldCoord.x, worldCoord.y, this.finder, this.map, this.ROOMS.CASTLE, this.COLOR).setOrigin(0)
            enemy.anims.play(enemy.color)
            // Load enemies into array so that their pathfinding can be generalized
            this.enemyArr2.push(enemy)
        }
        for (let tile of room3_points) {
            if (!tile) continue
            let worldCoord = this.tile_to_world(tile.x, tile.y, this.spawnLayer)
            var enemy = new Enemy(this, worldCoord.x, worldCoord.y, this.finder, this.map, this.ROOMS.DUNGEON, this.COLOR).setOrigin(0)
            enemy.anims.play(enemy.color)
            // Load enemies into array so that their pathfinding can be generalized
            this.enemyArr3.push(enemy)
        }
    }
    enemy_ai() {
        switch (this.player.room) {
            case 1:
                for (let enemy of this.enemyArr1) {
                    //console.log(enemy.isMoving)
                    //console.log(enemy.isMoving)
                    if (!enemy.isMoving) {
                        this.recalculate_paths(enemy)
                    }
                }
                break
            case 2:
                for (let enemy of this.enemyArr2) {
                    if (!enemy.isMoving) {
                        this.recalculate_paths(enemy)
                    }
                }
                break
            case 3:
                for (let enemy of this.enemyArr3) {
                    if (!enemy.isMoving) {
                        this.recalculate_paths(enemy)
                    }
                }
                break
        }
    }
    enemy_flip() {
        switch (this.player.room) {
            case 1:
                for (let enemy of this.enemyArr1) {
                    if (enemy.isMoving) {
                        enemy.isMoving = false
                    }
                }
                break
            case 2:
                for (let enemy of this.enemyArr2) {
                    if (enemy.isMoving) {
                        enemy.isMoving = false
                    }
                }
                break
            case 3:
                for (let enemy of this.enemyArr3) {
                    if (enemy.isMoving) {
                        enemy.isMoving = false
                    }
                }
                break
        }
    }
    enemy_attack() {
        if(this.can_hit) {
            // List of tiles hit
            this.hitTiles = []
            // List of enemies in the room
            this.enemyList = []
            // Player's tile location
            this.tileLocX = this.world_to_tile(this.player.x, this.player.y, this.backgroundLayer).x
            this.tileLocY = this.world_to_tile(this.player.x, this.player.y, this.backgroundLayer).y
            // Figure out the enemies in the room
            if (this.player.room == this.ROOMS.COURTYARD) {
                this.enemyList = this.enemyArr1
            } else if (this.player.room == this.ROOMS.CASTLE) {
                this.enemyList = this.enemyArr2
            } else if (this.player.room == this.ROOMS.DUNGEON) {
                this.enemyList = this.enemyArr3
            }
            // If any of the enemies are touching the player, apply damage and then have a cooldown
            for (let enemy of this.enemyList) {
                if(enemy.alive) {
                    this.eTileX = this.world_to_tile(enemy.x, enemy.y, this.backgroundLayer).x
                    this.eTileY = this.world_to_tile(enemy.x, enemy.y, this.backgroundLayer).y
                    if (this.eTileX == this.tileLocX && this.eTileY == this.tileLocY) {
                        console.log("Enemy Tile Loc: ", this.eTileX, this.eTileY)
                        console.log("Player Tile Loc: ", this.tileLocX, this.tileLocY)
                        console.log("Enemy ", enemy, " is currently hitting the player")
                        this.player.anims.play(this.PLAYERDIRECT + 'Hurt').once('animationcomplete', () => {
                            this.player.anims.play(this.PLAYERDIRECT)
                        })
                        // TODO: TICK DAMAGE
                        this.can_hit = false
                        this.time.delayedCall(this.hitCooldown, () => {
                            this.can_hit = true
                        })
                    }
                }
            }
        }
    
    }

    // ---------------------------------------------------------------------- ROOM LOCKING CODE
    lock_rooms()
    {
        // For each tile in Door array, turn its collision on, and make it visible
        for(let door of this.doorTiles)
            {
                door.visible = true
                //this.wallsLayer.setCollision(door.index,true)
                door.properties.collides = true
            }
    }
    unlock_rooms()
    {
        console.log("UNLOCKING DOORS", this.doorTiles)
        // For each tile in Door array, turn its collision off, and make it invisible
        for(let door of this.doorTiles)
            {
                door.visible = false
                //this.wallsLayer.setCollision(door.index,false)
                door.properties.collides = false;
            }

    }
    update_count()
    {
        let new_count = 0;
        switch(this.player.room)
        {
            case this.ROOMS.COURTYARD:
                for(let enemy of this.enemyArr1)
                    {
                        if(enemy.alive)
                            {
                                new_count += 1
                            }
                    }
                this.room1_enemy_count = new_count
                console.log("ROOM POPULATION IS NOW", this.room1_enemy_count)
                break
            case this.ROOMS.CASTLE:
                for(let enemy of this.enemyArr2)
                    {
                        if(enemy.alive)
                            {
                                new_count += 1
                            }
                    }
                this.room2_enemy_count = new_count
                console.log("ROOM POPULATION IS NOW", this.room2_enemy_count)
                break
            case this.ROOMS.DUNGEON:
                for(let enemy of this.enemyArr3)
                    {
                        if(enemy.alive)
                            {
                                new_count += 1
                            }
                    }
                this.room3_enemy_count = new_count
                console.log("ROOM POPULATION IS NOW", this.room3_enemy_count)
                if(this.room3_enemy_count == 0)
                    {
                        this.time.delayedCall(1000, () => {
                            this.scene.start("itemShopScene")
                        })
                    }
                break
        }
    }
    // ---------------------------------------------------------------------------------- DEV TOOLS
    // all dev controls taken care of in room
    devRoom() {
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
