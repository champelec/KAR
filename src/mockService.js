// src/mockService.js

/**
 * Имитация ответа от OpenAI API
 */
export async function getCodeReview(userCode) {
    // Имитируем задержку сети 1.5 секунды
    await new Promise(resolve => setTimeout(resolve, 1500));

    // Простая логика: если в коде есть опасные моменты, 
    // возвращаем комментарий, иначе — хвалим.
    if (userCode.includes('eval(')) {
        return {
            status: 'success',
            choices: [{
                message: {
                    content: "ОШИБКА БЕЗОПАСНОСТИ: Функция eval() запрещена к использованию. Это критическая уязвимость."
                }
            }]
        };
    }

    return {
        status: 'success',
        choices: [{
            message: {
                content: "Код выглядит чисто. Рекомендую использовать строгий режим (use strict) для улучшения безопасности."
            }
        }]
    };
}

