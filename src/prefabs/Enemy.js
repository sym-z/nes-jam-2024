class Enemy extends Phaser.Physics.Arcade.Sprite {
    constructor(scene, x, y, finder, map, room) {
        super(scene, x, y, 'temp')

        // body
        scene.add.existing(this)
        scene.physics.add.existing(this)

        // physics
        this.body.setSize(this.width / 2)
        this.body.onCollide = true
        this.body.onOverlap = true
        this.body.setMaxVelocity(2000)
        this.body.setDamping(true)
        this.body.setDrag(.03)

        // combat
        this.HP = (LEVEL*2)+2

        // for pathfinding
        // Easystar reference
        this.finder = finder
        // Our Map
        this.map = map
        // RoomScene
        this.parent = scene
        // Where the enemy is in the Castle
        this.room = room
        // How fast the tweens transition
        // HIGHER NUMBER = SLOWER ENEMY
        this.speed = 300
        
        this.isMoving = false
    }

    // Calculates path and moves to destination
    find_path(fromX, fromY, toX, toY) {
        if(fromX == toX && fromY == toY) return
        this.finder.findPath(fromX, fromY, toX, toY, (path) => {
            if (path == null) {
                console.warn("No path found...")
            } else {
                this.move(path)
            }
        })
        this.finder.calculate()
    }

    move(path) {
        // Reference to the current object
        const enemy = this
        // Ensure only one chain is running at a time
        if (enemy.isMoving) {
            return
        }
        enemy.isMoving = true

        // Create the list of tween configurations in world coordinates
        var tweens = []
        for (var i = 0; i < path.length - 1; i++) {
            // Push all locations of the path into an array, except for our current location
            // Convert them from tile coords to world coords at the same time
            var ex = path[i + 1].x
            var ey = path[i + 1].y
            tweens.push({
                x: ex * enemy.map.tileWidth,
                y: ey * enemy.map.tileHeight,
                duration: enemy.speed
            })
        }

        // Start the first tween
        if (tweens.length > 0) {
            playTweens(tweens)
        }
       
        // Helper function to create and play tweens in sequence
        function playTweens(tweenConfigs, index = 0) {
            //console.log(index)
            //console.log(tweenConfigs.length)
            if (index >= tweenConfigs.length) {
                // All tweens have completed
                enemy.isMoving = false // Reset the moving flag
                return
            }

            // Get the current tween config
            const tweenConfig = tweenConfigs[index]

            // Add the onComplete callback to start the next tween in the sequence
            tweenConfig.onComplete = function () {
                playTweens(tweenConfigs, index + 1)
            }

            // Start the tween
            enemy.parent.tweens.add({
                targets: enemy,
                x: tweenConfig.x,
                y: tweenConfig.y,
                duration: tweenConfig.duration,
                onComplete: tweenConfig.onComplete,
                onCompleteScope: enemy
            })
        }
    }
}