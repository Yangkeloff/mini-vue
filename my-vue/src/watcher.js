// 当数据变化触发依赖，dep通知所有的Watcher实例更新视图
// 自身实例化时，往dep对象添加自己

class Watcher {
  constructor (vm, key, cb) {
    this.vm = vm
    // data中的属性名
    this.key = key
    // 回调函数，负责更新视图 
    this.cb = cb

    // 创建watcher对象时，将其添加进Dep的subs数组中
    // 将watcher对象记录到Dep的静态属性target中
    Dep.target = this
    // 触发get()时会调用addSub
    this.oldVal = vm[key]   // 访问data中某值时，即调用其get()
    Dep.target = null   // 防止重复添加
  }
  // 当数据变化时，更新视图
  update () {
    // 调用update时，值已经更新
    let newVal = this.vm[this.key]
    if (newVal === this.oldVal) return
    this.cb(newVal)
  }
}