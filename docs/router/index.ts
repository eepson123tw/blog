import frontendRouter from './frontEnd'
import backendRouter from './backEnd'
import smallTalkRouter from './smallTalk'

export const nav = [
  { text: 'Home', link: '/' },
  { text: 'AboutMe', link: 'https://r3f.zeabur.app/portfolio' },
  { text: 'Categories', link: '/view/categories' },
  {
    text: 'FrontEnd',
    items: [
      { text: 'DOM', link: '/view/posts/dom' },
      { text: 'FrameWork-History', link: '/view/posts/frameWork' }
    ]
  }
]
export const sidebar = [
  { text: 'Intro', link: '/view/intro' },
  frontendRouter,
  backendRouter,
  smallTalkRouter
]
