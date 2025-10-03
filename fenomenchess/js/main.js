/**
 * Основной JavaScript файл - main.js
 * Содержит общую функциональность для всех страниц сайта
 */

document.addEventListener('DOMContentLoaded', function() {
    // Мобильное меню
    setupMobileMenu();
    
    // Инициализация форм обратной связи
    setupForms();
    
    // Плавная прокрутка к якорям
    setupSmoothScroll();
    
    // Анимация при прокрутке
    setupScrollAnimations();

     // ===== ДОБАВЬ ЭТУ СТРОКУ =====
    setupHeaderBehavior(); // <--- Активируем поведение хедера
    // ===============================
});

/**
 * Настройка мобильного меню
 */
function setupMobileMenu() {
    const mobileMenuToggle = document.querySelector('.mobile-menu-toggle');
    const mainNav = document.querySelector('.main-nav');
    
    if (mobileMenuToggle && mainNav) {
        mobileMenuToggle.addEventListener('click', function() {
            mainNav.classList.toggle('active');
            this.classList.toggle('active');
        });
        
        // Закрыть меню при клике по ссылке
        const navLinks = mainNav.querySelectorAll('a');
        navLinks.forEach(link => {
            link.addEventListener('click', function() {
                if (window.innerWidth <= 768) {
                    mainNav.classList.remove('active');
                    mobileMenuToggle.classList.remove('active');
                }
            });
        });
    }
}

/**
 * Настройка обработки форм
 */
function setupForms() {
    const forms = document.querySelectorAll('form');
    forms.forEach(form => {
        form.addEventListener('submit', function(event) {
            event.preventDefault();
            
            // Имитация отправки формы
            const submitButton = form.querySelector('button[type="submit"]');
            const originalText = submitButton.textContent;
            
            submitButton.disabled = true;
            submitButton.textContent = 'Отправка...';
            
            // Имитация задержки сетевого запроса
            setTimeout(() => {
                // Сброс формы
                form.reset();
                
                // Показ уведомления
                showNotification('Успешно отправлено!', 'success');
                
                // Восстановление кнопки
                submitButton.disabled = false;
                submitButton.textContent = originalText;
            }, 1500);
        });
    });
}

/**
 * Показ уведомления пользователю
 * @param {string} message - Текст уведомления
 * @param {string} type - Тип уведомления (success, error, warning)
 */
function showNotification(message, type = 'info') {
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
 * Настройка плавной прокрутки для якорных ссылок
 */
function setupSmoothScroll() {
    // Исключаем ссылки из боковой навигации, чтобы избежать конфликтов
    document.querySelectorAll('a[href^="#"]:not(.sidebar-navigation a)').forEach(anchor => {
        anchor.addEventListener('click', function(e) {
            const target = document.querySelector(this.getAttribute('href'));
            
            if (target) {
                e.preventDefault();
                
                window.scrollTo({
                    top: target.offsetTop - 80, // Учитываем высоту хедера
                    behavior: 'smooth'
                });
            }
        });
    });
}


/**
 * Настройка анимаций при прокрутке страницы
 */
function setupScrollAnimations() {
    const elements = document.querySelectorAll('.animate-on-scroll');
    
    // Проверяем поддержку Intersection Observer
    if ('IntersectionObserver' in window) {
        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    entry.target.classList.add('animated');
                    observer.unobserve(entry.target);
                }
            });
        }, { threshold: 0.1 });
        
        elements.forEach(element => {
            observer.observe(element);
        });
    } else {
        // Запасной вариант для браузеров без поддержки Intersection Observer
        elements.forEach(element => {
            element.classList.add('animated');
        });
    }
}

/**
 * Переключение темной/светлой темы (заготовка для будущего функционала)
 */
function toggleTheme() {
    document.body.classList.toggle('dark-theme');
    const isDarkTheme = document.body.classList.contains('dark-theme');
    localStorage.setItem('darkTheme', isDarkTheme);
}

/**
 * Вспомогательная функция для добавления CSS классов к элементам с задержкой
 * @param {HTMLElement} element - HTML элемент
 * @param {string} className - Имя класса для добавления
 * @param {number} delay - Задержка в миллисекундах
 */
function addClassWithDelay(element, className, delay) {
    setTimeout(() => {
        element.classList.add(className);
    }, delay);
}

/**
 * Автоматическое скрытие шапки при прокрутке вниз
 * Добавьте эту функцию в main.js
 */
function setupHeaderBehavior() {
    const mainHeader = document.querySelector('.main-header');
    const sidebar = document.querySelector('.lesson-sidebar'); // Убедись, что у твоего сайдбара есть этот класс
    let lastScrollTop = 0;
    let scrollThreshold = 100; // Минимальная прокрутка для начала скрытия
    
    if (!mainHeader) return; // Если хедера нет, ничего не делаем

    // Добавляем класс для фиксированной шапки
    mainHeader.classList.add('fixed-header');
    
    // Добавляем отступ для тела страницы, равный высоте шапки
    // Важно: этот код должен выполниться после того, как хедер станет fixed и его высота будет корректной
    let headerHeight = mainHeader.offsetHeight;
    document.body.style.paddingTop = `${headerHeight}px`;
    
    // Обновляем отступ и высоту при загрузке и изменении размера окна
    const updateBodyPadding = () => {
        headerHeight = mainHeader.offsetHeight;
        document.body.style.paddingTop = `${headerHeight}px`;
        
        // Обновляем положение бокового меню при изменении размера
        if (sidebar) {
            if (window.innerWidth <= 992) {
                sidebar.style.top = mainHeader.classList.contains('header-hidden') ? '0' : `${headerHeight}px`;
            } else {
                sidebar.style.top = mainHeader.classList.contains('header-hidden') ? '20px' : `calc(${headerHeight}px + 20px)`;
            }
        }
    };

    window.addEventListener('load', updateBodyPadding); // При полной загрузке
    window.addEventListener('resize', updateBodyPadding); // При изменении размера окна

    // Обработчик события прокрутки
    window.addEventListener('scroll', function() {
        const scrollTop = window.pageYOffset || document.documentElement.scrollTop;
        headerHeight = mainHeader.offsetHeight; // Пересчитываем высоту на случай динамических изменений
        
        // Если прокручиваем вниз и прошли пороговое значение
        if (scrollTop > lastScrollTop && scrollTop > scrollThreshold) {
            mainHeader.classList.add('header-hidden');
            
            if (sidebar) {
                if (window.innerWidth <= 992) {
                    sidebar.style.top = '0';
                } else {
                    sidebar.style.top = '20px'; // Отступ от верха окна, когда хедер скрыт
                }
            }
        } 
        // Если прокручиваем вверх
        else if (scrollTop < lastScrollTop || scrollTop <= scrollThreshold ) { // Показываем, если скроллим вверх или выше порога
            mainHeader.classList.remove('header-hidden');
            
            if (sidebar) {
                 if (window.innerWidth <= 992) {
                    sidebar.style.top = `${headerHeight}px`; // Под хедером
                } else {
                    sidebar.style.top = `calc(${headerHeight}px + 20px)`; // С отступом от хедера
                }
            }
        }
        
        lastScrollTop = scrollTop <= 0 ? 0 : scrollTop; // Для корректной работы на iOS
    }, false); // Добавил false для поддержки старых браузеров, хотя обычно не обязательно
}