export const viteConfig = {
  build: {
    sourcemap: false,
    chunkSizeWarningLimit: 4500,
    rollupOptions: {
      output: {
        manualChunks(id: string) {
          if (id.includes('node_modules')) {
            return 'vendor';
          }
        },
      },
    },
  },
  ssr: {
    noExternal: ['debug'],
  },
};
