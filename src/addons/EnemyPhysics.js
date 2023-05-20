import Phaser from "phaser";

export default class EnemyPhysics extends Phaser.Physics.Arcade.Sprite {
    constructor(scene, x, y, texture, config) {
        super(scene, x, y, texture)

        this.scene = scene
        this.speed = config.speed
        this.enemyAnims = config.type
        this.player = config.player
    }

    spawn(x, y) {
        this.setPosition(x, y)
        this.anims.play(this.enemyAnims)

        this.setActive(true)
        this.setVisible(true)
    }

    die() {
        this.destroy()
    }

    update(time) {
        const angle = Phaser.Math.Angle.Between(this.x, this.y, this.player.x, this.player.y);
        this.setVelocity(Math.cos(angle) * this.speed, Math.sin(angle) * this.speed);

        if (this.body.velocity.x < 0) {
            this.setFlipX(true)
        } else {
            this.setFlipX(false)
        }

        // let distanceX = this.player.x - this.y
        // let distanceY = this.player.y - this.y
        // let angle = Math.atan2(distanceY, distanceX)
        // this.setVelocityX(Math.cos(angle) * this.speed)
        // this.setVelocityY(Math.sin(angle) * this.speed)
    }
}