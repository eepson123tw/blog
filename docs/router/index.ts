export const nav = [
  { text: 'Home', link: '/' },
  { text: 'About', link: '/view/about' },
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
  {
    text: 'FrontEnd',
    items: [
      { text: 'DOM到底是甚麼呢?', link: '/view/posts/dom' },
      { text: '前端與框架的關係', link: '/view/posts/frameWork' },
      { text: '實作一個可視區域導讀提醒', link: '/view/posts/frontend-003' },
      { text: '如何操作複雜的物件結構', link: '/view/posts/frontend-004' },
      { text: '網頁的效能指標及優化', link: '/view/posts/frontend-005' },
      { text: 'Type與Interface的差異', link: '/view/posts/frontend-006' },
      { text: '簡易函式封裝', link: '/view/posts/functional-programming' },
      { text: '記憶體布局', link: '/view/posts/memory-layouts' }
    ],
    collapsed: true
  },
  {
    text: 'BackEnd',
    items: [
      { text: 'JWT機制(JSON Web Tokens)', link: '/view/posts/jwt' },
      { text: 'Nginx', link: '/view/backend/nginx' }
    ],
    collapsed: true
  },
  {
    text: 'SmallTalk',
    items: [
      { text: '前端轉職很簡單?', link: '/view/posts/frontend-001' },
      { text: '轉職前端前，你可能會想知道?', link: '/view/posts/frontend-002' },
      { text: '面對複雜的需求時，應該...?', link: '/view/posts/frontend-007' },
      {
        text: 'ChatGPT 橫空出世，工程師該如何看待這現象?',
        link: '/view/posts/frontend-008'
      }
    ],
    collapsed: true
  }
]
