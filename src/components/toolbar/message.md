## use arrays of object to store highlight Notes

```
textNode{
  id,
  content,
  // comment,
  fhtno,
  lhtno,
  nodeChain
  data,
}
```

- id{string}: A highlight's ID which is unique for a user, radix is 32;
- content{string}: highlight note that need to be store;
- // comment{string}: add comments;
- fhtno{number}: First Text Node Offset. How many characters the highlight
leftmost edge offset from the first character in the first text node. Internal,it's Range.startOffset
- lhtno{number}: Last Text Node Offset. How many characters the highlight
rightmost edge offset from the first character in the last text node. Internal,it's Range.endOffset
- nodeChain{string[]}: 选取的内容分解后的textnode的父eliment在DOM树位置
- Data{Data}
