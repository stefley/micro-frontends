import { handleRouter } from "./handle-router"
import { rewriteRouter } from "./rewrite-router"

const _apps = []
export const getApps = () => _apps
export const registerMicroApps = (apps) => {
    _apps = apps
}

export const start = () => {
    // 微前端运行原理： 1监视路有变化 2匹配子应用 3加载子应用 4渲染子应用
    
    rewriteRouter()
    //初始执行匹配
    handleRouter()
}