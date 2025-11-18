# 联动select
in : sourceTree, selected
out: selected

sourceTree => select Num
sourceTree => optionsObjs[i] + value[i] = options[i]
{value: string, label: string, children: options[]} =>

sourceTree => optionsObjs[] => options[i] => @change=setChildren(id)
           => valArr[]
validate   => valArr[i] != ''



optionsObjs{
parentId: {value: string, label: string}[]
}
setChildrenOpts(parentId) => options[i] = optionsObjs[i][parentId]



tggg

