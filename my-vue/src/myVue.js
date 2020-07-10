// constructor方法是class的默认方法，通过new命令生成对象实例时，自动调用该方法
// 一个类必须有constructor方法，如果没有显式定义，一个空的constructor方法会被默认添加

class MyVue {
  constructor (options) {
    // 1.通过属性保存选项的数据
    this.$options = options || {}
    this.$data = options.data || {}
    // 判断传入的el是否为字符串，如果是，则获取该DOM;如果不是，则传入的就是DOM对象,直接赋值
    this.$el = typeof options.el === 'string' ? document.querySelector(options.el) : options.el

    // 2.把data成员转换为响应式(getter,setter)，添加到Vue实例中
    this._proxyData(this.$data)

    // 3.调用observer对象,监听数据变化
    new Observer(this.$data)

    // 4.调用compiler对象，解析指令和插值表达式
    new Compiler(this)  // 传入Vue实例
  }

  // Object.defineProperty(obj要定义属性的对象, prop要定义或修改的属性的名称, descriptor)

  _proxyData (data) {
    // 遍历data所有属性
    Object.keys(data).forEach(key => {  // 此处必须使用arrow function,普通function的this指向window
      // 把data的属性注入到Vue
      Object.defineProperty(this, key, {  // 此处this指向Vue实例
        enumerable: true,
        configurable: true,
        get () {
          return data[key]
        },
        set (newValue) {
          if (newValue === data[key]) {
            return
          }
          data[key] = newValue
        }
      })
    })
  }
}