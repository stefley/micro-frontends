/**
 * 处理路有变化
 * apps: [
 *  {
 *      name: string;   'demo'
 *      entry: url;     子应用HTML入口  '//localhost:9000'
 *      container: string;  渲染位置 '#subapp-container'
 *      activeRule: string; '/subapp/demo' 路由匹配规则
 *  }
 * ]
 */

import { getApps } from "."
import { importHTML } from "./import-html"
import { getNextRoute, getPrevRoute } from "./rewrite-router"

export const handleRouter = async () => {
    const apps = getApps()
    // 首先卸载上个子应用
    const prevApp = apps.find(item => {
        return getPrevRoute().startsWith(item.activeRule)
    })
    // 匹配子应用
    // - 获取到当前的路由路径 - 去apps查找

    const app = apps.find(item => getNextRoute().startsWith(item.activeRule))
    // 如果有上个应用 先销毁
    if (prevApp) {
        await unmount(prevApp)
    }

    if (!app) return
    // 加载子应用 
    const container = document.querySelector(app.container)
    const { template, execScripts } = await importHTML(app.entry)
    container.appendChild(template)
    // 配置全局环境变量
    window.__POWERED_BY_MICROFE__  = true
    window.__INJECTED_PUBLIC_PATH_BY_MICROFE__ = app.entry + '/'
    
    const appExports = execScripts()
    
    app.bootstrap = appExports.bootstrap
    app.mount =appExports.mount
    app.unmount = appExports.unmount

    await bootstrap(app)
    await mount(app) 
}
async function bootstrap(app) {
    app.bootstrap && (await app.bootstrap())
}

async function mount(app) {
    app.mount && (await app.mount({
        container: document.querySelector(app.container)
    }))
}

async function unmount(app) {
    app.unmount && (await app.unmount({
        container: document.querySelector(app.container)
    }))
}