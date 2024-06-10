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
            // items (updated upon purchasing/finding (riches))
            // upgrades (player build, updated upon purchase (unlocked on *completion* of landmark levels))
            // riches (updated + upon enemy drop, updated - upon death)
        // src = https://www.dynetisgames.com/2018/10/28/how-save-load-player-progress-localstorage/
        if (localStorage.getItem('level') != null) {
            // level needs to be stored, floor does not. if player closes game, they will spawn at their level, not floor
            LEVEL = parseInt(localStorage.getItem('level'))
        } else { LEVEL = 0 }
        if (localStorage.getItem('riches') != null) {
            RICHES = parseInt(localStorage.getItem('riches'))
        } else { RICHES = 0 }
        // items will need to inventory implementation
        // upgrades should be an array 
            // magical attacks are at first, attacks with extra damage and that heal you slightly then are upgraded (sickness, paralyze, etc)
            // attack (points dealt on attack), defense (points dealt to you on attack), hp (amnt points), mana heal amnt (better word pls)
            // mana (amnt that can be spend on magical attacks), ___ (rate at which player heals), ___ (rate at which mana is restored)
            // magical attack: sickness (poison damage), paralyze (slows enemy), freeze (stops enemy briefly), charm (enemy attack lowered)
            // stretch: crit chance, crit damage percent

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