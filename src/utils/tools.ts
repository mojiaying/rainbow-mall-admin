import { get } from 'lodash-es'
import router from '@/router'
import { Options } from '@/types/global'

export function getQueryParam(param: string | string[], defaultVal = '') {
  const query = router.currentRoute.value?.query ?? {}
  const val = get(query, param) ?? defaultVal
  return decodeURIComponent(val)
}

// 配置生成数据对象
export function confInitData(conf:any){
      let tempObj: {[key: string]: any} = {}
      conf.forEach((item:any) => {tempObj[item.key] = item.default || undefined})
}

// 由最后一个ID 逆向查找所有父级ID ，
/*
* options: 树结构数据
* targetValue: 目标节点的value值
* path: 链式ID数组，默认为空数组
* */
export const getPathByValue = (options:any, targetValue:any, path?: any[]) => {
    for (const option of options) {
        // 1. 将当前节点value加入路径
        if(!path) path = []
        const newPath:any[] = [...path, option.value];
        // 2. 找到目标节点，返回完整路径
        if (option.value === targetValue) {
            return newPath;
        }
        // 3. 有子节点，继续递归
        if (option.children && option.children.length) {
            const result:any = getPathByValue(option.children, targetValue, newPath);
            if (result.length > 0) return result;
        }
    }
    return []; // 未找到
};

/**
 * 从一棵树中查找所有的父节点
 *
 * @param tree   树
 * @param lastId 最后一个节点的id
 * @return 所有的父节点
 */
export const findParents = (tree: Options[], lastId: string)=> {
    let parentValArr = []
    // 递归辅助函数，查找节点并收集父节点
    const findNodeAndParents = (nodes: Options[], targetId: string, parents: Options[]): Options | boolean=> {
        for (const node of nodes) {
            // 如果找到目标节点，返回该节点
            if (node.value === targetId) {
                parentValArr.push(node.value)
                return true
            }
            // 如果有子节点，递归查找
            if (node.children && node.children.length > 0) {
                // 将当前节点加入父节点列表，供子节点查找使用
                parents.push(node);
                parentValArr.push(node.value as string)
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
        parentValArr=[]
        return false;
    };
    const parents: Options[] = [];
    // 查找目标节点并收集父节点
    const found = findNodeAndParents(tree, lastId, parents);
    // 如果找到目标节点，返回收集到的父节点，否则返回空数组
    return found ? parents : [];
};
/**
 * 对比数组对象的指定属性值是否完全相同
 * @param items 数组对象列表
 * @param props 需要对比的属性列表
 * @returns 是否完全相同
 */
export function hasDuplicateObj(items:any[], props:string[]): number[] {
    const uniqueCombines = new Set();
    const duplicatesIndexs:number[] = [];
    items.forEach((item,index) => {
        let combineKey = '';
        props.forEach(prop => {
            combineKey += `${item[prop]}-`;
        })
        // 若已存在相同的组合，说明找到重复对象
        if (uniqueCombines.has(combineKey)) {
            duplicatesIndexs.push(index);
        } else {
            uniqueCombines.add(combineKey);
        }
    })

    // 遍历完所有对象都没有重复
    return duplicatesIndexs;
}