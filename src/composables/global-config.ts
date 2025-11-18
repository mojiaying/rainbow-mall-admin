import type { message, notification } from 'ant-design-vue'
import type { ModalFunc } from 'ant-design-vue/es/modal/Modal'
import { ExclamationCircleOutlined } from '@ant-design/icons-vue';
import { createVNode } from 'vue';
import {Modal} from "ant-design-vue";

interface GlobalConfigIntl {
  message?: Omit<typeof message, 'useMessage'>
  modal?: {
    readonly info: ModalFunc
    readonly success: ModalFunc
    readonly error: ModalFunc
    readonly warning: ModalFunc
    readonly confirm: ModalFunc
  }
myConfirm?: typeof confirmModal
  notification?: Omit<typeof notification, 'useNotification'>
}
const globalConfig = reactive<GlobalConfigIntl>({})

export function useGlobalConfig() {
  return globalConfig
}
export function useSetGlobalConfig(config: GlobalConfigIntl) {
  globalConfig.message = config.message
  globalConfig.modal = config.modal
  globalConfig.notification = config.notification
  globalConfig.myConfirm = config.myConfirm
}

export function useMessage() {
  return globalConfig.message!
}

export function useModal() {
  return globalConfig.modal!
}

export function useNotification() {
  return globalConfig.notification!
}

export function useConfirm() {
  return confirmModal
}

function confirmModal(message:string, title?:string, ok?: Function, cancel?: Function) {
  Modal.confirm({
    title: title || '提示',
    icon: createVNode(ExclamationCircleOutlined),
    content: message,
    onOk() {
      ok && ok()
    },
    onCancel() {
      cancel && cancel()
    },
  })
}

export function useInitData(data:any){
  let tempObj: {[key: string]: any} = {}
  data.forEach((item:any) => {tempObj[item.key] = item.default || undefined})
  return tempObj
}