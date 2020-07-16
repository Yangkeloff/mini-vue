// 收集依赖，添加观察者
// 通知所有观察者

class Dep {
  constructor () {
    this.subs = []  // 存储所有观察者
  }
  // 添加观察者
  addSub (sub) {
    if (sub && sub.update) {
      this.subs.push(sub)
    }
  }
  // 发送通知
  notify () {
    this.subs.forEach(sub => {
      sub.update()
    })
  }
}