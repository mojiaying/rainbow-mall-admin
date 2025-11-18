// modalManager.js
import { createVNode, render, Component } from 'vue';

/**
 * 创建弹窗实例
 * @param {Component} Component 弹窗组件
 * @param {Object} props 组件属性
 * @returns {Object} 包含组件实例和关闭方法的对象
 */
export function createModal(Component: Component, props = {}) {
    // 创建容器
    const container = document.createElement('div');

    // 创建vnode
    const vnode = createVNode(Component, {
        ...props,
        // 增加关闭回调，清理DOM
        onClose: () => {
            render(null, container);
            document.body.removeChild(container);
        }
    });

    // 渲染组件
    render(vnode, container);
    document.body.appendChild(container);

    // 返回组件实例和关闭方法
    return {
        instance: vnode.component,
        close: () => {
            render(null, container);
            document.body.removeChild(container);
        }
    };
}