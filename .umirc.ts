import { defineConfig } from 'umi';

export default defineConfig({
  nodeModulesTransform: {
    type: 'none',
  },
  routes: [{ path: '/', component: '@/pages/index' }],
  fastRefresh: {},
  publicPath:
    process.env.NODE_ENV === 'production'
      ? '/logdb_view_web/'
      : '/logdb_view_web/',
  base: '/logdb_view_web/index.html',
});
