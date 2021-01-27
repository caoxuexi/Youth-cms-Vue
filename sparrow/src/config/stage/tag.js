/**
 * @author 曹学习
 * @description tag.js
 * @date 2021/1/26 20:38
 */
const tagRouter = {
  route: null,
  name: null,
  title: '热门搜索管理',
  type: 'folder', // 类型: folder, tab, view
  icon: 'iconCao icon-tags',
  filePath: 'view/tag/', // 文件路径
  order: 13,
  inNav: true,
  children: [
    {
      title: '管理tag',
      type: 'view',
      name: 'TagManage',
      route: '/tag/manage',
      filePath: 'view/tag/tag-manage.vue',
      inNav: true,
      icon: '',
    },
  ],
}

export default tagRouter
