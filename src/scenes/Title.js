class Title extends Phaser.Scene {
    constructor() {
        super('titleScene')
    }

    create() {
        // running checks
        console.log('%cTITLE SCENE :^)', testColor)
        // moving through
        // Starting on the Start Game Button
        this.START_GAME = 0
        this.CONTROLS = 1
        this.CREDITS = 2
        this.SELECTION = 0
        this.CURRENT_ROOM = this.START_GAME
        //this.scene.start('itemShopScene')
        this.splash = this.add.sprite(0, 0, 'mainMenu0PNG').setOrigin(0)

        this.menuSound = this.sound.add('menu_choice')
        this.menuSelectSound = this.sound.add("buy_item")
    }

    update() {
        // press start, allows audio
        if (Phaser.Input.Keyboard.JustDown(DOWN)) {
            if (this.SELECTION < 2) {
                this.SELECTION++
                this.menuSound.play({ volume: 0.35 })
                this.splash.setTexture("mainMenu" + this.SELECTION + "PNG")
            }
        }
        if (Phaser.Input.Keyboard.JustDown(UP)) {
            if (this.SELECTION > 0) {
                this.SELECTION--
                this.menuSound.play({ volume: 0.35 })
                this.splash.setTexture("mainMenu" + this.SELECTION + "PNG")
            }
        }
        if (Phaser.Input.Keyboard.JustDown(START) || Phaser.Input.Keyboard.JustDown(A)) {
            if (this.CURRENT_ROOM == this.START_GAME) {
                switch (this.SELECTION) {
                    case this.START_GAME:
                        this.scene.start("itemShopScene")
                        break
                    case this.CONTROLS:
                        // TODO: SHOW CONTROLS TEXTURE
                        this.splash.setTexture('controlsPNG')
                        this.menuSound.play({ volume: 0.35 })
                        this.CURRENT_ROOM = this.CONTROLS
                        break
                    case this.CREDITS:
                        this.CURRENT_ROOM = this.CREDITS
                        this.menuSound.play({ volume: 0.35 })
                        // TODO: SHOW CREDITS TEXTURE
                        break
                }
            }
            else if (this.CURRENT_ROOM == this.CONTROLS) {
                this.CURRENT_ROOM = this.START_GAME
                this.splash.setTexture("mainMenu" + this.SELECTION + "PNG")
                this.menuSound.play({ volume: 0.35 })
            }
            else if (this.CURRENT_ROOM == this.CREDITS) {
                this.CURRENT_ROOM = this.START_GAME
                this.splash.setTexture("mainMenu" + this.SELECTION + "PNG")
                this.menuSound.play({ volume: 0.35 })
            }
        }
        if (Phaser.Input.Keyboard.JustDown(B)) {
            if (this.CURRENT_ROOM == this.CONTROLS) {
                this.CURRENT_ROOM = this.START_GAME
                this.splash.setTexture("mainMenu" + this.SELECTION + "PNG")
                this.menuSound.play({ volume: 0.35 })
            }
            else if (this.CURRENT_ROOM == this.CREDITS) {
                this.CURRENT_ROOM = this.START_GAME
                this.splash.setTexture("mainMenu" + this.SELECTION + "PNG")
                this.menuSound.play({ volume: 0.35 })
            }
        }

    }
}