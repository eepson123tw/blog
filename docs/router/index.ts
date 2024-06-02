import frontendRouter from "./frontEnd";
import backendRouter from "./backEnd";
import smallTalkRouter from "./smallTalk";

export const nav = [
  { text: "AboutMe", link: "https://ph-portfolio.zeabur.app/" },
  { text: "Categories", link: "/view/categories" },
  {
    text: "FrontEnd",
    items: [
      { text: "DOM", link: "/view/frontend/dom" },
      { text: "FrameWork-History", link: "/view/frontend/frameWork" },
      { text: "React-Self-Learning", link: "/view/frontend/react/react-001" },
    ],
  },
  { text: "BackEnd", link: "/view/backend/jwt" },
  { text: "前端異聞錄", link: "/view/smallTalk/gpt-prompt-learning" },
];

export const sidebar = {
  "/": [
    {
      text: "Intro",
      items: [
        { text: "前言 Intro", link: "/view/intro" },
        { text: "文章類型 Categories", link: "/view/categories" },
        { text: "前端文章 FrontEnd", link: "/view/frontend/dom" },
        { text: "後端文章 BackEnd", link: "/view/backend/jwt" },
        {
          text: "前端異聞錄 SmallTalk",
          link: "/view/smallTalk/frontend-job-smalltalk",
        },
      ],
    },
  ],
  "/view/frontend/": [frontendRouter],
  "/view/backend/": [backendRouter],
  "/view/smallTalk/": [smallTalkRouter],
};
