class ItemShop extends Phaser.Scene {
    constructor() {
        super('itemShopScene')
    }

    create() {
        // running checks
        console.log('%cITEM SHOP SCENE :^)', testColor)

        this.cameras.main.setBackgroundColor('#00FF00') // background will display green temporarily or in case of error
    }

    update() {
        // moving on
        this.scene.start('roomScene')
    }
}