class Enemy extends Phaser.Physics.Arcade.Sprite {
    constructor(scene, x, y,finder,map, room) {
        super(scene, x, y, 'temp')

        // body
        scene.add.existing(this)
        scene.physics.add.existing(this)

        // physics
        this.body.setSize(this.width/2)
        this.body.onCollide = true
        this.body.onOverlap = true
        this.body.setMaxVelocity(2000)
        this.body.setDamping(true)
        this.body.setDrag(.03)

        // for pathfinding
        this.finder = finder
        this.map = map
        this.parent = scene
        this.room = room
        this.speed = 150
    }
    find_path(fromX,fromY,toX,toY)
    {
        console.log('going from (' + fromX + ',' + fromY + ') to (' + toX + ',' + toY + ')');
        this.finder.findPath(fromX,fromY,toX,toY,(path) => 
        {
            if(path == null)
                {
                    console.warn("No path found...")
                }
            else{
                console.log(path)
                this.move(path)
            }
        })
        this.finder.calculate();
    }
    move(path)
    {
        // Make a list of tweens in world coords that the scene can animate the enemy moving
        var tweens = [];
        for (var i = 0; i < path.length - 1; i++) {
            // Push all locations of the path into an array, except for our current location
            // Convert them from tile coords to world coords at the same time
            var ex = path[i + 1].x;
            var ey = path[i + 1].y;
            tweens.push({
                x: ex * this.map.tileWidth,
                y: ey * this.map.tileHeight,
                duration: this.speed
            });
            
        }
        // Run the animation
        this.parent.tweens.chain({
            targets: this,
            tweens: tweens
        });
    }
}