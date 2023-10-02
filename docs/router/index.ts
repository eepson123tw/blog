import frontendRouter from "./frontEnd";
import backendRouter from "./backEnd";
import smallTalkRouter from "./smallTalk";

export const nav = [
  { text: "Home", link: "/" },
  { text: "AboutMe", link: "https://ph-portfolio.zeabur.app/" },
  { text: "Categories", link: "/view/categories" },
  {
    text: "FrontEnd",
    items: [
      { text: "DOM", link: "/view/posts/dom" },
      { text: "FrameWork-History", link: "/view/posts/frameWork" },
      { text: "React-Self-Learning", link: "/view/posts/react/react-001" },
    ],
  },
];
export const sidebar = [
  { text: "ℹ Intro", link: "/view/intro" },
  frontendRouter,
  backendRouter,
  smallTalkRouter,
];
