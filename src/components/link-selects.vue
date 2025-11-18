<script setup lang="ts">
import {Options} from '@/types/global'
const props = defineProps([ 'sourceTree', 'selected', 'item'])
const emit = defineEmits(['update:selected'])
// type Options = {value: string, label: string,children?: Options[]}
// 动态生成 options 的回显数据源  父级select 值改变， 更新子 options 数组
const optionsObjs: { [key: string]: Options[] }[]= []
// 绑定 select 的 options 数组
const optionsArr = ref<Options[][]>([])
// select 绑定的 value 数组
const  valArr = ref<string[]>([''])
const parentValArr = ref<string[]>([])
// 选项个数
let optionsLen = 1
initSource(props.sourceTree, 0)
optionsLen = optionsArr.value.length
// 初始化 数据源optionsObjs 和 选项数组 optionsArr = = = = = = = = 》

/**
 * 从一棵树中查找所有的父节点
 *
 * @param tree   树
 * @param lastId 最后一个节点的id
 * @return 所有的父节点
 */
const findParents = (tree: Options[], lastId: string)=> {
  // 递归辅助函数，查找节点并收集父节点
  const findNodeAndParents = (nodes: Options[], targetId: string, parents: Options[]): Options | boolean=> {
    for (const node of nodes) {
      // 如果找到目标节点，返回该节点
      if (node.value === targetId) {
        parentValArr.value.push(node.value)
        return true
      }
      // 如果有子节点，递归查找
      if (node.children && node.children.length > 0) {
        // 将当前节点加入父节点列表，供子节点查找使用
        parents.push(node);
        parentValArr.value.push(node.value as string)
        const found = findNodeAndParents(node.children, targetId, parents);

        // 如果在子节点中找到了目标节点，返回该节点
        if (found) {
          return true;
        }
        // 如果没找到，将当前节点从父节点列表中移除
        parents.pop();
      }
    }
    // 未找到目标节点
    parentValArr.value=[]
    return false;
  };
  const parents: Options[] = [];
  // 查找目标节点并收集父节点
  const found = findNodeAndParents(tree, lastId, parents);
  // 如果找到目标节点，返回收集到的父节点，否则返回空数组
  return found ? parents : [];
};

function initSource(data:Options[], level=0, parent='') {
  if(!data) return
  let isFirst = !parent && level == 0
  let optSource:Options[] = []
  // 自己 value : 自己Option
  let valMap: {[x: string]: Options[]} = {}
  data.forEach((item: Options) => {
    let {value, label, children} = item
    let temp = {value,label,children, parentId: parent}
    optSource.push(temp)
    valMap[value as string] = [temp]
    if(item.children) initSource(item.children, level+1, item.value as string)
  })
  if(isFirst) {
    // 第一级选项
    optionsArr.value[0] = [...optSource]
    optionsObjs[0] = {...valMap}
  } else {
    // let index = level
    if(!optionsObjs[level]) optionsObjs[level] = {}
    // 父value ： 子Options[]
    optionsObjs[level][parent] = [...optSource]
    // 4. 初始化 选项数组 optionsArr 非第一个为空
    if(!optionsArr.value[level]) {
      optionsArr.value[level] = []
    }
  }
}

function setOptions(valArray:string[]){
  if(valArray.length == 0) return
  valArray.forEach(((item:any, idx:number) => {
    if(idx == valArray.length - 1)return
    // 根据父级ID取子级 options 选项
    optionsArr.value[idx+1] = optionsObjs[idx+1][item]
  }))
  // 设置 select 的选中值
  valArr.value = [...parentValArr.value]
}

//
function initData(val: string){
  if(val != '0' && !!val){
    // 查找父级
    findParents(props.sourceTree, val)
    setOptions(parentValArr.value)
  } else {
    resetArr(valArr.value, 0, '')
    if(optionsLen > 1) resetArr(optionsArr.value, 1, [])
  }
}

initData(props.selected)
watch(() => props.selected, (newVal) => {
  parentValArr.value = []
  initData(newVal)
})
/*
* value: 选中值
* i: 第几个下拉选项
* */
function setChildren(value:any, i:number) {
  // 重置子选项
  resetArr(optionsArr.value, i+1, [])
  let childIdx = i+1
  if(optionsObjs[childIdx]){
    let temp = optionsObjs[childIdx][value]
    optionsArr.value[childIdx] = temp ? [...temp] : []
    resetArr(valArr.value, childIdx, '')
  }
  emit('update:selected', valArr.value)
}
// 重置数组项 data要重置的数组 从index开始， 重置为defVal
function resetArr(data:any[], index:number, defVal:any){
  for(let i = index; i < data.length; i++){
    data[i] = defVal
  }
}
defineExpose({
  valArr
})
</script>

<template>
    <a-form-item-rest>
    <a-flex gap="small" justify-between style="width: 100%">
    <a-select v-for="(item, i) in optionsArr" v-model:value="valArr[i]"
              @change="(value:any) => setChildren(value, i)">
      <a-select-option  v-for="opt in item" :key="(opt.label || i)" :value="opt.value">{{opt.label}}</a-select-option>
    </a-select>
  </a-flex>
  </a-form-item-rest>
</template>

<style scoped lang="less">
</style>

