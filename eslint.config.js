import securityPlugin from 'eslint-plugin-security';

export default [
  {
    plugins: {
      security: securityPlugin,
    },
    rules: {
      // Подключаем базовые правила безопасности
      ...securityPlugin.configs.recommended.rules,
      // Строгие правила
      'no-unused-vars': 'warn', // предупреждения о неиспользуемых переменных
      'no-undef': 'error',      // ошибка, если переменная не объявлена
      'eqeqeq': 'error',        // требование строгого сравнения (===)
    },
    languageOptions: {
      ecmaVersion: 2022,
      sourceType: 'module',
    }
  }
];
