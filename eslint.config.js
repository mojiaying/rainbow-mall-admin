import antfu from '@antfu/eslint-config'

export default antfu({
  ignores: [
    'types/auto-imports.d.ts',
    'types/components.d.ts',
    'public',
    'tsconfig.*.json',
    'tsconfig.json',
  ],
}, {
  rules: {
    'no-console': 0,
    'style/quote-props': 0,
    'indent': ['error', 2, { 'SwitchCase': 1 }],
    'unused-imports/no-unused-vars': 0,
    'ts/no-unused-expressions': 0,
    'max-len': 'off',
    'linebreak-style': ['error', 'unix'],
    'object-curly-newline': 'off',
    'array-bracket-newline': 'off',
    'react/jsx-one-expression-per-line': 'off',
    'react/jsx-wrap-multilines': 'off',
    // 对象花括号内空格（示例：{ key: value }）
    'object-curly-spacing': ['error', 'always'], // 必须有空格
    // 'object-curly-spacing': ['error', 'never'], // 禁止有空格

    // 数组方括号内空格（示例：[ 1, 2 ]）
    'array-bracket-spacing': ['error', 'never'], // 禁止有空格

    // 函数调用括号内空格（示例：fn( arg )）
    'func-call-spacing': ['error', 'never'], // 禁止括号内有空格
    'vue/singleline-html-element-content-newline': ['error', {
      ignoreWhenNoAttributes: true,
      ignoreWhenEmpty: true,
      ignores: ['a-button', 'a-input', 'a-tag', 'router-link'],
    }],
    'vue/html-closing-bracket-newline': ['error', {
      'singleline': 'never', // 单行标签：never（不换行）、always（换行）
      'multiline': 'off', // 多行标签：always（换行）、never（不换行）
    }]
  },
})
