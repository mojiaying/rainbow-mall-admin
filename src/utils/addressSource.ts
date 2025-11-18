import { useCascaderAreaData } from "@vant/area-data";
export const cascaderAreaData = useCascaderAreaData();
const getTree = () => {
    return cascaderAreaData.map((item:any) =>  ({
            value: item.value,
            label: item.text,
            children: item?.children?.map((city:any) => ({value: city.value, label: city.text,})),
        })
    )
}

export const treeAddress = getTree()


