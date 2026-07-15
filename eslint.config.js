import securityPlugin from 'eslint-plugin-security';

export default [
  {
    plugins: {
      security: securityPlugin,
    },
    rules: {
      // Подключаем базовые правила безопасности
      ...securityPlugin.configs.recommended.rules,
      // Добавим парочку стандартных строгих правил
      'no-unused-vars': 'warn', // предупреждать о неиспользуемых переменных
      'no-undef': 'error',      // ошибка, если переменная не объявлена
      'eqeqeq': 'error',        // требовать строгое сравнение (===)
    },
    languageOptions: {
      ecmaVersion: 2022,
      sourceType: 'module',
    }
  }
];
