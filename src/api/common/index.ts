type UploadParams = {
    fileName: string;
    contentType: string;
}
export function getUrlApi(params: UploadParams) {
    return usePost('/base/oss/upload_form/genereate', params)
}

export function uploadFileApi(url:string, params:UploadParams, type: string) {
    return usePut(url, params, {headers: {'Content-Type': type}})
}

// 获取省市区
export function getProvinceApi(){
    return useQuery('/common/base/location/provinces')
}

export function getCityApi(id: string){
    return useQuery('/common/base/location/cities', {provinceId: id})
}


export function getCountyApi(id: string){
    return useQuery('/common/base/location/counties', {cityId: id})
}

