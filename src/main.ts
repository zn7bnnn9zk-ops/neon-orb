
import './style.css'
import { startGame } from './game'

const app = document.querySelector<HTMLDivElement>('#app')!

let currentLang: 'en' | 'zh' = 'en'

const translations = {
  en: {
    navHome: 'HOME',
    navFeatures: 'FEATURES',
    navAbout: 'ABOUT',
    eyebrow: 'A NEW ARCADE EXPERIENCE',
    headline: 'LIGHT UP',
    headlineSecond: 'YOUR WORLD.',
    subtitle: 'Aim. Shoot. Match.',
    description: 'Enter the neon universe and challenge yourself.',
    play: 'PLAY NOW',
    status: 'FREE TO PLAY · NO DOWNLOAD REQUIRED',
    featuresTitle: 'THE GAME EXPERIENCE',
    shootTitle: 'SHOOT',
    shootText: 'Aim carefully and launch colorful marbles.',
    matchTitle: 'MATCH',
    matchText: 'Connect matching colors and trigger chain reactions.',
    challengeTitle: 'CHALLENGE',
    challengeText: 'Beat your score and unlock new levels.',
    aboutTitle: 'ENTER THE NEON UNIVERSE',
    aboutText: 'A simple, relaxing and exciting arcade puzzle experience.',
    levelsTitle: 'EXPLORE THE LEVELS',
levelOne: 'LEVEL 01',
levelOneText: 'The beginning of your neon adventure.',
levelTwo: 'LEVEL 02',
levelTwoText: 'More marbles. More challenges.',
levelThree: 'COMING SOON',
leaderboardTitle: 'TOP PLAYERS',
rank: 'RANK',
player: 'PLAYER',
scoreLabel: 'SCORE',
    footer: 'BUILT FOR THE LOVE OF GAMES',
    gameTitle: 'NEON MARBLE',
    gameSubtitle: 'AIM · SHOOT · MATCH',
    back: '← BACK HOME',
    version: 'ARCADE V1.0'
  },
  zh: {
    navHome: '首页',
    navFeatures: '游戏特色',
    navAbout: '关于游戏',
    eyebrow: '全新的街机游戏体验',
    headline: '点亮你的',
    headlineSecond: '霓虹世界。',
    subtitle: '瞄准 · 发射 · 匹配',
    description: '进入霓虹宇宙，挑战你的反应与策略。',
    play: '开始游戏',
    status: '免费游玩 · 无需下载安装',
    featuresTitle: '游戏特色',
    shootTitle: '发射',
    shootText: '精准瞄准，发射彩色弹珠。',
    matchTitle: '消除',
    matchText: '连接相同颜色，触发连锁消除。',
    challengeTitle: '挑战',
    challengeText: '挑战更高分数，解锁更多关卡。',
    aboutTitle: '进入霓虹宇宙',
    aboutText: '简单、解压又充满挑战的街机益智游戏。',
    levelsTitle: '探索游戏关卡',
levelOne: '第一关',
levelOneText: '霓虹冒险，从这里开始。',
levelTwo: '第二关',
levelTwoText: '更多弹珠，更多挑战。',
levelThree: '即将开放',
leaderboardTitle: '玩家排行榜',
rank: '排名',
player: '玩家',
scoreLabel: '分数',
    footer: '为热爱游戏的人而打造',
    gameTitle: '霓虹弹珠',
    gameSubtitle: '瞄准 · 发射 · 消除',
    back: '← 返回首页',
    version: '街机版本 V1.0'
  }
}

function renderHome() {
  const t = translations[currentLang]

  app.innerHTML = `

    <main class="page" id="home">
      <div class="ambient ambient-one"></div>
      <div class="ambient ambient-two"></div>

      <header class="header">
        <a class="logo" href="#home">
          <span class="logo-icon">✦</span>
          NEON <span>ORB</span>
        </a>

        <nav class="main-nav">
          <a href="#home">${t.navHome}</a>
          <a href="#features">${t.navFeatures}</a>
          <a href="#about">${t.navAbout}</a>
        </nav>

        <div class="header-actions">
          <button class="language-button" id="languageButton">
            ${currentLang === 'en' ? '中文' : 'EN'}
          </button>
          <div class="header-tag">ARCADE · PUZZLE</div>
        </div>
      </header>

      <section class="hero">
        <div class="eyebrow">
          <span class="status-dot"></span>
          ${t.eyebrow}
        </div>

        <h1>
          ${t.headline}<br />
          <span>${t.headlineSecond}</span>
        </h1>

        <p class="subtitle">
          ${t.subtitle}<br />
          ${t.description}
        </p>

        <div class="orb-stage">
          <div class="orbit orbit-one"></div>
          <div class="orbit orbit-two"></div>
          <div class="main-orb"></div>
          <div class="small-orb orb-pink"></div>
          <div class="small-orb orb-blue"></div>
          <div class="small-orb orb-green"></div>
        </div>

        <button class="play-button" id="playButton">
          <span>▶</span> ${t.play}
        </button>

        <div class="game-status">${t.status}</div>
      </section>

      <section class="features-section" id="features">
        <div class="section-heading">
          <span class="section-label">01 / EXPERIENCE</span>
          <h2>${t.featuresTitle}</h2>
        </div>

        <div class="features">
          <article class="feature">
            <span>01</span>
            <h3>${t.shootTitle}</h3>
            <p>${t.shootText}</p>
          </article>

          <article class="feature">
            <span>02</span>
            <h3>${t.matchTitle}</h3>
            <p>${t.matchText}</p>
          </article>

          <article class="feature">
            <span>03</span>
            <h3>${t.challengeTitle}</h3>
            <p>${t.challengeText}</p>
          </article>
        </div>
      </section>

      <section class="about-section" id="about">
        <span class="section-label">02 / NEON ORB</span>
        <h2>${t.aboutTitle}</h2>
        <p>${t.aboutText}</p>
        <button class="play-button secondary-play" id="aboutPlayButton">
          ▶ ${t.play}
        </button>
      </section>
<section class="levels-section" id="levels">
  <div class="section-heading">
    <span class="section-label">03 / ADVENTURE</span>
    <h2>${t.levelsTitle}</h2>
  </div>

  <div class="level-grid">
    <article class="level-card active-level">
      <span class="level-number">01</span>
      <div class="level-orb cyan-orb"></div>
      <h3>${t.levelOne}</h3>
      <p>${t.levelOneText}</p>
      <span class="level-status">AVAILABLE</span>
    </article>

    <article class="level-card active-level">
      <span class="level-number">02</span>
      <div class="level-orb purple-orb"></div>
      <h3>${t.levelTwo}</h3>
      <p>${t.levelTwoText}</p>
      <span class="level-status">IN DEVELOPMENT</span>
    </article>

    <article class="level-card locked-level">
      <span class="level-number">03</span>
      <div class="level-orb pink-orb"></div>
      <h3>${t.levelThree}</h3>
      <p>MORE ADVENTURES AWAIT</p>
      <span class="level-status">COMING SOON</span>
    </article>
  </div>
</section>

<section class="leaderboard-section" id="leaderboard">
  <div class="section-heading">
    <span class="section-label">04 / COMPETITION</span>
    <h2>${t.leaderboardTitle}</h2>
  </div>

  <div class="leaderboard">
    <div class="leaderboard-row leaderboard-head">
      <span>${t.rank}</span>
      <span>${t.player}</span>
      <span>${t.scoreLabel}</span>
    </div>

    <div class="leaderboard-row">
  <span class="rank-gold">01</span>
  <span>LOCAL PLAYER</span>
  <strong id="local-best-score">0</strong>
</div>

<div class="leaderboard-row">
  <span class="rank-silver">02</span>
  <span>ONLINE RANKING</span>
  <strong>COMING SOON</strong>
</div>

<div class="leaderboard-row">
  <span class="rank-bronze">03</span>
  <span>GLOBAL PLAYERS</span>
  <strong>COMING SOON</strong>
</div>
  </div>

  <p class="leaderboard-note">DEMO DATA · ONLINE RANKING COMING SOON</p>
</section>
      <footer>
        <span>NEON ORB © 2026</span>
        <span>${t.footer}</span>
      </footer>
    </main>
  `
  const bestScore = Number(
    localStorage.getItem('neonOrbBestScore') || 0
  )

  const bestScoreElement = document.querySelector(
    '#local-best-score'
  ) as HTMLElement | null

  if (bestScoreElement) {
    bestScoreElement.textContent = bestScore.toLocaleString()
  }
  // 语言切换
  document.querySelector<HTMLButtonElement>('#languageButton')
    ?.addEventListener('click', () => {
      currentLang = currentLang === 'en' ? 'zh' : 'en'
      renderHome()
    })

  // 开始游戏
  document.querySelector<HTMLButtonElement>('#playButton')
    ?.addEventListener('click', renderGame)

  document.querySelector<HTMLButtonElement>('#aboutPlayButton')
    ?.addEventListener('click', renderGame)
}

function renderGame() {
  const t = translations[currentLang]

  app.innerHTML = `
    <main class="game-page">
      <header class="game-header">
        <button id="backButton">${t.back}</button>
        <div class="game-logo">NEON <span>ORB</span></div>
        <div class="game-version">${t.version}</div>
      </header>

      <section class="game-panel">
        <h1>${t.gameTitle}</h1>
        <p>${t.gameSubtitle}</p>
        <div id="game-container"></div>
      </section>
    </main>
  `

  startGame(document.querySelector('#game-container')!)

  document.querySelector<HTMLButtonElement>('#backButton')
    ?.addEventListener('click', () => {
      window.location.reload()
    })
}

renderHome()
