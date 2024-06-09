class Dev extends Phaser.Scene {
    constructor() {
        super({ key: 'devScene', active: true })
    }

    create() {
        // running checks
        console.log('%cDEV SCENE :^)', testColor)

        // ----------------------------------------------------------------------------- DATA SETUP
        // player data config
            // floor (updated each time a floor is completed) (not at new scene, but before scene start)
            // level (updated to floor every time player returns to item shop without being killed)
            // items (updated upon purchasing/finding)
            // upgrades (player build, updated upon purchase)
            // riches (updated + upon enemy drop, updated - upon death)
        // src = https://www.dynetisgames.com/2018/10/28/how-save-load-player-progress-localstorage/
        if (localStorage.getItem('level') != null && LEVEL != undefined) {
            localStorage.setItem('level', LEVEL.toString())
        } else { LEVEL = 0 }
        if (localStorage.getItem('riches') != null && RICHES != undefined) {
            localStorage.setItem('riches', RICHES.toString())
        } else { RICHES = 0 }

        // -------------------------------------------------------------------------------- DISPLAY
        // dev ui
        this.devUI = this.add.text(centerX, tileSize, 'level: ' + LEVEL + ' riches: ' + RICHES, { fontSize: 8 }).setOrigin(.5, 0)
        // connect to game
        // src = https://labs.phaser.io/edit.html?src=src%5Cscenes%5Cui%20scene.js
        this.itemShop = this.scene.get('itemShopScene')
        this.room = this.scene.get('roomScene')
        // level
        this.itemShop.events.on('addLevel', function () {
            console.log('here')
            localStorage.setItem('level', LEVEL.toString())
            this.devUI.setText('level: ' + LEVEL + ' riches: ' + RICHES)
        }, this)
        // riches
        this.room.events.on('addRiches', function () {
            localStorage.setItem('riches', RICHES.toString())
            this.devUI.setText('level: ' + LEVEL + ' riches: ' + RICHES)
        }, this)
    }
}