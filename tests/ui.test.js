/**
 * @jest-environment jsdom
 */
import { jest } from '@jest/globals';

describe('Пользовательский интерфейс (app.js)', () => {
    beforeAll(async () => {
        // 1. Имитация  DOM-дерева
        document.body.innerHTML = `
            <textarea id="codeInput"></textarea>
            <button id="submitBtn"></button>
            <div id="loader" class="hidden"></div>
            <div id="resultBox" class="hidden"></div>
            <div id="reviewOutput"></div>
        `;
        
        // 2. Динамически импортируем app.js
        await import('../src/app.js');
    });

    test('Отправка пустого кода не блокирует интерфейс', () => {
        const codeInput = document.getElementById('codeInput');
        const submitBtn = document.getElementById('submitBtn');
        
        // Перехватываем alert
        window.alert = jest.fn();

        codeInput.value = '';
        submitBtn.click();

        expect(submitBtn.disabled).toBe(false);
        expect(window.alert).toHaveBeenCalled();
    });

    test('Клик по кнопке показывает лоадер и блокирует повторную отправку', () => {
        const codeInput = document.getElementById('codeInput');
        const submitBtn = document.getElementById('submitBtn');
        const loader = document.getElementById('loader');

        codeInput.value = 'console.log("Тест UI");';
        submitBtn.click();

        expect(submitBtn.disabled).toBe(true);
        expect(loader.classList.contains('hidden')).toBe(false);
    });
});

