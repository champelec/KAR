import { performCodeReview } from './services/reviewService.js';

const codeInput = document.getElementById('codeInput');
const submitBtn = document.getElementById('submitBtn');
const loader = document.getElementById('loader');
const resultBox = document.getElementById('resultBox');
const reviewOutput = document.getElementById('reviewOutput');

submitBtn.addEventListener('click', async () => {
    const userCode = codeInput.value.trim();

    if (!userCode) {
        alert('Пожалуйста, вставьте код для проверки.');
        return;
    }

    resultBox.classList.add('hidden');
    loader.classList.remove('hidden');
    submitBtn.disabled = true;

    try {
        const aiMessage = await performCodeReview(userCode);
        
        reviewOutput.textContent = aiMessage;
        resultBox.classList.remove('hidden');
    } catch (error) {
        console.error('Ошибка в процессе Code Review:', error);
	reviewOutput.textContent = 'Произошла ошибка при обращении к AI-ассистенту.';
        resultBox.classList.remove('hidden');
    } finally {
        loader.classList.add('hidden');
        submitBtn.disabled = false;
    }
});
