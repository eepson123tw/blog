export const viteConfig = {
  build: {
    sourcemap: false,
    chunkSizeWarningLimit: 4500,
  },
  ssr: {
    noExternal: ['debug'],
  },
};
