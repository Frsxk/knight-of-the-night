import Phaser from "phaser";
var replayButton;

export default class GameOverSCene extends Phaser.Scene {
    constructor() {
        super(`game-over-scene`)
    }

    init(data) {
        this.killcount = data.killcount
    }

    preload() {
        this.load.spritesheet("map", "images/tilemap.png", { frameWidth: 16, frameHeight: 17.16 })
        this.load.image(`gameover`, `images/gameover.png`);
        this.load.image("start-btn", "images/start.png")
    }

    create() {
        this.add.tileSprite(this.scale.width / 2, this.scale.height / 2, 720, 680, `map`, 18).setScale(2)
        this.add.image(this.scale.width / 2, 180, `gameover`)
        this.replayButton = this.add.image(this.scale.width / 2, this.scale.height / 2 + 125, `start-btn`).setScale(2.5).setInteractive()
        this.replayButton.once(`pointerup`, () => {
            this.scene.start(`game-scene`)
        }, this)

        // menampilkan kill count
        let text = this.add.text(this.scale.width / 2, 300, `You've Killed:\n${this.killcount} enemies`, { fontSize: `30px`, color: `#ffb8bf`, fontFamily: `Comic Sans MS, Comic Sans`, align: `center` })
        text.setX(this.scale.width / 2 - text.width * 0.5)
    }
}