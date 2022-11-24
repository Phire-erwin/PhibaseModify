import router from '@/router/index.js'

const getApp =()=>{
  return router.app.$session.get('phibase-app')
}
const dateFormat = (date) => {
  return new Date(date).toLocaleString('id-ID', {year: '2-digit', month: '2-digit', day: '2-digit', hour: '2-digit', minute: '2-digit'});
}

const domainPermission = (domain) => {
  return JSON.parse(router.app.$session.get('phibase-permission')).filter(el => {
    return el.name.toLowerCase() === domain.toLowerCase()
  })[0]
}

const userAccess = (submenu, menu = 'menu') => {
  var permission = domainPermission('Common')

  if (permission.allAccess) {
    return {
      add: true,
      edit: true,
      delete: true,
    }
  } else {
    return permission[menu.toLowerCase()].filter(el => {
      return el.name.toLowerCase() === submenu.toLowerCase()
    })[0]
  }
}

const userAccessManufacture = (submenu, menu = 'menu') => {
  // const dummy = JSON.parse('{"name":"Commerce","allAccess":false,"mainmenu":["Purchase","Sales","Payment","POS"],"menu":[{"name":"Dashboard","view":false,"add":false,"edit":false,"delete":false},{"name":"User","view":false,"add":false,"edit":false,"delete":false},{"name":"Receive","view":false,"add":false,"edit":false,"delete":false},{"name":"Warranty","view":true,"add":false,"edit":false,"delete":false},{"name":"Settings","view":true,"add":false,"edit":false,"delete":false}],"purchase":[{"name":"Purchase Request","view":false,"add":false,"edit":false,"delete":false},{"name":"Purchase Order","view":true,"add":false,"edit":false,"delete":false}],"sales":[{"name":"Quotation","view":true,"add":false,"edit":false,"delete":false},{"name":"Sales Order","view":true,"add":false,"edit":false,"delete":false}],"payment":[{"name":"Invoice","view":true,"add":false,"edit":false,"delete":false},{"name":"Payment","view":true,"add":false,"edit":false,"delete":false}],"pos":[{"name":"Transaction-Home","view":true,"add":false,"edit":false,"delete":false},{"name":"Receipt","view":true,"add":false,"edit":false,"delete":false},{"name":"Transaction List","view":true,"add":false,"edit":false,"delete":false},{"name":"Receipt List","view":true,"add":false,"edit":false,"delete":false},{"name":"Reserve List","view":true,"add":false,"edit":false,"delete":false},{"name":"Commission Admin","view":true,"add":false,"edit":false,"delete":false},{"name":"Commission One","view":true,"add":false,"edit":false,"delete":false}]}')

  // var permission = dummy
  var permission = domainPermission('Manufacture')
  console.log('manu access '+submenu+' '+menu,permission);
  if (permission.allAccess) {
    return {
      add: true,
      edit: true,
      delete: true,
    }
  } else {
    return permission[menu.toLowerCase()].filter(el => {
      return el.name.toLowerCase() === submenu.toLowerCase()
    })[0]
  }
}

const viewAccess = () => {
  var permission = domainPermission('Common')

  if (permission.allAccess) {
    return ['dashboard', 'item', 'role', 'user']
  } else {
    return permission.menu.filter(el => {
      return el.view;
    }).map(el => {
      return `${el.name.replace(/\s+/g, '-').toLowerCase()}`;
    })
  }
}

export {
  getApp,
  dateFormat,
  domainPermission,
  userAccess,
  userAccessManufacture,
  viewAccess
}