declare module "dnsPrefetchPlugin" {
  import { Plugin } from "vite";
  const dnsPrefetchPlugin: () => Plugin;
  export default dnsPrefetchPlugin;
}
