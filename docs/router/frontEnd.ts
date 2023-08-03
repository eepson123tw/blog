const frontendRouter = {
  text: 'FrontEnd',
  items: [
    { text: 'DOM到底是甚麼呢?', link: '/view/posts/dom' },
    { text: '前端與框架的關係', link: '/view/posts/frameWork' },
    { text: '實作一個可視區域導讀提醒', link: '/view/posts/frontend-003' },
    { text: '如何操作複雜的物件結構', link: '/view/posts/frontend-004' },
    { text: '網頁的效能指標及優化', link: '/view/posts/frontend-005' },
    { text: 'Type與Interface的差異', link: '/view/posts/frontend-006' },
    { text: '簡易函式封裝', link: '/view/posts/functional-programming' },
    { text: '記憶體布局', link: '/view/posts/memory-layouts' },
    {
      text: 'React學習筆記',
      items: [
        { text: 'React-001 啟程', link: '/view/posts/react/react-001' },
        {
          text: 'React-002 組件生成與傳參',
          link: '/view/posts/react/react-002'
        },
        {
          text: 'React-003 組件狀態與副作用更新',
          link: '/view/posts/react/react-003'
        },
        {
          text: 'React-004 渲染切片與底層纖維',
          link: '/view/posts/react/react-004'
        },
        {
          text: 'React-005 函式鉤子與狀態驅動',
          link: '/view/posts/react/react-005'
        },
        {
          text: 'React-006 進階鉤子與渲染控制',
          link: '/view/posts/react/react-006'
        },
        {
          text: 'React-007 自定義鉤子 useHooks',
          link: '/view/posts/react/react-007'
        }
      ],
      collapsed: true
    }
  ],
  collapsed: false
}

export default frontendRouter
