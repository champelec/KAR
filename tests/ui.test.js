/**
 * @jest-environment jsdom
 */
import { jest } from '@jest/globals';
import { openai } from '../src/api/openai.js'; // Импортируем для проверки ошибок

describe('Пользовательский интерфейс (app.js)', () => {
    beforeAll(async () => {
        // Имитация DOM-дерева
        document.body.innerHTML = `
            <textarea id="codeInput"></textarea>
            <button id="submitBtn"></button>
            <div id="loader" class="hidden"></div>
            <div id="resultBox" class="hidden"></div>
            <div id="reviewOutput"></div>
        `;
        
        await import('../src/app.js');
    });

    beforeEach(() => {
        // Включаем виртуальное время Jest (чтобы тесты не ждали 1.5 секунды и не зависали)
        jest.useFakeTimers();
        
        // Сбрасываем интерфейс перед каждым тестом
        document.getElementById('codeInput').value = '';
        document.getElementById('submitBtn').disabled = false;
        document.getElementById('loader').classList.add('hidden');
        document.getElementById('resultBox').classList.add('hidden');
        document.getElementById('reviewOutput').textContent = '';
    });

    afterEach(() => {
        // Очищаем таймеры и моки после теста
        jest.runOnlyPendingTimers();
        jest.useRealTimers();
        jest.restoreAllMocks();
    });

    test('Отправка пустого кода не блокирует интерфейс', () => {
        const codeInput = document.getElementById('codeInput');
        const submitBtn = document.getElementById('submitBtn');
        
        window.alert = jest.fn();

        codeInput.value = '';
        submitBtn.click();

        expect(submitBtn.disabled).toBe(false);
        expect(window.alert).toHaveBeenCalled();
    });

    test('Полный цикл: клик -> лоадер -> ответ -> разблокировка', async () => {
        const codeInput = document.getElementById('codeInput');
        const submitBtn = document.getElementById('submitBtn');
        const loader = document.getElementById('loader');
        const resultBox = document.getElementById('resultBox');

        codeInput.value = 'console.log("Тест UI");';
        
        // 1. Имитируем клик
        submitBtn.click();

        // 2. Проверяем промежуточное состояние (сразу после клика)
        expect(submitBtn.disabled).toBe(true);
        expect(loader.classList.contains('hidden')).toBe(false);

        // 3. Мгновенно "перематываем" 1.5 секунды виртуального времени
        await jest.runAllTimersAsync();

        // 4. Проверяем финальное состояние
        expect(submitBtn.disabled).toBe(false);
        expect(loader.classList.contains('hidden')).toBe(true);
        expect(resultBox.classList.contains('hidden')).toBe(false);
        expect(document.getElementById('reviewOutput').textContent).toContain('Код выглядит чисто');
    });

    test('Обработка сетевой ошибки (блок catch)', async () => {
        // Искусственно ломаем API, чтобы проверить ветку ошибки
        jest.spyOn(openai.chat.completions, 'create').mockRejectedValue(new Error('Network Fail'));

        const codeInput = document.getElementById('codeInput');
        const submitBtn = document.getElementById('submitBtn');
        const loader = document.getElementById('loader');
        const resultBox = document.getElementById('resultBox');

        codeInput.value = 'const test = 1;';
        submitBtn.click();

        // Перематываем время до момента получения ошибки
        await jest.runAllTimersAsync();

        // Проверяем, что интерфейс восстановился и показал ошибку
        expect(submitBtn.disabled).toBe(false);
        expect(loader.classList.contains('hidden')).toBe(true);
        expect(resultBox.classList.contains('hidden')).toBe(false);
        expect(document.getElementById('reviewOutput').textContent).toBe('Произошла ошибка при обращении к AI-ассистенту.');
    });
});
