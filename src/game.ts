
import Phaser from 'phaser'

type Marble = {
  color: number
  distance: number
}

const COLORS = [
  0x00eaff,
  0xff3cba,
  0x8b5cff,
  0x45ffc1,
  0xffcf45
]

class NeonScene extends Phaser.Scene {
  private marbles: Marble[] = []
  private pathPoints: Phaser.Math.Vector2[] = []
  private pathLengths: number[] = []
  private totalLength = 0
  private graphics!: Phaser.GameObjects.Graphics
  private scoreText!: Phaser.GameObjects.Text
  private bestScoreText!: Phaser.GameObjects.Text
private bestScore = 0
  private messageText!: Phaser.GameObjects.Text
  private score = 0
  private clearedMarbles = 0
private levelTarget = 30
  private speed = 32
  private spacing = 34
  private shooterX = 450
  private shooterY = 525
  private projectile: {
    x: number
    y: number
    vx: number
    vy: number
    color: number
  } | null = null

  private nextColor = COLORS[0]
  private gameOver = false
  private resultContainer!: Phaser.GameObjects.Container
private resultShown = false

  constructor() {
    super('NeonScene')
  }

  create() {
    // 重新开始时重置游戏数据
this.marbles = []
this.pathPoints = []
this.pathLengths = []
this.totalLength = 0

this.score = 0
this.clearedMarbles = 0
this.gameOver = false
this.resultShown = false
this.projectile = null


    this.cameras.main.setBackgroundColor('#080a18')

    this.pathPoints = [
  new Phaser.Math.Vector2(30, 100),
  new Phaser.Math.Vector2(180, 100),
  new Phaser.Math.Vector2(240, 170),
  new Phaser.Math.Vector2(240, 270),
  new Phaser.Math.Vector2(150, 330),
  new Phaser.Math.Vector2(80, 400),
  new Phaser.Math.Vector2(150, 480),
  new Phaser.Math.Vector2(330, 480),
  new Phaser.Math.Vector2(420, 410),
  new Phaser.Math.Vector2(420, 330),
  new Phaser.Math.Vector2(520, 270),
  new Phaser.Math.Vector2(680, 270),
  new Phaser.Math.Vector2(760, 340),
  new Phaser.Math.Vector2(760, 450),
  new Phaser.Math.Vector2(870, 500),
]

    this.pathLengths = [0]
    this.totalLength = 0

    for (let i = 1; i < this.pathPoints.length; i++) {
      this.totalLength += Phaser.Math.Distance.Between(
        this.pathPoints[i - 1].x,
        this.pathPoints[i - 1].y,
        this.pathPoints[i].x,
        this.pathPoints[i].y
      )
      this.pathLengths.push(this.totalLength)
    }

    this.graphics = this.add.graphics()

    this.scoreText = this.add.text(30, 25, 'SCORE  0', {
      fontFamily: 'Arial',
      fontSize: '23px',
      color: '#00eaff',
      fontStyle: 'bold'
    })
// 读取本地保存的历史最高分
this.bestScore = Number(
  localStorage.getItem('neonOrbBestScore') || 0
)

this.bestScoreText = this.add.text(
  30,
  55,
  `BEST  ${this.bestScore}`,
  {
    fontFamily: 'Arial',
    fontSize: '15px',
    color: '#ffd84d',
    fontStyle: 'bold'
  }
)
    this.add.text(870, 30, 'NEON ORB', {
      fontFamily: 'Arial',
      fontSize: '17px',
      color: '#9b85ff'
    }).setOrigin(1, 0)

    this.messageText = this.add.text(450, 75, 'MATCH 3 OR MORE!', {
      fontFamily: 'Arial',
      fontSize: '16px',
      color: '#ffffff'
    }).setOrigin(0.5)

    // 创建初始弹珠队列
    for (let i = 0; i < 17; i++) {
      this.marbles.push({
        color: Phaser.Utils.Array.GetRandom(COLORS),
        distance: i * this.spacing
      })
    }

    this.nextColor = Phaser.Utils.Array.GetRandom(COLORS)

    // 点击或触摸屏幕发射
    this.input.on('pointerdown', (pointer: Phaser.Input.Pointer) => {
      if (this.gameOver || this.projectile) return

      const angle = Phaser.Math.Angle.Between(
        this.shooterX,
        this.shooterY,
        pointer.worldX,
        pointer.worldY
      )

      this.projectile = {
        x: this.shooterX,
        y: this.shooterY,
        vx: Math.cos(angle) * 560,
        vy: Math.sin(angle) * 560,
        color: this.nextColor
      }

      this.nextColor = Phaser.Utils.Array.GetRandom(COLORS)
    })

    this.add.text(450, 575, '点击屏幕瞄准并发射', {
      fontFamily: 'Arial',
      fontSize: '13px',
      color: '#777f9e'
    }).setOrigin(0.5)
  }

  private getPosition(distance: number) {
    const d = Phaser.Math.Clamp(distance, 0, this.totalLength)

    for (let i = 1; i < this.pathLengths.length; i++) {
      if (d <= this.pathLengths[i]) {
        const start = this.pathPoints[i - 1]
        const end = this.pathPoints[i]
        const segmentLength = this.pathLengths[i] - this.pathLengths[i - 1]
        const t = (d - this.pathLengths[i - 1]) / segmentLength

        return new Phaser.Math.Vector2(
          Phaser.Math.Linear(start.x, end.x, t),
          Phaser.Math.Linear(start.y, end.y, t)
        )
      }
    }

    return this.pathPoints[this.pathPoints.length - 1].clone()
  }

  
private createExplosion(startIndex: number, count: number) {

  // 连击文字提示
  const firstMarble = this.marbles[startIndex]

  if (firstMarble) {
    const pos = this.getPosition(firstMarble.distance)

    const comboText = this.add.text(
      pos.x,
      pos.y - 25,
      `COMBO x${count}`,
      {
        fontFamily: 'Arial',
        fontSize: '24px',
        fontStyle: 'bold',
        color: '#ffffff',
        stroke: '#00eaff',
        strokeThickness: 5
      }
    )

    comboText.setOrigin(0.5)
    comboText.setDepth(100)

    this.tweens.add({
      targets: comboText,
      y: pos.y - 90,
      alpha: 0,
      scale: 1.4,
      duration: 700,
      ease: 'Cubic.Out',
      onComplete: () => comboText.destroy()
    })
  }

  for (let i = startIndex; i < startIndex + count; i++) {
    const marble = this.marbles[i]
    if (!marble) continue

    const pos = this.getPosition(marble.distance)
    const color = marble.color

    // 中心闪光
    const flash = this.add.circle(
      pos.x, pos.y, 18, 0xffffff, 0.9
    )

    this.tweens.add({
      targets: flash,
      scale: 2.5,
      alpha: 0,
      duration: 180,
      onComplete: () => flash.destroy()
    })

    // 霓虹扩散光圈
    const ring = this.add.circle(pos.x, pos.y, 12)
    ring.setStrokeStyle(3, color, 1)

    this.tweens.add({
      targets: ring,
      scale: 3.5,
      alpha: 0,
      duration: 350,
      onComplete: () => ring.destroy()
    })

    // 彩色粒子向四周飞散
    for (let j = 0; j < 8; j++) {
      const angle = (Math.PI * 2 * j) / 8
      const distance = Phaser.Math.Between(30, 65)

      const particle = this.add.circle(
        pos.x,
        pos.y,
        Phaser.Math.Between(2, 4),
        color,
        1
      )

      this.tweens.add({
        targets: particle,
        x: pos.x + Math.cos(angle) * distance,
        y: pos.y + Math.sin(angle) * distance,
        alpha: 0,
        scale: 0.2,
        duration: Phaser.Math.Between(250, 450),
        ease: 'Cubic.Out',
        onComplete: () => particle.destroy()
      })
    }
  }

  // 轻微屏幕震动
  this.cameras.main.shake(90, 0.002)
}


private showVictoryPanel() {
  if (this.resultShown) return

  this.resultShown = true

  const centerX = 450
  const centerY = 300

  // 半透明暗色背景
  const overlay = this.add.rectangle(
    centerX,
    centerY,
    900,
    600,
    0x020617,
    0.82
  )

  overlay.setDepth(100)

  // 结算面板主体
  const panel = this.add.rectangle(
    centerX,
    centerY,
    520,
    360,
    0x09182d,
    1
  )

  panel.setStrokeStyle(3, 0x00eaff, 1)
  panel.setDepth(101)

  // 通关标题
  const title = this.add.text(
    centerX,
    190,
    'LEVEL COMPLETE!',
    {
      fontFamily: 'Arial',
      fontSize: '38px',
      fontStyle: 'bold',
      color: '#00eaff',
      stroke: '#004466',
      strokeThickness: 4
    }
  )

  title.setOrigin(0.5)
  title.setDepth(102)

  // 星星评价
  const stars = this.add.text(
    centerX,
    270,
    '★  ★  ★',
    {
      fontFamily: 'Arial',
      fontSize: '55px',
      color: '#ffd84d',
      stroke: '#a85d00',
      strokeThickness: 3
    }
  )

  stars.setOrigin(0.5)
  stars.setDepth(102)

  // 最终分数
  const finalScore = this.add.text(
    centerX,
    345,
    `FINAL SCORE  ${this.score}`,
    {
      fontFamily: 'Arial',
      fontSize: '25px',
      fontStyle: 'bold',
      color: '#ffffff'
    }
  )

  finalScore.setOrigin(0.5)
  finalScore.setDepth(102)

  // REPLAY 按钮背景
  const replayButton = this.add.rectangle(
    centerX,
    410,
    190,
    52,
    0x062d45,
    1
  )

  replayButton.setStrokeStyle(2, 0x00eaff)
  replayButton.setDepth(102)
  replayButton.setInteractive({ useHandCursor: true })

  // REPLAY 按钮文字
  const replayText = this.add.text(
    centerX,
    410,
    'REPLAY',
    {
      fontFamily: 'Arial',
      fontSize: '21px',
      fontStyle: 'bold',
      color: '#00eaff'
    }
  )

  replayText.setOrigin(0.5)
  replayText.setDepth(103)

  // 点击重新开始
  replayButton.on('pointerdown', () => {
    this.scene.restart()
  })

  // 鼠标悬停效果
  replayButton.on('pointerover', () => {
    replayButton.setFillStyle(0x005477)
    replayText.setColor('#ffffff')
  })

  replayButton.on('pointerout', () => {
    replayButton.setFillStyle(0x062d45)
    replayText.setColor('#00eaff')
  })

  // 所有面板元素放进容器
  this.resultContainer = this.add.container(
    0,
    0,
    [overlay, panel, title, stars, finalScore]
  )

  this.resultContainer.setDepth(100)

  // 面板弹出动画
  this.resultContainer.setScale(0.7)
  this.resultContainer.setAlpha(0)

  this.tweens.add({
    targets: this.resultContainer,
    scale: 1,
    alpha: 1,
    duration: 400,
    ease: 'Back.Out'
  })
}

private insertMarble(index: number, color: number) {
  const target = this.marbles[index]
  if (!target) return

  const newDistance = target.distance

  for (let i = index; i < this.marbles.length; i++) {
    this.marbles[i].distance += this.spacing
  }

  this.marbles.splice(index, 0, {
    color,
    distance: newDistance
  })

  let left = index
  let right = index

  while (left > 0 && this.marbles[left - 1].color === color) {
    left--
  }

  while (right < this.marbles.length - 1 && this.marbles[right + 1].color === color) {
    right++
  }

  let count = right - left + 1

  if (count < 3) {
    this.messageText.setText('KEEP MATCHING!')
    return
  }

  let combo = 0
  let totalScore = 0

  while (count >= 3) {
    this.createExplosion(left, count)
    this.marbles.splice(left, count)

    for (let i = left; i < this.marbles.length; i++) {
      this.marbles[i].distance -= count * this.spacing
    }

    combo++
    this.clearedMarbles += count

    const reward = count * 100 * combo
    totalScore += reward

    if (left <= 0 || left >= this.marbles.length) {
      break
    }

    const joinedColor = this.marbles[left].color

    if (this.marbles[left - 1].color !== joinedColor) {
      break
    }

    let newLeft = left
    let newRight = left

    while (newLeft > 0 && this.marbles[newLeft - 1].color === joinedColor) {
      newLeft--
    }

    while (newRight < this.marbles.length - 1 && this.marbles[newRight + 1].color === joinedColor) {
      newRight++
    }

    left = newLeft
    right = newRight
    count = right - left + 1
  }

  this.score += totalScore
// 如果当前分数超过历史最高分，则保存
if (this.score > this.bestScore) {
  this.bestScore = this.score

  localStorage.setItem(
    'neonOrbBestScore',
    String(this.bestScore)
  )

  this.bestScoreText.setText(
    `BEST  ${this.bestScore}`
  )
}
  this.scoreText.setText(
    `SCORE  ${this.score}     CLEARED  ${this.clearedMarbles} / ${this.levelTarget}`
  )

  if (this.clearedMarbles >= this.levelTarget) {
  this.gameOver = true
  this.messageText.setText('')
  this.showVictoryPanel()
  return
}

  if (combo >= 3) {
    this.messageText.setText(`AMAZING! x${combo}  +${totalScore}`)
  } else if (combo === 2) {
    this.messageText.setText(`COMBO x2! +${totalScore}`)
  } else {
    this.messageText.setText(`NICE! +${totalScore}`)
  }

  this.messageText.setAlpha(1)

  this.tweens.add({
    targets: this.messageText,
    scale: 1.25,
    duration: 150,
    yoyo: true,
    repeat: 1
  })
}



  update(_: number, delta: number) {
    const dt = Math.min(delta / 1000, 0.04)

    if (this.gameOver) return

    // 弹珠队列前进
    for (const marble of this.marbles) {
      marble.distance += this.speed * dt
    }

    // 判断是否到达终点
    if (this.marbles.some(m => m.distance >= this.totalLength)) {
      this.gameOver = true
      this.messageText.setText('GAME OVER')
      this.messageText.setColor('#ff3cba')
    }

    
    // 更新飞行中的弹珠
    if (this.projectile) {
      const p = this.projectile



      p.x += p.vx * dt
      p.y += p.vy * dt

      let hitIndex = -1
      let minDistance = Infinity

      // 检测弹珠与轨道弹珠的碰撞
      for (let i = 0; i < this.marbles.length; i++) {
        const position = this.getPosition(this.marbles[i].distance)

        const distance = Phaser.Math.Distance.Between(
          p.x,
          p.y,
          position.x,
          position.y
        )

        // 只选择最近的碰撞目标
        if (distance < 25 && distance < minDistance) {
          minDistance = distance
          hitIndex = i
        }
      }

      // 命中弹珠
      if (hitIndex >= 0) {
        this.insertMarble(hitIndex, p.color)
        this.projectile = null
      }

      // 超出游戏区域
      else if (
        p.x < -30 ||
        p.x > 930 ||
        p.y < -30 ||
        p.y > 630
      ) {
        this.projectile = null
      }
    }


    this.drawGame()
  }

  private drawGame() {
    const g = this.graphics
    g.clear()

    // 绘制霓虹轨道
    g.lineStyle(24, 0x182040, 1)
    g.beginPath()
    g.moveTo(this.pathPoints[0].x, this.pathPoints[0].y)

    for (const point of this.pathPoints.slice(1)) {
      g.lineTo(point.x, point.y)
    }
    g.strokePath()

    g.lineStyle(2, 0x00eaff, 0.55)
    g.beginPath()
    g.moveTo(this.pathPoints[0].x, this.pathPoints[0].y)

    for (const point of this.pathPoints.slice(1)) {
      g.lineTo(point.x, point.y)
    }
    g.strokePath()

    // 绘制弹珠
    for (const marble of this.marbles) {
      const pos = this.getPosition(marble.distance)

      g.fillStyle(marble.color, 0.2)
      g.fillCircle(pos.x, pos.y, 22)

      g.fillStyle(marble.color, 1)
      g.fillCircle(pos.x, pos.y, 14)

      g.fillStyle(0xffffff, 0.8)
      g.fillCircle(pos.x - 5, pos.y - 5, 4)
    }

    // 绘制激光瞄准辅助线
    const pointer = this.input.activePointer

    const aimAngle = Phaser.Math.Angle.Between(
      this.shooterX,
      this.shooterY,
      pointer.worldX,
      pointer.worldY
    )

    // 限制瞄准线长度
    const aimLength = 180

    const endX = this.shooterX + Math.cos(aimAngle) * aimLength
    const endY = this.shooterY + Math.sin(aimAngle) * aimLength

    // 绘制虚线激光
    for (let i = 0; i < 12; i++) {
      const start = i / 12
      const end = (i + 0.5) / 12

      g.lineStyle(2, 0x00eaff, 0.75 - start * 0.4)

      g.lineBetween(
        this.shooterX + (endX - this.shooterX) * start,
        this.shooterY + (endY - this.shooterY) * start,
        this.shooterX + (endX - this.shooterX) * end,
        this.shooterY + (endY - this.shooterY) * end
      )
    }

    // 绘制发射器
    g.fillStyle(0x252c55, 1)
    g.fillCircle(this.shooterX, this.shooterY, 34)

    g.lineStyle(3, 0x00eaff, 1)
    g.strokeCircle(this.shooterX, this.shooterY, 34)

    g.fillStyle(this.nextColor, 1)
    g.fillCircle(this.shooterX, this.shooterY, 15)

    // 绘制飞行弹珠
    if (this.projectile) {
      g.fillStyle(this.projectile.color, 0.25)
      g.fillCircle(this.projectile.x, this.projectile.y, 22)

      g.fillStyle(this.projectile.color, 1)
      g.fillCircle(this.projectile.x, this.projectile.y, 14)
    }
  }
}

export function startGame(parent: HTMLElement) {
  return new Phaser.Game({
    type: Phaser.AUTO,
    parent,
    width: 900,
    height: 600,
    backgroundColor: '#080a18',
    scale: {
      mode: Phaser.Scale.FIT,
      autoCenter: Phaser.Scale.CENTER_BOTH
    },
    scene: NeonScene,
    render: {
      antialias: true,
      pixelArt: false
    }
  })
}
