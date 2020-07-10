class Observer {
  constructor (data) {
    this.walk(data)
  }

  // 遍历data对象所有属性
  walk (data) { 
    // 1.判断data是否是对象
    if (!data || typeof data !== 'object') {
      return
    }
    // 2.遍历data的所有属性
    Object.keys(data).forEach(key => {
      this.defineReactive(data, key, data[key])
    })
  }

  defineReactive (obj, key, value) {
    let that = this   // 保证set()中this指向Observer
    // 收集依赖并发送通知
    let dep = new Dep()
    this.walk(value)  // 如果value是对象,把value内部属性转换成响应式数据
    Object.defineProperty(obj, key, {
      enumerable: true,
      configurable: true,
      get () {
        // 收集依赖
        Dep.target && dep.addSub(Dep.target)
        return value
      },
      set (newVal) {
        if (newVal === value) {
          return
        }
        value = newVal
        that.walk(newVal)   // 如果新赋值对象是对象，转换内部属性，如果不是，walk()会return
        // 发送通知
        dep.notify()
      }
    })
  }
}