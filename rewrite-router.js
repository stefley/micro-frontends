import { handleRouter } from "./handle-router"

let prevRoute = ''
let nextRoute = window.location.pathname

export const getPrevRoute = () => prevRoute
export const getNextRoute = () => nextRoute
export const rewriteRouter = () => {
    // hash路由 window.onhashchange  
    // history路由 history.go、history.back、history.forward 使用popstate事件 window.onpopstate

    window.addEventListener('popstate', () => {
        prevRoute = nextRoute
        nextRoute = window.location.pathname
        handleRouter()
    })
    // pushState、replaceState需要通过函数重写的方式进行劫持
    const rawPushState = window.history.pushState
    window.history.pushState = (...args) => {
        prevRoute = window.location.pathname
        rawPushState.apply(window.history, args)
        nextRoute = window.location.pathname
        handleRouter()
    }
    const rawReplaceState = window.history.replaceState
    window.history.replaceState = (...args) => {
        prevRoute = window.location.pathname
        rawReplaceState.apply(rawReplaceState,args)
        nextRoute = window.location.pathname
        handleRouter()
    }
}