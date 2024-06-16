class Room extends Phaser.Scene {
    constructor() {
        super('roomScene')
    }

    init() {
        // screen x and y for camera movement
        this.SCREENX = 256
        this.SCREENY = 240
        // initial player coords
        this.PLAYERX = this.SCREENX/2 
        this.PLAYERY = this.SCREENY/2
        this.PLAYERDIRECT = 'down'
        this.OCCUPIED = false
        // temp initial enemy coords
        //this.ENEMYX = (this.SCREENX/2)+tileSize
        //this.ENEMYY = (this.SCREENY/2)+tileSize
        this.ENEMYX = 300  
        this.ENEMYY = 8
        
        // Enemy will detect you if you are 8 tiles away
        this.enemyRange = 8;
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
        this.navLayer.visible = false;
        // enemy spawning layer
        this.spawnLayer = this.map.createLayer('Spawn', this.tilesetArr, 0, 0)
        this.spawnLayer.setCollisionByProperty({ collides: true })
        this.spawnLayer.visible = false;
        //console.log(this.spawnLayer)
        // ------------------------------------------------------------------------- PATHFINDING SETUP
        // Create room names
        this.ROOMS = 
        {
            ITEMSHOP: 0,
            COURTYARD: 1,
            CASTLE: 2,
            DUNGEON: 3
        }
        // Create Array to hold tiles
        this.grid = []
        // Load in tiles from navLayer
        for (let y = 0; y < this.map.height; y+=1)
            {
                this.grid[y] = [];
            }
        for (let y = 0; y < this.map.height; y+=1)
            {
             for (let x = 0; x < this.map.width; x+=1)   
                {
                    let tile = this.navLayer.getTileAt(x,y)
                    if(tile) this.grid[y][x] = tile.index
                }
            }
        // Tell easy star what tiles can be walked on
        this.walkables = [62];
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
        
    }

    update() {
        // player movement, attack, magical attack
        if (this.OCCUPIED == false) { this.movement() }
        this.attack()
        this.magic()
        // dev tools
        this.devRoom()
    }

    // ----------------------------------------------------------------------------- COMBAT HELPERS
    // attack
    attack() {
        if (Phaser.Input.Keyboard.JustDown(A) && this.OCCUPIED == false) {
            // prevent player from moving
            this.OCCUPIED = true
            if (Math.floor(Math.random() * 100) < UPGRADES[5][1]) {
                var anim = this.add.sprite(this.player.x-tileSize, this.player.y-tileSize, 'crit').setOrigin(0).play(this.PLAYERDIRECT+'Crit').once('animationcomplete', () => {
                    anim.destroy()
                    this.time.delayedCall(50, () => { this.OCCUPIED = false })
                })
            } else {
                var anim = this.add.sprite(this.player.x-tileSize, this.player.y-tileSize, 'attack').setOrigin(0).play(this.PLAYERDIRECT+'Attack').once('animationcomplete', () => {
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
            var anim = this.add.sprite(this.player.x-tileSize-1, this.player.y-tileSize-1, 'magic').setOrigin(0).play(this.PLAYERDIRECT+'Magic').once('animationcomplete', () => {
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
            }
            this.recalculate_paths();
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
            }
            this.recalculate_paths();
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
            }
            this.recalculate_paths();
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
            }
            this.recalculate_paths();
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
    recalculate_paths()
    {
        console.log(this.tweens.tweens)
        if (!this.tweens.processing)
        {
            switch (this.player.room) {
                case this.ROOMS.COURTYARD:
                    for (let enemy of this.enemyArr1) {
                        if(!enemy.isMoving)
                        {
                            // Calculate distance from player to enemy, if theyre out of range, dont bother
                            if (Math.floor(Math.sqrt(Math.pow(this.player.x - enemy.x, 2) + Math.pow(this.player.y - enemy.y, 2)) / tileSize) > this.enemyRange) continue;
                            if (enemy.room != this.player.room) continue;
                            this.enemyLocX = this.world_to_tile(enemy.x, enemy.y, this.navLayer).x
                            this.enemyLocY = this.world_to_tile(enemy.y, enemy.y, this.navLayer).y
                            this.playerLocX = this.world_to_tile(this.player.x, this.player.y, this.navLayer).x
                            this.playerLocY = this.world_to_tile(this.player.y, this.player.y, this.navLayer).y
                            enemy.find_path(this.enemyLocX, this.enemyLocY, this.playerLocX, this.playerLocY)
                        }
                    }
                    break;
                case this.ROOMS.CASTLE:
                    for (let enemy of this.enemyArr2) {
                        if(!enemy.isMoving)
                        {
                        if (Math.floor(Math.sqrt(Math.pow(this.player.x - enemy.x, 2) + Math.pow(this.player.y - enemy.y, 2)) / tileSize) > this.enemyRange) continue;
                        if (enemy.room != this.player.room) continue;
                        this.enemyLocX = this.world_to_tile(enemy.x, enemy.y, this.navLayer).x
                        this.enemyLocY = this.world_to_tile(enemy.y, enemy.y, this.navLayer).y
                        this.playerLocX = this.world_to_tile(this.player.x, this.player.y, this.navLayer).x
                        this.playerLocY = this.world_to_tile(this.player.y, this.player.y, this.navLayer).y
                        enemy.find_path(this.enemyLocX, this.enemyLocY, this.playerLocX, this.playerLocY)
                        }
                    }
                    break;
                case this.ROOMS.DUNGEON:
                    for (let enemy of this.enemyArr3) {
                        if(!enemy.isMoving)
                        {
                        if (Math.floor(Math.sqrt(Math.pow(this.player.x - enemy.x, 2) + Math.pow(this.player.y - enemy.y, 2)) / tileSize) > this.enemyRange) continue;
                        if (enemy.room != this.player.room) continue;
                        this.enemyLocX = this.world_to_tile(enemy.x, enemy.y, this.navLayer).x
                        this.enemyLocY = this.world_to_tile(enemy.y, enemy.y, this.navLayer).y
                        this.playerLocX = this.world_to_tile(this.player.x, this.player.y, this.navLayer).x
                        this.playerLocY = this.world_to_tile(this.player.y, this.player.y, this.navLayer).y
                        enemy.find_path(this.enemyLocX, this.enemyLocY, this.playerLocX, this.playerLocY)
                        }
                    }
                    break;
            }
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
        // Move camera based on argument
        this.cameras.main.scrollX += deltaX
        this.cameras.main.scrollY += deltaY
        console.log(this.player.room)
    }

    // ---------------------------------------------------------------------------------- ENEMY SPAWNING
    spawn_enemies()
    {
        // Gather possible spawn points for each room
        let room1_spawns = []
        let room2_spawns = []
        let room3_spawns = []
        this.spawnLayer.forEachTile((tile) => 
        {
            console.log(tile)
            if(tile && tile.index != -1)
                {
                    if(tile.properties.room == 1)
                        {
                            room1_spawns.push(tile)                   
                        }
                    else if(tile.properties.room == 2)
                        {
                            room2_spawns.push(tile)                   
                        }
                    else if(tile.properties.room == 3)
                        {
                            room3_spawns.push(tile)                   
                        }
                    else
                    {
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
        for(let i = 0; i < room1_count; i+=1)
            {
                let index = Math.floor(Math.random() * room1_spawns.length-1)
                room1_points.push(room1_spawns[index])
            }
        let room2_points = []
        for(let i = 0; i < room2_count; i+=1)
            {
                let index = Math.floor(Math.random() * room2_spawns.length-1)
                room2_points.push(room2_spawns[index])
            }
        let room3_points = []
        for(let i = 0; i < room3_count; i+=1)
            {
                let index = Math.floor(Math.random() * room3_spawns.length-1)
                room3_points.push(room3_spawns[index])
            }

        console.log("ROOM 1 SPAWNS: ", room1_points)
        console.log("ROOM 2 SPAWNS: ", room2_points)
        console.log("ROOM 3 SPAWNS: ", room3_points)
        // Spawn an enemy at each of the tile's locations
        for(let tile of room1_points)
            {
                let worldCoord = this.tile_to_world(tile.x,tile.y,this.spawnLayer)
                console.log(worldCoord)
                var enemy = new Enemy(this, worldCoord.x, worldCoord.y,this.finder,this.map,this.ROOMS.COURTYARD).setOrigin(0)
                enemy.anims.play('yellow')
                // Load enemies into array so that their pathfinding can be generalized
                this.enemyArr1.push(enemy)

            }
        for(let tile of room2_points)
            {
                let worldCoord = this.tile_to_world(tile.x,tile.y,this.spawnLayer)
                var enemy = new Enemy(this, worldCoord.x, worldCoord.y,this.finder,this.map,this.ROOMS.CASTLE).setOrigin(0)
                enemy.anims.play('yellow')
                // Load enemies into array so that their pathfinding can be generalized
                this.enemyArr2.push(enemy)

            }
        for(let tile of room3_points)
            {
                let worldCoord = this.tile_to_world(tile.x,tile.y,this.spawnLayer)
                var enemy = new Enemy(this, worldCoord.x, worldCoord.y,this.finder,this.map,this.ROOMS.DUNGEON).setOrigin(0)
                enemy.anims.play('yellow')
                // Load enemies into array so that their pathfinding can be generalized
                this.enemyArr3.push(enemy)
                console.log(enemy.x,enemy.y)
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
