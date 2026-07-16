// src/services/reviewService.js
import { openai } from '../api/openai.js';

/**
 * Сервис для отправки кода на проверку.
 * Он изолирует логику работы с API от пользовательского интерфейса.
 */
export async function performCodeReview(userCode) {
    if (!userCode || userCode.trim() === '') {
        throw new Error('Код для проверки не предоставлен');
    }
    const completion = await openai.chat.completions.create({
        model: "gpt-4o-mini",
        messages: [
            { role: "system", content: "You are a helpful assistant for Code Review and Security." },
            { role: "user", content: userCode }
        ],
    });

    // Извлекаем и возвращаем только текст ответа
    return completion.choices[0].message.content;
}
