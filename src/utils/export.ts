import axios from "axios";
import {useAuthorization} from "@/composables/authorization.ts";
const token = useAuthorization()
let baseURL = import.meta.env.VITE_APP_BASE_URL
async function downloadFile(url: string, params:any, name = '预售订单.xlsx'){
    let fullUrl = baseURL + url
    try {
        // 1. 发送请求，注意要设置响应类型为 blob
        const response = await axios.post(
            fullUrl,
            params,
            {
                responseType: 'blob', // 关键：指定响应为二进制流（Blob）
                headers: {
                    'token': token.value,
                }
            }
        );

        // 2. 从响应头中获取文件名（如果后端设置了 Content-Disposition）
        const contentDisposition = response.headers['content-disposition'];
        let fileName = name; // 默认文件名
        if (contentDisposition) {
            // 正则提取文件名（假设后端格式为：attachment; filename="xxx.xlsx"）
            const match = contentDisposition.match(/filename="(.*)"/);
            if (match && match[1]) {
                fileName = match[1];
            }
        }

        // 3. 创建 Blob 对象（Excel 文件流）
        const blob = new Blob([response.data], {
            type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
        });

        // 4. 动态创建 <a> 标签并触发下载
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = fileName; // 设置下载文件名
        // console.log('createObjectURL======================>',url)
        document.body.appendChild(a);
        // a.click(); // 触发点击下载
        const clickEvent = new MouseEvent ('click', {view: window,bubbles: true,cancelable: true,
            ctrlKey: false, // 避免浏览器误判为特殊操作shiftKey: false
            });
        a.dispatchEvent (clickEvent);

        setTimeout (() => {
            URL.revokeObjectURL (url);
            // 释放内存中的 Blob 引用
            a.remove ();
            // 移除临时 DOM 元素
            }, 1500); // 1.5 秒延迟：适配 Edge 的下载启动速度


    // 5. 清理资源
        document.body.removeChild(a);
        URL.revokeObjectURL(url);
        return true
    } catch (error) {
        console.error('导出Excel失败：', error);
        return false
        // 可添加错误提示，如 this.$message.error('导出失败，请重试');
    }
}

export {downloadFile}