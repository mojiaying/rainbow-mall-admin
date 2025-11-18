import {useDelete, useGet, usePost, usePut, useQuery }  from '@/utils/alova'
import alovaInstance from '@/utils/alova.ts'
import {message} from "ant-design-vue";
import {getUrlApi} from "@/api/common";
import axios from "axios";
// import {useDelete, useGet, usePost, usePut} from '@/utils/request.ts'

async function useInit(loading:any,func:Function, msg?:string) {
    if(msg) message.success(msg)
    if (loading.value)
        return
    loading.value = true
    try {
        await func()
    }
    catch (e) {
        console.log(e)
    }
    finally {
        loading.value = false
    }
}

async function useUploadFile(file:any) {
    // 获取图片地址 和 图片上传地址
    const res = await getUrlApi({fileName: file.name, contentType: `${file.type}`})
    if (res) {
        // 上传图片
        await axios({
            method: 'put',
            url: res.uploadUrl, // 图片上传地址
            headers: {
                'content-type': file.type,
            },
            data: file
        })
        return res.fileUrl
    }
}

const useRequest= alovaInstance
export {
    useDelete,
    useGet,
    usePost,
    usePut,
    useQuery,
    useRequest,
    useInit,
    useUploadFile
}



