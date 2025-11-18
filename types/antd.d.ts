import type { CSSProperties } from '@vue/runtime-dom';
import {ColumnType} from 'ant-design-vue/es/table'
interface BtnType {
    label?: string;
    key?: string;
    onclick?: (row: any) => Promise<void>;
    style?: CSSProperties | ((row: any) => CSSProperties);
    mapName?: (row: any) => string | number | boolean;
    show?: (row: any) => boolean;
}
declare module 'ant-design-vue/es/table' {

    type CustomColumnsType<T> = ColumnType<T> & {
        dataIndex: string,
        buttons?: BtnType[],
        showAll?: boolean;
        style?: CSSProperties | ((row:any) => CSSProperties),
        // title?: string,
        slot?: string,
        type?: string,
        mapName?: (row: any) => string | number | boolean
        // align?: 'center',
        // dataIndex?: string,
        // width?: string | number,
    }
    // 表单组件配置
    interface FormConfig {
        label?: string,
        key: string,
        type?: 'text' | 'date' | 'select' | 'textarea' | 'number' | 'input' | 'password',
        placeholder?: string,
        options?: Options[],
        rules?: RuleObject | RuleObject[],
        blurUpdate?: boolean,
        slots?: string
    }

}