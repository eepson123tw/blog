const backendRouter = {
  text: 'BackEnd',
  items: [
    { text: 'JWT機制(JSON Web Tokens)', link: '/view/backend/jwt' },
    { text: 'Nginx是甚麼?', link: '/view/backend/nginx' },
    { text: 'Encode、Decode、Hash 是幹甚麼東西?', link: '/view/backend/encode' },
    { text: '利用AI學習Docker並應證', link: '/view/backend/docker' },
    {
      text: 'Python 學習筆記',
      items: [
        {
          text: 'Python-001 探索',
          link: '/view/backend/python/python-001',
        },
        {
          text: 'Python-002 函式',
          link: '/view/backend/python/python-002',
        },
        {
          text: 'Python-003 Class',
          link: '/view/backend/python/python-003',
        },
      ],
      collapsed: false,
    },
  ],
  collapsed: true,
};

export default backendRouter;
