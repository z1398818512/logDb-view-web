import { defineConfig } from 'umi';

const APP_BASE_PATH =
  process.env.NODE_ENV === 'production' ? '/logdb_view_web/' : '/';
const APP_BASE = APP_BASE_PATH + 'index.html';
export default defineConfig({
  nodeModulesTransform: {
    type: 'none',
  },
  routes: [{ path: '/', component: '@/pages/index' }],
  fastRefresh: {},
  publicPath: APP_BASE_PATH,
  base: APP_BASE,
  define: {
    'process.env.APP_BASE_PATH': APP_BASE_PATH,
    'process.env.APP_BASE': APP_BASE,
  },
});
