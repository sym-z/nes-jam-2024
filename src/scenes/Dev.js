class Dev extends Phaser.Scene {
    constructor() {
        super({ key: 'devScene', active: true })
    }

    create() {
        // running checks
        console.log('%cDEV SCENE :^)', testColor)
        this.devLog()

        // ----------------------------------------------------------------------------- DATA SETUP
        // player data config
            // room (updated each time a room is completed) (not at new scene, but before scene start)
            // level (updated to room every time player returns to item shop without being killed)
            // items (updated upon purchasing/finding (riches))
            // upgrades (player build, updated upon purchase (unlocked on *completion* of landmark levels))
            // riches (updated + upon enemy drop, updated - upon death)
        // notes on upgrades (arrays in arrays)
            // UPGRADES = [['name 1', 23], ['name 2', 73]]
            // magical attacks are at first, attacks with extra damage and that heal you slightly then are upgraded (sickness, paralyze, etc)
            // attack (points dealt on attack), defense (points dealt to you on attack), hp (amnt points), mana heal amnt (better word pls)
            // mana (amnt that can be spend on magical attacks), ___ (rate at which player heals), ___ (rate at which mana is restored)
            // magical attack: sickness (poison damage), paralyze (slows enemy), freeze (stops enemy briefly), charm (enemy attack lowered)
            // stretch: crit chance, crit damage percent
        // src = https://www.dynetisgames.com/2018/10/28/how-save-load-player-progress-localstorage/
        // src = https://www.geeksforgeeks.org/how-to-store-an-array-in-localstorage/
        if (localStorage.getItem('level') != null) {
            // level needs to be stored, room does not. if player closes game, they will spawn at their level, not room
            LEVEL = parseInt(localStorage.getItem('level'))
        } else { LEVEL = 0 }
        if (localStorage.getItem('riches') != null) {
            RICHES = parseInt(localStorage.getItem('riches'))
        } else { RICHES = 0 }
        if (localStorage.getItem('items') != null) {
            ITEMS = JSON.parse(localStorage.getItem('items'))
        } else { ITEMS = [] }
        if (localStorage.getItem('upgrades') != null) {
            UPGRADES = JSON.parse(localStorage.getItem('upgrades'))
        } else { UPGRADES = [] }
        this.playerLog()

        // -------------------------------------------------------------------------------- DISPLAY
        // dev ui
        this.devUI = this.add.text(centerX, tileSize*3, 'level: ' + LEVEL + ' riches: ' + RICHES, { fontSize: 8 }).setOrigin(.5, 0)
        // connect to game
        // src = https://labs.phaser.io/edit.html?src=src%5Cscenes%5Cui%20scene.js
        this.itemShop = this.scene.get('itemShopScene')
        this.room = this.scene.get('roomScene')
        // level
        this.itemShop.events.on('addLevel', function () {
            localStorage.setItem('level', LEVEL.toString())
            this.devUI.setText('level: ' + LEVEL + ' riches: ' + RICHES)
        }, this)
        // riches
        this.room.events.on('addRiches', function () {
            localStorage.setItem('riches', RICHES.toString())
            this.devUI.setText('level: ' + LEVEL + ' riches: ' + RICHES)
        }, this)
        // items
        this.itemShop.events.on('addItem', function () {
            localStorage.setItem('items', JSON.stringify(ITEMS))
        })
        this.room.events.on('addItem', function () {
            localStorage.setItem('items', JSON.stringify(ITEMS))
        })
        // upgrades
        this.room.events.on('addUpgrade', function () {
            localStorage.setItem('upgrades', JSON.stringify(UPGRADES))
        })
    }

    update() {
        // clear local storage
        if (cursors.shift.isDown && Phaser.Input.Keyboard.JustDown(cursors.space)) { localStorage.clear() }
    }

    playerLog() {
        // console log all saved player info
        console.log(`%cLEVEL: ${LEVEL}\nRICHES: ${RICHES}\nITEMS: ${JSON.stringify(ITEMS)}\nUPGRADES: ${JSON.stringify(UPGRADES)}`, goodColor + ' ' + logSize)
    }

    devLog() {
        console.log(`%cDEV TOOLS:\nSHIFT+UP: + riches\nSHIFT+DOWN: - riches\nSHIFT+LEFT: \nSHIFT+RIGHT: \nSHIFT+SPACE: clear local storage`, goodColor + ' ' + logSize)
        // Dev.js: local storage clear
        // Room.js: riches up, riches down
    }
}