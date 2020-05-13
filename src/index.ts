declare global {
  var webpackModuleFiles: any;
  var __webpack_require__: any;
}


/**
 * 
 * 加载远程模块
 * @param {string} moduleUrl module的路径
 * @returns {Promise<boolean>} 动态加载module成功
 */
function loadModule(moduleUrl: string): Promise<boolean> {

  return new Promise(function (resolve) {
    // TODO: handler timeout
    // step2-1: 如果不存在，先利用jsonp，加载module
    const scriptTag = document.createElement("script")
    scriptTag.onload = function (e) {
      resolve(true);
    }
    scriptTag.onerror = function (e) {
      resolve(false)
    }
    document.body.appendChild(scriptTag)
    scriptTag.src = moduleUrl
  })

}

/**
 * 根据moduleId获取其远程资源路径
 *
 * @param {string} moduleId
 * @returns {string}
 */
function getModuleUlr(moduleId: string): string {
  return window.webpackModuleFiles[moduleId]
}

export function asyncImport(moduleId: string): Promise<any> {
  return new Promise(function (resolve, reject) {
    // step1: 确认全局module中是否存在moduleId
    if (!__webpack_require__.m.hasOwnProperty(moduleId)) {
      const moduleUrl = getModuleUlr(moduleId);
      // loadModule 会自动载入至全局module中
      loadModule(moduleUrl).then(function (status) {
        if (status) {
          resolve(__webpack_require__(moduleId))
        } else {
          reject("async import module: " + moduleId + " failed")
        }
      })
    } else {
      resolve(__webpack_require__(moduleId))
    }

  })
}

export default function asyncImportDefault(moduleId: string) {
  return asyncImport(moduleId).then(function (all: { default?: any }) {
    return all["default"]
  })
}