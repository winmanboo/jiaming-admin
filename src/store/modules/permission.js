import { asyncRoutes, constantRoutes } from '@/router'
import { routes } from '@/api/menu/routes'
import Layout from '@/layout'

/**
 * Use meta.role to determine if the current user has permission
 * @param roles
 * @param route
 */
function hasPermission(roles, route) {
  if (route.meta && route.meta.roles) {
    return roles.some(role => route.meta.roles.includes(role))
  } else {
    return true
  }
}

/**
 * 路由懒加载
 * @param view 视图路径
 */
export const loadView = (view) => {
  return () => Promise.resolve(require(`@/views/${view}`).default)
}

/**
 * Filter asynchronous routing tables by recursion
 * @param routes asyncRoutes
 * @param roles
 */
export function filterAsyncRoutes(routes, roles) {
  const res = []

  routes.forEach(route => {
    const tmp = { ...route }
    if (hasPermission(roles, tmp)) {
      if (tmp.children) {
        tmp.children = filterAsyncRoutes(tmp.children, roles)
      }
      res.push(tmp)
    }
  })

  return res
}

const state = {
  routes: [],
  addRoutes: []
}

const mutations = {
  SET_ROUTES: (state, routes) => {
    state.addRoutes = routes
    state.routes = constantRoutes.concat(routes)
  }
}

function loadChild(route) {
  if (route.children.length > 0) {
    for (const child of route.children) {
      child.component = loadView(child.component)
      loadChild(child)
    }
  }
}

const actions = {
  generateRoutes({ commit }) {
    return new Promise(resolve => {
      /* let accessedRoutes
      if (roles.includes('admin')) {
        accessedRoutes = asyncRoutes || []
      } else {
        accessedRoutes = filterAsyncRoutes(asyncRoutes, roles)
      }
      commit('SET_ROUTES', accessedRoutes)
      resolve(accessedRoutes) */

      routes().then(routes => {
        for (const route of routes) {
          if (route.component === 'Layout') {
            route.component = Layout
          } else {
            route.component = loadView(route.component)
          }
          loadChild(route)
        }
        console.log(routes);
        commit('SET_ROUTES', routes)
        resolve(routes)
      })
    })
  },
}

export default {
  namespaced: true,
  state,
  mutations,
  actions
}
