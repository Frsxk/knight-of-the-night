import Phaser from "phaser";

export default class Label extends Phaser.GameObjects.Text {
    constructor (scene, x, y, enemykilled, style) {
        super(scene, x, y, enemykilled, style)
        this.killCount = enemykilled
    }

    setValue(value) {
        let my;
        if (this.killCount <= 1) {
            my = `enemy`
        } else {
            my = `enemies`
        }
        this.killCount = value
        this.setText(`${this.killCount} ${my} killed`)
    }

    getValue() {
        return this.killCount
    }

    add(kills) {
        this.setValue(this.killCount + kills)
        this.setX(360 - this.width * 0.5)
    }
}