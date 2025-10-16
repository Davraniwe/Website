/**
 * Оптимизированный JavaScript для боковой навигации - sidebar-navigation.js
 */

document.addEventListener('DOMContentLoaded', function() {
    // Инициализация переключателя боковой панели для мобильных устройств
    setupSidebarToggle();
    
    // Настройка активных ссылок и плавной прокрутки
    setupSidebarLinks();
    
    // Оптимизированная функция для фиксированной боковой панели
    setupFixedSidebar();
});

/**
 * Настройка переключателя боковой панели для мобильных устройств
 */
function setupSidebarToggle() {
    const sidebarToggle = document.querySelector('.sidebar-toggle-mobile');
    const sidebarNav = document.querySelector('.sidebar-navigation');
    
    if (sidebarToggle && sidebarNav) {
        // Улучшаем обработчик кликов для мобильных устройств
        sidebarToggle.addEventListener('click', function(e) {
            e.preventDefault();
            e.stopPropagation();
            
            // Переключаем классы для анимации
            this.classList.toggle('active');
            sidebarNav.classList.toggle('active');
        });
        
        // Закрываем меню при клике вне его
        document.addEventListener('click', function(e) {
            if (!sidebarNav.contains(e.target) && !sidebarToggle.contains(e.target) && sidebarNav.classList.contains('active')) {
                sidebarNav.classList.remove('active');
                sidebarToggle.classList.remove('active');
            }
        });
    }
}

/**
 * Улучшенные функции для мобильного бокового меню
 * Добавляется в sidebar-navigation.js
 */

// Заменяет существующую функцию setupSidebarToggle
// function setupSidebarToggle() {
//     const sidebarToggle = document.querySelector('.sidebar-toggle-mobile');
//     const sidebarNav = document.querySelector('.sidebar-navigation');
//     const sidebarHeader = document.querySelector('.sidebar-header');
    
//     if (sidebarToggle && sidebarNav) {
//         // Улучшаем обработчик кликов для мобильных устройств
//         sidebarToggle.addEventListener('click', function(e) {
//             e.preventDefault();
//             e.stopPropagation();
            
//             // Переключаем классы для анимации
//             this.classList.toggle('active');
//             sidebarNav.classList.toggle('active');
            
//             // Изменяем текст кнопки в зависимости от состояния
//             const toggleText = this.getAttribute('data-text') || '';
//             const toggleTextAlt = this.getAttribute('data-text-alt') || '';
            
//             if (toggleText && toggleTextAlt) {
//                 if (this.classList.contains('active')) {
//                     this.setAttribute('data-text-current', toggleText);
//                     this.setAttribute('aria-label', toggleTextAlt);
//                 } else {
//                     this.setAttribute('data-text-current', toggleTextAlt);
//                     this.setAttribute('aria-label', toggleText);
//                 }
//             }
            
//             // Добавляем класс header, чтобы изменить его внешний вид при активном меню
//             if (sidebarHeader) {
//                 sidebarHeader.classList.toggle('menu-open');
//             }
//         });
        
//         // Закрываем меню при клике вне его
//         document.addEventListener('click', function(e) {
//             if (!sidebarNav.contains(e.target) && !sidebarToggle.contains(e.target) && sidebarNav.classList.contains('active')) {
//                 sidebarNav.classList.remove('active');
//                 sidebarToggle.classList.remove('active');
                
//                 if (sidebarHeader) {
//                     sidebarHeader.classList.remove('menu-open');
//                 }
//             }
//         });
        
//         // Для доступности с клавиатуры
//         sidebarToggle.addEventListener('keydown', function(e) {
//             if (e.key === 'Enter' || e.key === ' ') {
//                 e.preventDefault();
//                 this.click();
//             }
//         });
        
//         // Закрываем меню при изменении размера окна на desktop
//         window.addEventListener('resize', function() {
//             if (window.innerWidth > 992 && sidebarNav.classList.contains('active')) {
//                 sidebarNav.classList.remove('active');
//                 sidebarToggle.classList.remove('active');
                
//                 if (sidebarHeader) {
//                     sidebarHeader.classList.remove('menu-open');
//                 }
//             }
//         });
//     }
    
//     // Закрытие меню при клике на ссылку (для мобильных)
//     const menuLinks = document.querySelectorAll('.sidebar-navigation a');
//     menuLinks.forEach(link => {
//         link.addEventListener('click', function() {
//             if (window.innerWidth <= 992 && sidebarNav.classList.contains('active')) {
//                 sidebarNav.classList.remove('active');
//                 sidebarToggle.classList.remove('active');
                
//                 if (sidebarHeader) {
//                     sidebarHeader.classList.remove('menu-open');
//                 }
//             }
//         });
//     });
// }

// Заменяет или дополняет существующую функцию setupFixedSidebar
function setupFixedSidebar() {
    const sidebar = document.querySelector('.lesson-sidebar');
    const header = document.querySelector('.main-header');
    const sidebarNav = document.querySelector('.sidebar-navigation');
    
    if (!sidebar || !header) return;
    
    // Получаем высоту хедера
    const headerHeight = header.offsetHeight;
    
    if (window.innerWidth <= 992) {
        // Мобильная версия - закрепляем под хедером
        sidebar.style.position = 'sticky';
        sidebar.style.top = `${headerHeight}px`;
        sidebar.style.zIndex = '100';
        
        // Устанавливаем максимальную высоту для выпадающего меню
        if (sidebarNav) {
            sidebarNav.style.maxHeight = 'none'; // Сбрасываем для расчета
            const viewportHeight = window.innerHeight;
            const sidebarTop = sidebar.getBoundingClientRect().top + window.pageYOffset;
            const maxHeight = viewportHeight - (sidebarTop - window.pageYOffset) - 20;
            
            // Применяем только при активном меню через CSS-класс
            document.documentElement.style.setProperty('--sidebar-max-height', `${maxHeight}px`);
        }
    } else {
        // Десктопная версия
        sidebar.style.position = 'sticky';
        sidebar.style.top = `${headerHeight + 20}px`;
        sidebar.style.zIndex = '1';
        
        // НЕ устанавливаем maxHeight, чтобы избежать обрезания контента
        sidebar.style.overflow = 'auto';
        
        // Отступ снизу для контента
        const contentElement = document.querySelector('.lesson-content');
        if (contentElement) {
            contentElement.style.paddingBottom = '30px';
        }
    }
    
    // Обновляем положение при изменении размера окна
    window.addEventListener('resize', function() {
        if (window.innerWidth <= 992) {
            // Мобильная версия
            sidebar.style.position = 'sticky';
            sidebar.style.top = `${header.offsetHeight}px`;
            sidebar.style.zIndex = '100';
            
            // Обновляем максимальную высоту для выпадающего меню
            if (sidebarNav) {
                const viewportHeight = window.innerHeight;
                const sidebarTop = sidebar.getBoundingClientRect().top + window.pageYOffset;
                const maxHeight = viewportHeight - (sidebarTop - window.pageYOffset) - 20;
                document.documentElement.style.setProperty('--sidebar-max-height', `${maxHeight}px`);
            }
        } else {
            // Десктопная версия
            sidebar.style.position = 'sticky';
            sidebar.style.top = `${header.offsetHeight + 20}px`;
            sidebar.style.zIndex = '1';
        }
    });
}

/**
 * Настройка активных ссылок в боковой панели и плавной прокрутки
 * ИСПРАВЛЕНО: улучшен способ вычисления позиции для прокрутки
 */
function setupSidebarLinks() {
    const sidebarLinks = document.querySelectorAll('.sidebar-navigation a');
    const header = document.querySelector('.main-header');
    const headerHeight = header ? header.offsetHeight : 0;
    
    // Настраиваем обработчики для плавной прокрутки
    sidebarLinks.forEach(link => {
        // Используем фазу захвата для обеспечения приоритета над другими обработчиками
        link.addEventListener('click', function(e) {
            const targetId = this.getAttribute('href');
            if (!targetId || !targetId.startsWith('#')) return;
            
            const targetElement = document.querySelector(targetId);
            if (!targetElement) return;
            
            e.preventDefault();
            e.stopPropagation(); // Предотвращаем всплытие события к другим обработчикам
            
            // ИСПРАВЛЕНО: Используем getClientRects() и текущую прокрутку для более точного позиционирования
            const scrollTop = window.pageYOffset || document.documentElement.scrollTop;
            const elementRect = targetElement.getBoundingClientRect();
            const absoluteElementTop = scrollTop + elementRect.top;
            const offset = headerHeight + 20;
            
            // Более точное вычисление позиции прокрутки
            const targetPosition = absoluteElementTop - offset;
            
            // Плавно прокручиваем к элементу
            window.scrollTo({
                top: targetPosition,
                behavior: 'smooth'
            });
            
            // Устанавливаем активный класс для ссылки
            sidebarLinks.forEach(l => l.classList.remove('active'));
            link.classList.add('active');
            
            // Обновляем URL для возможности обмена ссылкой с якорем
            history.pushState(null, null, targetId);
        }, true); // Используем фазу захвата для приоритета над обработчиками из main.js
    });
    
    // Затем установим ScrollSpy для автоматического обновления активных ссылок при прокрутке
    setupScrollSpy(sidebarLinks, headerHeight);
}

/**
 * Улучшенные функции для мобильного бокового меню
 * Добавляется в sidebar-navigation.js
 */

// Заменяет существующую функцию setupSidebarToggle
// function setupSidebarToggle() {
//     const sidebarToggle = document.querySelector('.sidebar-toggle-mobile');
//     const sidebarNav = document.querySelector('.sidebar-navigation');
//     const sidebarHeader = document.querySelector('.sidebar-header');
    
//     if (sidebarToggle && sidebarNav) {
//         // Улучшаем обработчик кликов для мобильных устройств
//         sidebarToggle.addEventListener('click', function(e) {
//             e.preventDefault();
//             e.stopPropagation();
            
//             // Переключаем классы для анимации
//             this.classList.toggle('active');
//             sidebarNav.classList.toggle('active');
            
//             // Изменяем текст кнопки в зависимости от состояния
//             const toggleText = this.getAttribute('data-text') || '';
//             const toggleTextAlt = this.getAttribute('data-text-alt') || '';
            
//             if (toggleText && toggleTextAlt) {
//                 if (this.classList.contains('active')) {
//                     this.setAttribute('data-text-current', toggleText);
//                     this.setAttribute('aria-label', toggleTextAlt);
//                 } else {
//                     this.setAttribute('data-text-current', toggleTextAlt);
//                     this.setAttribute('aria-label', toggleText);
//                 }
//             }
            
//             // Добавляем класс header, чтобы изменить его внешний вид при активном меню
//             if (sidebarHeader) {
//                 sidebarHeader.classList.toggle('menu-open');
//             }
//         });
        
//         // Закрываем меню при клике вне его
//         document.addEventListener('click', function(e) {
//             if (!sidebarNav.contains(e.target) && !sidebarToggle.contains(e.target) && sidebarNav.classList.contains('active')) {
//                 sidebarNav.classList.remove('active');
//                 sidebarToggle.classList.remove('active');
                
//                 if (sidebarHeader) {
//                     sidebarHeader.classList.remove('menu-open');
//                 }
//             }
//         });
        
//         // Для доступности с клавиатуры
//         sidebarToggle.addEventListener('keydown', function(e) {
//             if (e.key === 'Enter' || e.key === ' ') {
//                 e.preventDefault();
//                 this.click();
//             }
//         });
        
//         // Закрываем меню при изменении размера окна на desktop
//         window.addEventListener('resize', function() {
//             if (window.innerWidth > 992 && sidebarNav.classList.contains('active')) {
//                 sidebarNav.classList.remove('active');
//                 sidebarToggle.classList.remove('active');
                
//                 if (sidebarHeader) {
//                     sidebarHeader.classList.remove('menu-open');
//                 }
//             }
//         });
//     }
    
//     // Закрытие меню при клике на ссылку (для мобильных)
//     const menuLinks = document.querySelectorAll('.sidebar-navigation a');
//     menuLinks.forEach(link => {
//         link.addEventListener('click', function() {
//             if (window.innerWidth <= 992 && sidebarNav.classList.contains('active')) {
//                 sidebarNav.classList.remove('active');
//                 sidebarToggle.classList.remove('active');
                
//                 if (sidebarHeader) {
//                     sidebarHeader.classList.remove('menu-open');
//                 }
//             }
//         });
//     });
// }

// Заменяет или дополняет существующую функцию setupFixedSidebar
function setupFixedSidebar() {
    const sidebar = document.querySelector('.lesson-sidebar');
    const header = document.querySelector('.main-header');
    const sidebarNav = document.querySelector('.sidebar-navigation');
    
    if (!sidebar || !header) return;
    
    // Получаем высоту хедера
    const headerHeight = header.offsetHeight;
    
    if (window.innerWidth <= 992) {
        // Мобильная версия - закрепляем под хедером
        sidebar.style.position = 'sticky';
        sidebar.style.top = `${headerHeight}px`;
        sidebar.style.zIndex = '100';
        
        // Устанавливаем максимальную высоту для выпадающего меню
        if (sidebarNav) {
            sidebarNav.style.maxHeight = 'none'; // Сбрасываем для расчета
            const viewportHeight = window.innerHeight;
            const sidebarTop = sidebar.getBoundingClientRect().top + window.pageYOffset;
            const maxHeight = viewportHeight - (sidebarTop - window.pageYOffset) - 20;
            
            // Применяем только при активном меню через CSS-класс
            document.documentElement.style.setProperty('--sidebar-max-height', `${maxHeight}px`);
        }
    } else {
        // Десктопная версия
        sidebar.style.position = 'sticky';
        sidebar.style.top = `${headerHeight + 20}px`;
        sidebar.style.zIndex = '1';
        
        // НЕ устанавливаем maxHeight, чтобы избежать обрезания контента
        sidebar.style.overflow = 'auto';
        
        // Отступ снизу для контента
        const contentElement = document.querySelector('.lesson-content');
        if (contentElement) {
            contentElement.style.paddingBottom = '30px';
        }
    }
    
    // Обновляем положение при изменении размера окна
    window.addEventListener('resize', function() {
        if (window.innerWidth <= 992) {
            // Мобильная версия
            sidebar.style.position = 'sticky';
            sidebar.style.top = `${header.offsetHeight}px`;
            sidebar.style.zIndex = '100';
            
            // Обновляем максимальную высоту для выпадающего меню
            if (sidebarNav) {
                const viewportHeight = window.innerHeight;
                const sidebarTop = sidebar.getBoundingClientRect().top + window.pageYOffset;
                const maxHeight = viewportHeight - (sidebarTop - window.pageYOffset) - 20;
                document.documentElement.style.setProperty('--sidebar-max-height', `${maxHeight}px`);
            }
        } else {
            // Десктопная версия
            sidebar.style.position = 'sticky';
            sidebar.style.top = `${header.offsetHeight + 20}px`;
            sidebar.style.zIndex = '1';
        }
    });
}

/**
 * Настройка ScrollSpy для автоматического выделения активных пунктов меню при прокрутке
 */
function setupScrollSpy(sidebarLinks, headerOffset) {
    // Собираем все секции, на которые могут ссылаться ссылки в боковой панели
    const sections = Array.from(sidebarLinks).map(link => {
        const targetId = link.getAttribute('href');
        if (!targetId || !targetId.startsWith('#')) return null;

        const section = document.querySelector(targetId);
        // Определяем, является ли это подглавой (ссылка находится во вложенном <ul>)
        const isSubchapter = link.closest('li').parentElement.closest('li') !== null;
        return { id: targetId, element: section, link: link, isSubchapter: isSubchapter };
    }).filter(item => item && item.element);

    if (sections.length === 0) return;

    // Функция для определения, какой раздел находится в области просмотра
    function findVisibleSection() {
        let visibleSections = [];

        // Собираем все видимые секции
        for (const section of sections) {
            const rect = section.element.getBoundingClientRect();
            // Проверяем, находится ли верхняя часть секции в области просмотра с учетом отступа хедера
            if (rect.top <= headerOffset + 100 && rect.bottom > headerOffset) {
                visibleSections.push(section);
            }
        }

        if (visibleSections.length === 0) return null;

        // Приоритизируем подглавы перед главными главами
        // Сначала ищем видимую подглаву
        const visibleSubchapter = visibleSections.find(s => s.isSubchapter);
        if (visibleSubchapter) {
            return visibleSubchapter;
        }

        // Если нет видимых подглав, возвращаем первую видимую главу
        return visibleSections[0];
    }

    // Функция для обновления активной ссылки
    function updateActiveLink() {
        const visibleSection = findVisibleSection();

        if (!visibleSection) {
            // Если нет видимых секций, возможно, мы находимся в начале страницы или в конце
            return;
        }

        // Сначала сбрасываем все активные ссылки
        sidebarLinks.forEach(link => link.classList.remove('active'));

        // Делаем активной найденную ссылку
        visibleSection.link.classList.add('active');
    }

    // Устанавливаем отслеживание прокрутки с дебаунсингом
    let scrollTimeout;
    window.addEventListener('scroll', function() {
        if (scrollTimeout) clearTimeout(scrollTimeout);
        scrollTimeout = setTimeout(updateActiveLink, 100);
    });

    // Вызываем функцию один раз при загрузке страницы
    updateActiveLink();

    // И еще раз после полной загрузки страницы (для корректной работы с изображениями и т.д.)
    window.addEventListener('load', updateActiveLink);
}

/**
 * Оптимизированная функция для фиксации боковой панели при прокрутке
 */
function setupFixedSidebar() {
    const sidebar = document.querySelector('.lesson-sidebar');
    const header = document.querySelector('.main-header');
    
    if (!sidebar || !header || window.innerWidth <= 992) return;
    
    // Получаем высоту хедера
    const headerHeight = header.offsetHeight;
    
    // Устанавливаем только необходимые стили для фиксированной боковой панели
    sidebar.style.position = 'sticky';
    sidebar.style.top = `${headerHeight + 20}px`;
    
    // НЕ устанавливаем maxHeight, чтобы избежать обрезания контента
    // Вместо этого даем возможность панели прокручиваться внутри себя
    sidebar.style.overflow = 'auto';
    
    // Отступ снизу для контента
    document.querySelector('.lesson-content').style.paddingBottom = '30px';
    
    // Обновляем положение при изменении размера окна
    window.addEventListener('resize', function() {
        if (window.innerWidth <= 992) {
            // Сбрасываем стили на мобильном
            sidebar.style.position = '';
            sidebar.style.top = '';
            sidebar.style.overflow = '';
            return;
        }
        
        // Обновляем позицию сайдбара
        sidebar.style.position = 'sticky';
        sidebar.style.top = `${header.offsetHeight + 20}px`;
    });
}