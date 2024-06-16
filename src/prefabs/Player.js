class Player extends Phaser.Physics.Arcade.Sprite {
    constructor(scene, x, y) {
        super(scene, x, y, 'wiz')

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
        
        // attributes
        // This will be a multiplied into the move function,
            // The player moves (movementSpeed * 1 Tile) every input press.
        this.movementSpeed = 1
        // Where the player is in the castle
        this.room = 0;

        // This is the amount of additional hops that take place to offset the player
            // from the door when they enter the room
        this.transitionOffset = 3
    }
    set_room(room)
    {
        this.room = room;
    }
}