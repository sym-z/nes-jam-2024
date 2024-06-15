class Enemy extends Phaser.Physics.Arcade.Sprite {
    constructor(scene, x, y) {
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
    }
}