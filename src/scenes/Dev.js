class Dev extends Phaser.Scene {
    constructor() {
        super({ key: 'devScene', active: true })
    }

    init() {
        this.DEFAULTLEVEL = 0
        this.DEFAULTRICHES = 0
        this.DEFAULTUPGRADES = [["max HP", 15, 20], ["HP restore", 0, 1], ["max mana", 10, 15], ["mana restore", 0, 1], ["attack dmg", 1, 3], ["crit chance", 4, 7], ["crit dmg", 5, 7], ["magic heal", 1, 2], ["magic dmg", 3, 5], ["sickness", -1, 1], ["paralysis", -1, 1], ["charm", -1, 1], ["fear", -1, 1]]
    }

    create() {
        // running checks
        console.log('%cDEV SCENE :^)', testColor)
        this.devLog()

        // ----------------------------------------------------------------------------- DATA SETUP
        // player data config
            // room (updated each time a room is completed) (not at new scene, but before scene start)
            // level (updated to room every time player returns to item shop without being killed)
            // upgrades (player build, updated upon purchase (unlocked on *completion* of landmark levels))
            // riches (updated + upon enemy drop, updated - upon death)
        // note on upgrades (arrays in arrays)
            // UPGRADES = [['name 1', 23], ['name 2', 73]]
        // src = https://www.dynetisgames.com/2018/10/28/how-save-load-player-progress-localstorage/
        // src = https://www.geeksforgeeks.org/how-to-store-an-array-in-localstorage/
        if (localStorage.getItem('level') != null) { LEVEL = parseInt(localStorage.getItem('level'))
        } else { // level needs to be stored, room does not.
            LEVEL = this.DEFAULTLEVEL
            localStorage.setItem('level', LEVEL.toString())
        }
        if (localStorage.getItem('riches') != null) { RICHES = parseInt(localStorage.getItem('riches'))
        } else {
            RICHES = this.DEFAULTRICHES
            localStorage.setItem('riches', RICHES.toString())
        }
        if (localStorage.getItem('upgrades') != null) { UPGRADES = JSON.parse(localStorage.getItem('upgrades'))
        } else {
            UPGRADES = this.DEFAULTUPGRADES
            localStorage.setItem('upgrades', JSON.stringify(UPGRADES))
        }
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
        this.itemShop.events.on('takeRiches', function () {
            localStorage.setItem('riches', RICHES.toString())
            this.devUI.setText('level: ' + LEVEL + ' riches: ' + RICHES)
        }, this)
        // upgrades
        this.room.events.on('addUpgrade', function () {
            localStorage.setItem('upgrades', JSON.stringify(UPGRADES))
        })
    }

    update() {
        this.devDev()
    }

    // ---------------------------------------------------------------------- DEV TOOL TRANSPARENCY
    // console log all saved player info
    playerLog() { console.log(`%cLEVEL: ${LEVEL}\nRICHES: ${RICHES}\nUPGRADES: ${JSON.stringify(UPGRADES)}`, goodColor + ' ' + logSize) }
    // console log all dev tools
        // Dev.js: local storage clear, riches up, riches down
        // Room.js: riches up, riches down
    devLog() { console.log(`%cDEV TOOLS:\nSHIFT+UP: + riches\nSHIFT+DOWN: - riches\nSHIFT+LEFT: \nSHIFT+RIGHT: \nSHIFT+SPACE: clear local storage\n1-0+O,P: item shop upgrades\nSHIFT+?: console log player info`, goodColor + ' ' + logSize) }
    // dev scene tools
    devDev() {
        // clear local storage
        if (cursors.shift.isDown && Phaser.Input.Keyboard.JustDown(cursors.space)) {
            localStorage.clear()
            console.log('%clocal storage cleared by this cat ~(=^･･^)', badColor + " " + logSize)
            LEVEL = this.DEFAULTLEVEL; RICHES = this.DEFAULTLRICHES; UPGRADES = this.DEFAULTUPGRADES
            this.devUI.setText('level: ' + LEVEL + ' riches: ' + RICHES)
            this.playerLog()
        }
        // edit riches
        if (cursors.shift.isDown && Phaser.Input.Keyboard.JustDown(cursors.up)) {
            RICHES += 1
            localStorage.setItem('riches', RICHES.toString())
            this.devUI.setText('level: ' + LEVEL + ' riches: ' + RICHES)
        }
        if (cursors.shift.isDown && Phaser.Input.Keyboard.JustDown(cursors.down)) {
            RICHES -= 1
            localStorage.setItem('riches', RICHES.toString())
            this.devUI.setText('level: ' + LEVEL + ' riches: ' + RICHES)
        }
        // console log player info
        if (cursors.shift.isDown && Phaser.Input.Keyboard.JustDown(QUESTION)) { this.playerLog() }
    }
}