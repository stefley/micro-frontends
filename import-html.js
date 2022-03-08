import { fetchResource } from "./utils/fetch-resource"

export const importHTML = async (url) => {
    // 请求获取子应用的资源：HTML、CSS、JS
    const html = await fetchResource(url)
    // 1 客户端渲染需要执行js生成内容
    // 浏览器出于安全考虑innerHTML中的script不会加载和执行
    // 手动加载子应用的script 执行script的js代码 eval new Function

    const template = document.createElement('div')
    template.innerHTML = html

    const scripts = template.querySelectorAll('script')
    // 获取所有script标签的代码： [代码, 代码]
    function getExternalScripts() {
        return Promise.all(Array.from(scripts).map(script => {
            const src = script.getAttribute("src")
            if (!src) {
                return Promise.resolve(script.innerHTML)
            } else {
                return fetchResource(
                    src.startsWith('http') ? src : `${url}/${src}`
                )
            }
        }))
    }

    // 获取并执行所有的 script脚本代码
    async function execScripts() {
        const scripts = await getExternalScripts()

        // 手动构造commJS模块环境
        const module = { exports: {}}
        const exports = module.exports
        scripts.forEach(code => {
            // eval执行可以访问外部变量
            eval(code)
        })
        return module.exports
    }

    return {
        template,
        getExternalScripts,
        execScripts
    }
}