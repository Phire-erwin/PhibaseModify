import { domainPermission, viewAccess } from '@/utils/utils'
var permission = domainPermission('Common');

var navMenu = [];
var menu = [
  {
    title: 'Dashboard',
    route: 'dashboard',
    icon: 'ActivityIcon',
  },
  {
    title: 'Item',
    icon: 'PackageIcon',
    isMainMenu: true,
    route: 'item',
    children: [
  {
    title: 'Item',
    icon: 'BoxIcon',
    route: 'item',
  },
      {
        title: 'Component',
        route: 'component',
        icon: 'PackageIcon',
      },
      {
        title: 'BOM',
        route: 'bom',
        icon: 'PackageIcon',
      },
    ],
  },
  {
    title: 'Role',
    route: 'role',
    icon: 'SettingsIcon'
  },
  {
    title: 'User',
    route: 'user',
    icon: 'UsersIcon',
  },
]

if (permission.allAccess) {
  navMenu = [...menu]
} else {
  var userAccess = viewAccess()

  menu.forEach(el => {
    if (userAccess.includes(el.route)) {
      navMenu.push(el)
    }
  })
}

navMenu.push({
  title: 'OEE',
  route: 'oee',
  icon: "TargetIcon"
})

export default navMenu