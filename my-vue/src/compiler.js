class Compiler {
  constructor (vm) {
    this.el = vm.$el
    this.vm = vm

    this.compile(this.el)
  }
  // 编译模板，处理元素/文本节点
  compile (el) {
    let childNodes = el.childNodes
    Array.from(childNodes).forEach(node => {
      if (this.isEleNode(node)) {
        this.compileEle(node)
      } else if (this.isTextNode(node)) {
        this.compileText(node)
      }
      // 子节点还有子节点，递归调用
      if (node.childNodes && node.childNodes.length) {
        this.compile(node)
      }
    })
  }
  // 编译元素节点，处理指令
  compileEle (node) {
    Array.from(node.attributes).forEach(attr => {
      let attrName = attr.name
      if (this.isDirective(attrName)) {
        console.log(attr)
        attrName = attrName.slice(2)
        let key = attr.value  // 指令等于的值，如v-text="msg"，attr.value为msg，对应data的属性名
        this.update(node, key, attrName)
      }
    })
  }

  update (node, key, attrName) {
    let upFn = this[`${attrName}Updater`]
    upFn && upFn.call(this, node, this.vm[key], key)  // call(this)使所有Updater()调用时this指向Compiler
  }

  textUpdater (node, value, key) {
    node.textContent = value
    // 创建watcher,数据改变更新视图
    new Watcher(this.vm, key, (newVal) => {
      node.textContent = newVal
    })
  }
  modelUpdater (node, value, key) {
    node.value = value
    // 创建watcher,数据改变更新视图
    new Watcher(this.vm, key, (newVal) => {
      node.value = newVal
    })
    // 双向绑定
    node.addEventListener('input', () => {
      this.vm[key] = node.value 
    })
  }
  // 编译文本节点，处理{{}}
  compileText (node) {
    let reg = /\{\{(.+?)\}\}/
    let value = node.textContent
    if (reg.test(value)) {
      let key = RegExp.$1.trim()
      node.textContent = value.replace(reg, this.vm[key])

      // 创建watcher,数据改变更新视图
      new Watcher(this.vm, key, (newVal) => {
        node.textContent = newVal
      })
    }
  }
  // 判断元素属性是否是指令,即是否以v-开始
  isDirective (attrName) {
    return attrName.startsWith('v-')
  }
  isEleNode (node) {
    return node.nodeType === 1
  }
  isTextNode (node) {
    return node.nodeType === 3
  }
}