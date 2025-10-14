/**
 * Оптимизированный JavaScript для страницы урока - lesson-page.js
 * Объединяет функциональность из lesson-page.js и lesson-page-update.js
 */

document.addEventListener('DOMContentLoaded', function() {
    // Инициализация проверки домашнего задания
    setupHomeworkChecking();
    
    // Инициализация кнопок "Поделиться"
    setupShareButtons();
    
    // Инициализация кнопок навигации между уроками
    setupLessonNavigation();

    // Добавляем новую функцию
    setupChessDiagrams();
});

/**
 * Настройка проверки домашнего задания с учетом разных уроков
 */
function setupHomeworkChecking() {
    const checkButton = document.querySelector('.check-homework');
    
    if (!checkButton) return;
    
    checkButton.addEventListener('click', function() {
        // Определяем, на какой странице урока находимся
        const lessonPath = window.location.pathname;
        
        // Выбираем правильные ответы в зависимости от урока
        let correctAnswers = {};
        
        if (lessonPath.includes('peshechnyj-proryv')) {
            // Ответы для урока "Пешечный прорыв"
            correctAnswers = {
                task1: 'a', // b5
                task2: 'b'  // Наличие у соперника лишней пешки
            };
        } else if (lessonPath.includes('dvoinoi-udar')) {
            // Ответы для урока "Двойной удар"
            correctAnswers = {
                task1: 'a', // Кd5
                task2: 'a'  // Сf4
            };
        } else if (lessonPath.includes('debyutnye-principy')) {
            // Ответы для урока "Дебютные принципы"
            correctAnswers = {
                task1: 'a', // 1.e4
                task2: 'a'  // Кf3
            };
        } else {
            // Значения по умолчанию, если урок не определен
            correctAnswers = {
                task1: 'a',
                task2: 'a'
            };
        }
        
        // Получаем все выбранные ответы
        const task1Answer = document.querySelector('input[name="task1"]:checked');
        const task2Answer = document.querySelector('input[name="task2"]:checked');
        
        // Проверяем, выбраны ли ответы
        if (!task1Answer || !task2Answer) {
            showNotification('Пожалуйста, ответьте на все вопросы', 'warning');
            return;
        }
        
        // Проверяем ответы
        const task1Correct = task1Answer.value === correctAnswers.task1;
        const task2Correct = task2Answer.value === correctAnswers.task2;
        
        // Выделяем правильные и неправильные ответы
        highlightAnswers('task1', correctAnswers.task1);
        highlightAnswers('task2', correctAnswers.task2);
        
        // Определяем общий результат
        const totalCorrect = (task1Correct ? 1 : 0) + (task2Correct ? 1 : 0);
        const totalQuestions = 2;
        
        // Показываем результат
        let message, type;
        if (totalCorrect === totalQuestions) {
            message = 'Отлично! Все ответы верны!';
            type = 'success';
            
            // Сохраняем информацию о завершении урока
            const lessonId = getLessonId(lessonPath);
            if (lessonId) {
                localStorage.setItem(`lesson_completed_${lessonId}`, 'true');
            }
        } else if (totalCorrect > 0) {
            message = `Вы правильно ответили на ${totalCorrect} из ${totalQuestions} вопросов`;
            type = 'warning';
        } else {
            message = 'К сожалению, все ответы неверны. Попробуйте еще раз!';
            type = 'error';
        }
        
        showNotification(message, type);
        
        // Создаем сводку результатов
        createResultSummary(totalCorrect, totalQuestions);
    });
}

/**
 * Получает идентификатор урока из пути страницы
 */
function getLessonId(path) {
    const pathMatch = path.match(/\/lesson\/([^\/]+)/);
    return pathMatch ? pathMatch[1] : null;
}

/**
 * Выделяет правильные и неправильные ответы
 */
function highlightAnswers(taskName, correctValue) {
    const options = document.querySelectorAll(`input[name="${taskName}"]`);
    
    options.forEach(option => {
        const label = option.closest('.radio-label');
        if (!label) return;
        
        // Сбрасываем предыдущие стили
        label.classList.remove('correct', 'incorrect', 'correct-answer');
        
        // Если выбран этот вариант
        if (option.checked) {
            if (option.value === correctValue) {
                label.classList.add('correct');
            } else {
                label.classList.add('incorrect');
            }
        }
        
        // Всегда помечаем правильный ответ, даже если он не выбран
        if (option.value === correctValue && !option.checked) {
            label.classList.add('correct-answer');
        }
    });
}

/**
 * Создает сводку результатов после проверки домашнего задания
 */
function createResultSummary(correct, total) {
    // Проверяем, существует ли уже сводка
    let resultSummary = document.querySelector('.result-summary');
    
    if (resultSummary) {
        // Обновляем существующую сводку
        resultSummary.innerHTML = '';
    } else {
        // Создаем новую сводку
        resultSummary = document.createElement('div');
        resultSummary.className = 'result-summary';
        
        // Добавляем после кнопки проверки
        const checkButton = document.querySelector('.check-homework');
        if (checkButton) checkButton.after(resultSummary);
    }
    
    // Создаем заголовок
    const heading = document.createElement('h4');
    heading.textContent = 'Результаты проверки:';
    resultSummary.appendChild(heading);
    
    // Создаем текст результата
    const resultText = document.createElement('p');
    resultText.textContent = `Правильных ответов: ${correct} из ${total}`;
    resultSummary.appendChild(resultText);
    
    // Добавляем поясняющий текст
    const explanation = document.createElement('p');
    explanation.className = 'explanation-text';
    
    if (correct === total) {
        explanation.textContent = 'Отлично! Вы хорошо усвоили материал урока.';
    } else if (correct > 0) {
        explanation.textContent = 'Хороший результат, но рекомендуем еще раз просмотреть материал урока по темам, в которых были допущены ошибки.';
    } else {
        explanation.textContent = 'Рекомендуем внимательно перечитать материалы урока и посмотреть видео еще раз, чтобы лучше усвоить тему.';
    }
    
    resultSummary.appendChild(explanation);
    
    // Добавляем кнопку "Перейти к следующему уроку" если все ответы правильные
    if (correct === total) {
        const nextLessonBtn = document.createElement('a');
        const nextLessonLink = document.querySelector('.next-lesson');
        if (nextLessonLink) {
            nextLessonBtn.href = nextLessonLink.getAttribute('href');
            nextLessonBtn.className = 'btn btn-primary next-lesson-btn';
            nextLessonBtn.textContent = 'Перейти к следующему уроку';
            resultSummary.appendChild(nextLessonBtn);
        }
    }
}

/**
 * Настройка кнопок "Поделиться"
 */
function setupShareButtons() {
    const shareButtons = document.querySelectorAll('.share-button');
    
    if (shareButtons.length === 0) return;
    
    const pageUrl = encodeURIComponent(window.location.href);
    const pageTitle = encodeURIComponent(document.title);
    
    shareButtons.forEach(button => {
        button.addEventListener('click', function(e) {
            e.preventDefault();
            
            let shareUrl = '';
            
            // Определяем URL для шаринга в зависимости от социальной сети
            if (button.classList.contains('vk')) {
                shareUrl = `https://vk.com/share.php?url=${pageUrl}&title=${pageTitle}`;
            } else if (button.classList.contains('telegram')) {
                shareUrl = `https://t.me/share/url?url=${pageUrl}&text=${pageTitle}`;
            } else if (button.classList.contains('whatsapp')) {
                shareUrl = `https://api.whatsapp.com/send?text=${pageTitle}%20${pageUrl}`;
            }
            
            // Открываем окно для шаринга
            if (shareUrl) {
                window.open(shareUrl, '_blank', 'width=640,height=480');
            }
        });
    });
}

/**
 * Настройка кнопок навигации между уроками
 */
function setupLessonNavigation() {
    const prevButton = document.querySelector('.prev-lesson');
    const nextButton = document.querySelector('.next-lesson');
    
    if (!prevButton && !nextButton) return;
    
    // Определяем текущий урок
    const lessonPath = window.location.pathname;
    const lessonId = getLessonId(lessonPath);
    
    // Проверяем, завершен ли текущий урок
    const lessonCompleted = lessonId ? 
        localStorage.getItem(`lesson_completed_${lessonId}`) === 'true' : false;
    
    if (nextButton && !nextButton.classList.contains('disabled')) {
        if (!lessonCompleted) {
            // Если урок еще не завершен, добавляем подсказку
            nextButton.addEventListener('click', function(e) {
                if (!lessonCompleted) {
                    e.preventDefault();
                    showNotification('Завершите домашнее задание, чтобы разблокировать следующий урок', 'warning');
                }
            });
        }
    }
}

/**
 * Функция для отображения уведомлений (переиспользуем из main.js если она есть)
 */
function showNotification(message, type = 'info') {
    // Проверяем, есть ли уже функция в main.js
    if (typeof window.showNotification === 'function') {
        window.showNotification(message, type);
        return;
    }
    
    // Создаем элемент уведомления
    const notification = document.createElement('div');
    notification.className = `notification ${type}`;
    notification.textContent = message;
    
    // Добавляем кнопку закрытия
    const closeButton = document.createElement('button');
    closeButton.className = 'notification-close';
    closeButton.innerHTML = '&times;';
    closeButton.addEventListener('click', () => {
        document.body.removeChild(notification);
    });
    
    notification.appendChild(closeButton);
    document.body.appendChild(notification);
    
    // Автоматическое закрытие через 5 секунд
    setTimeout(() => {
        if (document.body.contains(notification)) {
            notification.classList.add('fade-out');
            setTimeout(() => {
                if (document.body.contains(notification)) {
                    document.body.removeChild(notification);
                }
            }, 300);
        }
    }, 5000);
}


/**
 * Настройка шахматных диаграмм для предотвращения автоматического открытия меню
 */
function setupChessDiagrams() {
    const chessIframes = document.querySelectorAll('.chess-diagram iframe');
    
    chessIframes.forEach(iframe => {
        // Добавляем параметры к URL, если они еще не добавлены
        let src = iframe.getAttribute('src');
        if (src && !src.includes('autoplay=0')) {
            src = src.includes('?') ? `${src}&autoplay=0&menu=false` : `${src}?autoplay=0&menu=false`;
            iframe.setAttribute('src', src);
        }
        
        // При клике на фрейм, предотвращаем автоматическое открытие меню
        iframe.addEventListener('load', function() {
            try {
                // Попытка избежать проблем с cross-origin
                iframe.contentWindow.postMessage('{"name":"focus"}', '*');
            } catch (e) {
                console.log('Cannot interact with iframe due to cross-origin policy.');
            }
        });
    });
}