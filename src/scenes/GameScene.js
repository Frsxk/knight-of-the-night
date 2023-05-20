import Phaser from "phaser";
import EnemyPhysics from "../addons/EnemyPhysics";
import Label from "../addons/TextLabel";

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
    this.title = undefined
    this.cursors = this.input.keyboard.createCursorKeys()
    this.key = this.input.keyboard.addKeys('W, A, S, D')
    this.lastAttack = 0
    this.test = undefined
    this.killLabel = undefined
    this.enemy = undefined
    this.distance = undefined
    this.poppin = undefined
    this.life = undefined
    this.overlapTime = 0
    this.overlap = false
    this.boss = undefined
  }

  preload() {
    this.load.spritesheet("knight", "images/knight.png", { frameWidth: 90, frameHeight: 80 })
    this.load.spritesheet("enemy", "images/enemy.png", { frameWidth: 15.25, frameHeight: 14.66 })
    this.load.spritesheet("boss", "images/boss.png", { frameWidth: 30.75 })
    this.load.image("start-btn", "images/start.png")
    this.load.spritesheet("ui", "images/colored_tilemap.png", { frameWidth: 8, frameHeight: 8 })
    this.load.spritesheet("map", "images/tilemap.png", { frameWidth: 16, frameHeight: 17.16 })
    this.load.spritesheet("wall", "images/wallsheet.png", { frameWidth: 16, frameHeight: 17 })
    this.load.spritesheet("health", "images/health_bar.png", { frameWidth: 629, frameHeight: 146.66 })
  }

  create() {
    // background
    const background = this.add.tileSprite(this.halfWidth, this.halfHeight, 720, 680, `map`, 18).setScale(2)

    // game title
    const gameTitle = {
      fontSize: `48px`, color: `#a9adb7`, fontFamily: `Papyrus, fantasy`
    }
    this.title = this.add.text(this.halfWidth, 150, `Knight of The Night`, gameTitle)
    this.title.setX(this.halfWidth - this.title.width * 0.5)

    // start button
    let start_button = this.add.image(this.halfWidth, this.halfHeight + 125, `start-btn`).setScale(2.5).setInteractive()
    start_button.on(`pointerdown`, () => {
      this.gameStart()
      start_button.destroy()
    }, this)

    // game entities
    this.player = this.createPlayer()
    this.add.image(this.halfWidth + 185, this.halfHeight + 30, "ui", 121).setScale(3.4) // boss graveyard

    this.enemies = this.physics.add.group({
      classType: EnemyPhysics,
      maxSize: 10,
      runChildUpdate: true
    })

    this.time.addEvent({
      delay: Phaser.Math.Between(3000, 5000),
      callback: this.spawnEnemy,
      callbackScope: this,
      loop: true
    })

    // this.physics.add.overlap(this.player, this.enemies, this.startOverlap, undefined, this)
  }

  update(time) {
    if (this.startGame = true) {
      this.movePlayer(this.player, time)
    }
    this.physics.add.overlap(this.player, this.enemies, this.hitEnemy, undefined, this)

    this.updateOverlap()
  }

  gameStart() {
    this.startGame = true
    this.title.destroy()
    this.player.setActive(true)

    this.life = this.add.sprite(110, 60, `health`, 5).setScale(0.25).setDepth(10)

    this.poppin = this.add.text(this.halfWidth, 40, `0`, 
    { fontSize: `20px`, color: `#ffb8bf`, fontFamily: `Comic Sans MS, Comic Sans`, fontStyle: `italic` }
    )
    
    this.killLabel = this.createLabel(this.halfWidth, 16, 0)
    this.killLabel.add(0)
    this.popText(this.time)

    this.player.anims.play(`standby`, true)

    if (this.killLabel.getValue() == 100) {
      this.spawnBoss()
    }
  }

  createPlayer() {
    const player = this.physics.add.sprite(this.halfWidth - 180, this.halfHeight, "knight").setSize(90, 80).setScale(1.2).setCollideWorldBounds(true).setDepth(999).setOffset(50, 50)

    if (this.startGame = false) {
      return
    }

    this.anims.create({
      key: `standby`,
      frames: this.anims.generateFrameNumbers(`knight`, { start: 1, end: 4 }),
      frameRate: 10,
      repeat: -1
    })

    this.anims.create({
      key: `attack1`,
      frames: this.anims.generateFrameNumbers(`knight`, { start: 5, end: 10 }),
      frameRate: 10,
      repeat: -1
    })

    this.anims.create({
      key: `attack2`,
      frames: this.anims.generateFrameNumbers(`knight`, { start: 11, end: 15 }),
      frameRate: 10,
      repeat: -1
    })

    this.anims.create({
      key: `right`,
      frames: this.anims.generateFrameNumbers(`knight`, { start: 16, end: 19 }),
      frameRate: 10,
      
    })

    this.anims.create({
      key: `left`,
      frames: this.anims.generateFrameNumbers(`knight`, { start: 16, end: 19 }),
      frameRate: 10,
      
    })

    this.anims.create({
      key: `win`,
      frames: [{key: `knight`, frame: 0}]
    })

    return player
  }

  movePlayer(player, time) {
    if (this.startGame = false) {
      return
    }

    const speed = 150
    if (this.cursors.left.isDown || this.key.A.isDown) {
      this.player.setVelocity(-speed, 0)
      this.player.anims.play(`left`, true)
      this.player.setFlipX(true)
    } else if (this.cursors.right.isDown || this.key.D.isDown) {
      this.player.setVelocity(speed, 0)
      this.player.anims.play(`right`, true)
      this.player.setFlipX(false)
    } else if (this.cursors.up.isDown || this.key.W.isDown) {
      this.player.setVelocity(0, -speed)
      this.player.anims.play(`right`, true)
    } else if (this.cursors.down.isDown || this.key.S.isDown) {
      this.player.setVelocity(0, speed)
      this.player.anims.play(`right`, true)
    } else {
      this.player.setVelocity(0, 0)
      this.player.anims.play(`standby`, true)
    }

    if (this.cursors.space.isDown && time > this.lastAttack) {
      this.lastAttack = time + 150;
      // this.hitEnemy()
      this.playerAttack()
    }
  }

  hitEnemy(player, enemy) {
    if (this.startGame = false) {
      return
    }

    this.distance = Phaser.Math.Distance.Between(player.x, player.y, enemy.x, enemy.y);
    
    if (this.distance < 100 && this.cursors.space.isDown) {
      enemy.die()
      this.killLabel.add(1)
      this.popText(this.time)
    }
  }

  playerAttack() {
    const attackIndex = Math.floor(Math.random() * 2) + 1;
    if (attackIndex === 1) {
      this.player.anims.play(`attack1`, true)
    } else {
      this.player.anims.play(`attack2`, true)
    }
  }

  spawnEnemy() {
    if (this.startGame = false) {
      return
    }
    // let enemy = this.add.sprite(0, 0, `enemy`, enemyFrame)

    this.anims.create({
        key: `enemy1`,
        frames: this.anims.generateFrameNumbers(`enemy`, { start: 0, end: 7 }),
        frameRate: 10,
        repeat: -1
    })
    this.anims.create({
        key: `enemy2`,
        frames: this.anims.generateFrameNumbers(`enemy`, { start: 8, end: 15 }),
        frameRate: 10,
        repeat: -1
    })
    this.anims.create({
        key: `enemy3`,
        frames: this.anims.generateFrameNumbers(`enemy`, { start: 16, end: 23 }),
        frameRate: 10,
        repeat: -1
    })

    const config = {
      speed: 100,
      type: Phaser.Math.Between(0, 2) * 8,
      player: this.player,
    }

    this.enemy = this.enemies.get(0, 0, `enemy`, config).setScale(2.5).setDepth(5).setCollideWorldBounds(true)

    const enemyWidth = this.enemy.displayWidth
    const enemyHeight = this.enemy.displayHeight

    const posX = Phaser.Math.Between(enemyWidth, this.scale.width - enemyWidth)
    const posY = Phaser.Math.Between(enemyHeight, this.scale.height - enemyHeight)

    switch (this.enemy) {
      case 0:
        this.enemy.spawn(posX, 0)
        break;
      case 1:
        this.enemy.spawn(posX, this.scale.height)
        break;
      case 2:
        this.enemy.spawn(0, posY)
        break;
      case 3:
        this.enemy.spawn(this.scale.width, posY)
        break;
    }

    // this.enemies.add(enemy)
    // this.physics.moveToObject(enemy, this.player, config.speed)
    
    // let distanceX = this.player.x - enemy.y
    // let distanceY = this.player.y - enemy.y
    // let angle = Math.atan2(distanceY, distanceX)
    // enemy.setVelocityX(Math.cos(angle) * config.speed)
    // enemy.setVelocityY(Math.sin(angle) * config.speed)
  }

  spawnBoss() {
    this.boss = this.physics.add.sprite(this.halfWidth + 185, this.halfHeight + 30, `boss`, 0).setScale(2.5).setDepth(20).setCollideWorldBounds(true).setFlipX(true)

    this.anims.create({
      key: `bossanim`,
      frames: this.anims.generateFrameNumbers(`boss`, { start: 0, end: 7 }),
      frameRate: 10,
      repeat: -1,
    })

    this.boss.anims.play(`bossanim`, true)

    const angle = Phaser.Math.Angle.Between(this.boss.x, this.boss.y, this.player.x, this.player.y)
    this.boss.setVelocity(Math.cos(angle) * 100, Math.sin(angle) * 100)
  }

  createLabel(x, y, enemyKilled) {
    if (this.startGame = false) {
      return
    }

    const style = {
      fontSize: `20px`, color: `#ffb8bf`, fontFamily: `Comic Sans MS, Comic Sans`
    }
    const label = new Label(this, x, y, enemyKilled, style).setDepth(1)
    this.add.existing(label)

    return label
  }

  decreaseLife(player, enemy) {
    // this.distance = Phaser.Math.Distance.Between(player.x, player.y, enemy.x, enemy.y)
    let frame;

    enemy.die()
    frame = Number(this.life.frame.name)
    this.life.setFrame(frame - 1)
    

    if (frame == 0) {
      // game over
      this.scene.start(`game-over-scene`, this.killLabel.getValue())
    }
  }

  popText(time) {
    const style = {
      fontSize: `20px`, color: `#ffb8bf`, fontFamily: `Comic Sans MS, Comic Sans`, fontStyle: `italic`
    }

    this.poppin.setText(`Kill ${Math.floor(100 - this.killLabel.getValue())} more to spawn The Boss!`).setX(this.halfWidth - this.poppin.width * 0.5).setVisible(true).setActive(true)
    
    this.time.addEvent({
      delay: 2000,
      callback: () => { this.poppin.setVisible(false).setActive(false) },
      callbackScope: this
    })
  }

  startOverlap() {
    if (!this.overlap) {
      this.overlap = true
      this.overlapTime = this.time.now
    }
  }

  updateOverlap() {
    if (this.overlap) {
      let overlapDuration = this.time.now - Number(this.overlapTime)

      if (Number(this.overlapTime) >= 1000) {
        this.decreaseLife()
        this.overlap = false
        this.overlapTime = 0
      }
    }
  }
}
