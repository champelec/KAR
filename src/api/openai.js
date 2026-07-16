// src/api/openai.js

// Мок по подобию OpenAI
export const openai = {
    chat: {
        completions: {
            async create(requestData) {
                // Имитация задержки
                await new Promise(resolve => setTimeout(resolve, 1500));

                const userMessage = requestData.messages.find(msg => msg.role === 'user');
                const userCode = userMessage ? userMessage.content : '';

                // Простой фильтр абракадабры:
                if (userCode.trim().length < 5 || !/[{}();=]/.test(userCode)) {
                    return {
                        choices: [{
                            message: {
                                content: "ОШИБКА ФОРМАТА: Текст не распознан как код. Пожалуйста, отправьте валидный скрипт (например, добавьте скобки или знаки равенства)."
                            }
                        }]
                    };
                }

                // Моя фича (список опасных паттернов для статического анализа)
                const dangerousPatterns = [
                    'eval(', 
                    'innerHTML', 
                    'document.write(', 
                ];
                
                // Проверка, есть ли в коде хотя бы один опасный паттерн
                const hasVulnerability = dangerousPatterns.some(pattern => userCode.includes(pattern));

                if (hasVulnerability) {
                    return {
                        choices: [{
                            message: {
                                content: "ОШИБКА БЕЗОПАСНОСТИ: В коде обнаружены критические уязвимости (возможно использование eval, XSS-векторы через innerHTML). Код отклонен."
                            }
                        }]
                    };
                }

                // Ура!!! Success)
                return {
                    choices: [{
                        message: {
                            content: "Код выглядит чисто. Рекомендую использовать 'use strict' для улучшения безопасности."
                        }
                    }]
                };
            }
        }
    }
};
