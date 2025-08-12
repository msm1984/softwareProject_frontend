import { Menu } from '../../models/Menu';

export const LINKS: Menu[] = [
  {
    name: 'Dashboard',
    url: '/dashboard/',
    icon: 'home',
    permission: 'GetPermissions',
    exact: true,
  },
  {
    name: 'Manage Categories',
    url: 'manage-category',
    icon: 'category',
    permission: 'GetCategories',
    exact: false,
  },
  {
    name: 'Add Graph',
    url: 'add-graph',
    icon: 'post_add',
    permission: 'UploadNodeFile',
    exact: false,
  },
  {
    name: 'Assign Files',
    url: 'assign-file',
    icon: 'contact_page',
    permission: 'AccessFileToUser',
    exact: false,
  },
  {
    name: 'Data Analysis',
    url: 'data-analysis',
    icon: 'query_stats',
    permission: 'GetNodesAsync',
    exact: false,
  },
  {
    name: 'Manage Users',
    url: 'manage-users',
    icon: 'manage_accounts',
    permission: 'Register',
    exact: false,
  },
  {
    name: 'Manage Account',
    url: 'manage-account',
    icon: 'settings',
    permission: 'UploadImage',
    exact: false,
  },
];
