import { jest } from '@jest/globals';
import { ESLint } from 'eslint';
import { performCodeReview } from '../src/services/reviewService.js';
import { openai } from '../src/api/openai.js';

describe('Конвейер: ИИ -> Статический анализ', () => {
    
    test('Сервис корректно отлавливает XSS-уязвимости и инъекции', async () => {
        // Отправляем код с паттерном, который мы добавили в усиленный API-мок
        const dangerousCode = "document.getElementById('app').innerHTML = userInput;";
        const aiResponse = await performCodeReview(dangerousCode);
        
        expect(aiResponse).toContain('ОШИБКА БЕЗОПАСНОСТИ');
    });

    test('Сервис корректно пропускает безопасный код (Happy Path)', async () => {
        const safeCode = "function sum(a, b) { return a + b; }";
        const aiResponse = await performCodeReview(safeCode);
        
        // Проверяем, что ИИ не нашел уязвимостей и вернул стандартную рекомендацию
        expect(aiResponse).toContain('Код выглядит чисто');
        expect(aiResponse).not.toContain('ОШИБКА БЕЗОПАСНОСТИ');
    });

    test('Проверка сгенерированного ИИ кода через ESLint', async () => {
        // 1. Перехватываем метод API, чтобы сымитировать возврат уязвимого кода от ИИ
        // (объявляем переменную, но не используем её - типичная ошибка)
        const spy = jest.spyOn(openai.chat.completions, 'create').mockResolvedValue({
            choices: [{ message: { content: "const secretToken = '12345';\nconsole.log('test');" } }]
        });

        // 2. Получаем этот код ЧЕРЕЗ наш сервис (замыкаем архитектурный слой)
        const aiResponse = await performCodeReview("Сгенерируй пример кода");

        // 3. Настраиваем строгий линтер
        const eslint = new ESLint({
            overrideConfigFile: true,
            overrideConfig: {
                languageOptions: { ecmaVersion: 2022, sourceType: 'module' },
                rules: { 'no-unused-vars': 'error' }
            }
        });

        // 4. Прогоняем реальный ответ ИИ через ESLint
        const results = await eslint.lintText(aiResponse);
        
        // 5. Ожидаем, что линтер найдет ошибку в коде от нейросети
        expect(results[0].errorCount).toBeGreaterThan(0);

        // Восстанавливаем оригинальный метод API
        spy.mockRestore();
    });
});
