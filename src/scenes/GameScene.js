import Phaser from "phaser";

export default class GameScene extends Phaser.Scene {
  constructor() {
    super("game-scene");
  }

  init() {
    this.halfWidth = this.scale.width / 2
    this.halfHeight = this.scale.height / 2 
    this.player = undefined
    this.enemies = undefined
    this.startGame = false
  }

  preload() {
    this.load.spritesheet("knight", "images/knight.png", { frameWidth: 90, frameHeight: 100 })
    this.load.spritesheet("enemy", "images/enemy.png", { frameWidth: 15.25, frameHeight: 14.67 })
    this.load.spritesheet("boss", "images/boss.png", { frameWidth: 30.75 })
    this.load.image("start-btn", "images/start.png")
  }

  create() {
    let start_button = this.add.image(this.halfWidth, this.halfHeight + 125, `start-btn`).setScale(2.5).setInteractive()
    start_button.on(`pointerdown`, () => {
      this.gameStart()
      start_button.destroy()
    }, this)
  }

  update(time) {

  }

  gameStart() {
    this.startGame = true

  }

  spawnEnemy() {

  }
}
