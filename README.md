# Missing Notes Dauber

## 演示

![演示](./MissingNotesDauber.gif)

## 笔记工具MissingNotes的实现难点亮点

### 怎么实现把笔记工具注入到任意浏览器的任意页面的？

浏览器插件需要特定于某个浏览器，暂时不用。从常见的 `<a href="javascript: void 0"></a>` 得到启发，给浏览器添加书签，书签URL是 `javascript:` 协议，后面是一段JS代码，即可给当前页面加载一个JS文件，里面实现的就是笔记工具。

### 怎么从DOM树中提取用户选择的文本（这些文本可能是跨父子、兄弟节点的）？

使用DOM API获取 `range` 对象，在它上面获取 `commonAncestorContainer` 节点，然后深度优先遍历其子孙节点，相当于把所有子孙节点按照深度优先的顺序排成一条线，找到用户选取范围的开始节点和结束节点，提取其中的文本和选择器信息，保存到redux state中。

### 怎么把用户选取的文本渲染为高亮？

dva有提供 `onStateChange` 钩子函数，内部封装的是 redux 的 `store.subscribe(onStateChange)` ，当redux state变化时，在 `onStateChange` 中用之前记录的选择器和DOM API直接修改用户选择的一个个 `TextNode` ，用 `<span>` 把需要高亮的文本包起来，实现高亮样式，其中用到 `documentFragment` 实现一次插入多个 `Node` 到DOM中。

### 为什么不在提取用户选择的文本信息时就直接将其高亮？当时明明已经找到这些文本在哪了呀！

因为要支持再次打开页面时能高亮出之前高亮过的内容，此时需要将 `localStorage` 中的数据提取到redux state，然后直接修改DOM，实现高亮。这一步总是要做的，所以为了统一实现高亮的逻辑，就不在提取用户选择的文本信息直接将其高亮。

### 为什么实现高亮这一步不走react？

因为要高亮的文本不是笔记工具的react渲染出来的，只能用DOM API来操作。而在react组件内部直接操作DOM的话，组件就具有副作用，不是纯组件。纯组件相当于以props为输入、以render方法的返回值为输出的纯函数，它有利于实现自动化测试。
