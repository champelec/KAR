// Импортируем нашу функцию-заглушку
import { getCodeReview } from './mockService.js';

// Находим все нужные элементы на странице
const codeInput = document.getElementById('codeInput');
const submitBtn = document.getElementById('submitBtn');
const loader = document.getElementById('loader');
const resultBox = document.getElementById('resultBox');
const reviewOutput = document.getElementById('reviewOutput');

// Добавляем действие на клик по кнопке
submitBtn.addEventListener('click', async () => {
    // Берем текст, который ввел пользователь
    const userCode = codeInput.value.trim();

    // Если поле пустое - ругаемся
    if (!userCode) {
        alert('Пожалуйста, вставьте код для проверки.');
        return;
    }

    // Прячем старый результат, показываем текст загрузки и отключаем кнопку
    resultBox.classList.add('hidden');
    loader.classList.remove('hidden');
    submitBtn.disabled = true;

    try {
        // Вызываем ИИ (наш мок) и ждем ответа
        const response = await getCodeReview(userCode);
        
        // Разбираем ответ согласно контракту OpenAI из ТЗ
        const aiMessage = response.choices[0].message.content;

        // Вставляем ответ ИИ на страницу
        reviewOutput.textContent = aiMessage;
        
        // Показываем блок с результатом
        resultBox.classList.remove('hidden');
    } catch (error) {
        // Если что-то пошло не так (например, пропал интернет)
        reviewOutput.textContent = 'Произошла ошибка при обращении к AI-ассистенту.';
        resultBox.classList.remove('hidden');
    } finally {
        // В любом случае прячем индикатор загрузки и включаем кнопку
        loader.classList.add('hidden');
        submitBtn.disabled = false;
    }
});
