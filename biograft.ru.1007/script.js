// script.js

// ===============================
// Функция для переключения языка
// ===============================
function setLanguage(language) {
  // Сохраняем выбранный язык в localStorage
  localStorage.setItem('language', language);

  const t = translations[language];

  // Список элементов для перевода
  const elementsToTranslate = [
    // Header elements
    { id: 'logoText', textKey: 'logoText' },
    { id: 'navAbout', textKey: 'navAbout' },
    { id: 'navProblem', textKey: 'navProblem' },
    { id: 'navSolutions', textKey: 'navSolutions' },
    { id: 'navAdvantages', textKey: 'navAdvantages' },
    { id: 'navFAQ', textKey: 'navFAQ' },
    { id: 'navContact', textKey: 'navContact' },
    // Hero section
    { id: 'heroTitle', textKey: 'heroTitle' },
    { id: 'heroSubtitle', textKey: 'heroSubtitle' },
    { id: 'contactButton', textKey: 'contactButton' },
    // About Us section
    { id: 'aboutTitle', textKey: 'aboutTitle' },
    { id: 'aboutText1', textKey: 'aboutText1', isHTML: true },
    { id: 'aboutText2', textKey: 'aboutText2' },
    // Problem section
    { id: 'problemTitle', textKey: 'problemTitle' },
    { id: 'problemText', textKey: 'problemText' },
    // Solutions and Molecular Medicine section
    { id: 'solutionsTitle', textKey: 'solutionsTitle' },
    { id: 'solutionsGenetic', textKey: 'solutionsGenetic' },
    { id: 'solutionsGeneticText', textKey: 'solutionsGeneticText' },
    { id: 'solutionsNano', textKey: 'solutionsNano' },
    { id: 'solutionsNanoText', textKey: 'solutionsNanoText' },
    { id: 'solutionsNerve', textKey: 'solutionsNerve' },
    { id: 'solutionsNerveText', textKey: 'solutionsNerveText' },
    { id: 'molecularTitle', textKey: 'molecularTitle' },
    { id: 'molecularIntro', textKey: 'molecularIntro' },
    { id: 'vegfTitle', textKey: 'vegfTitle' },
    { id: 'gdnfTitle', textKey: 'gdnfTitle' },
    { id: 'interaction', textKey: 'interaction', isHTML: true },
    { id: 'boneIntro', textKey: 'boneIntro' },
    { id: 'bmpTitle', textKey: 'bmpTitle' },
    { id: 'vegfBoneTitle', textKey: 'vegfBoneTitle' },
    { id: 'interactionBone', textKey: 'interactionBone', isHTML: true },
    // Advantages section
    { id: 'advantagesTitle', textKey: 'advantagesTitle' },
    // Product Features section
    { id: 'productFeaturesTitle', textKey: 'productFeaturesTitle' },
    { id: 'product1Title', textKey: 'product1Title' },
    { id: 'product2Title', textKey: 'product2Title' },
    // Contact section
    { id: 'contactTitle', textKey: 'contactTitle' },
    { id: 'contactText', textKey: 'contactText' },
    { id: 'formName', textKey: 'formName' },
    { id: 'formEmail', textKey: 'formEmail' },
    { id: 'formMessage', textKey: 'formMessage' },
    { id: 'formSubmit', textKey: 'formSubmit' },
    // Footer
    { id: 'footerText', textKey: 'footerText' },
    { id: 'copyright', textKey: 'copyright' },
  ];

  // Обновляем текст элементов на странице
  elementsToTranslate.forEach(item => {
    const element = document.getElementById(item.id);
    if (element && t[item.textKey] !== undefined) {
      if (item.isHTML) {
        element.innerHTML = t[item.textKey];
      } else {
        element.textContent = t[item.textKey];
      }
    }
  });

  // Обновляем список преимуществ
  updateList('advantagesList', t.advantagesList, true);

  // Обновляем характеристики продуктов
  updateList('product1Features', t.product1Features);
  updateList('product2Features', t.product2Features);

  // Обновляем списки в разделе "Молекулярная медицина"
  updateList('vegfList', t.vegfList);
  updateList('gdnfList', t.gdnfList);
  updateList('bmpList', t.bmpList);
  updateList('vegfBoneList', t.vegfBoneList);

  // Обновляем FAQ
  updateFAQ(t.faqQuestions);

  // Обновляем активное состояние кнопок переключения языка
  document.querySelectorAll('.language-switcher button').forEach(button => {
    button.classList.toggle('active', button.getAttribute('data-lang') === language);
  });
}

// Функция для обновления списков
function updateList(elementId, items, isAdvantages = false) {
  const listElement = document.getElementById(elementId);
  if (listElement && Array.isArray(items)) {
    listElement.innerHTML = '';
    items.forEach(item => {
      const li = document.createElement('li');
      if (isAdvantages) {
        li.innerHTML = `<strong>${item.title}</strong> ${item.text}`;
      } else {
        li.textContent = item;
      }
      listElement.appendChild(li);
    });
  }
}

// Функция для обновления FAQ
function updateFAQ(faqQuestions) {
  const faqContainer = document.getElementById('faqContainer');
  if (faqContainer && Array.isArray(faqQuestions)) {
    faqContainer.innerHTML = '';
    faqQuestions.forEach(qa => {
      const faqItem = document.createElement('div');
      faqItem.classList.add('faq-item');

      const question = document.createElement('h3');
      question.classList.add('faq-question');
      question.textContent = qa.question;

      const answer = document.createElement('p');
      answer.classList.add('faq-answer');
      answer.textContent = qa.answer;

      faqItem.appendChild(question);
      faqItem.appendChild(answer);
      faqContainer.appendChild(faqItem);
    });

    // Инициализируем обработчики событий для FAQ
    initFAQ();
  }
}

// Функция для инициализации аккордеона FAQ
function initFAQ() {
  const faqItems = document.querySelectorAll('.faq-item');
  faqItems.forEach(item => {
    const question = item.querySelector('.faq-question');
    question.addEventListener('click', () => {
      item.classList.toggle('active');
    });
  });
}

// Функция для переключения темы
function toggleTheme() {
  document.body.classList.toggle('dark-mode');
  localStorage.setItem('theme', document.body.classList.contains('dark-mode') ? 'dark' : 'light');

  // Обновляем иконку темы
  const themeIcon = document.getElementById('themeToggle').querySelector('i');
  if (document.body.classList.contains('dark-mode')) {
    themeIcon.classList.remove('fa-moon');
    themeIcon.classList.add('fa-sun');
  } else {
    themeIcon.classList.remove('fa-sun');
    themeIcon.classList.add('fa-moon');
  }
}

// Функция для скрытия/отображения шапки при скролле
function initHeaderScroll() {
  let lastScrollTop = 0;
  const header = document.querySelector('header');

  window.addEventListener('scroll', () => {
    const scrollTop = window.pageYOffset || document.documentElement.scrollTop;
    if (scrollTop > lastScrollTop && scrollTop > 100) {
      header.classList.add('header-hidden');
    } else {
      header.classList.remove('header-hidden');
    }
    lastScrollTop = scrollTop;
  });
}

// Функция для анимации появления при скролле
function initFadeInOnScroll() {
  const fadeInElements = document.querySelectorAll('.fade-in');

  if ('IntersectionObserver' in window) {
    const observerOptions = {
      threshold: 0.1, // Снизили порог для лучшей отзывчивости
    };

    const fadeInOnScroll = new IntersectionObserver((entries, observer) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add('show');
          observer.unobserve(entry.target);
        }
      });
    }, observerOptions);

    fadeInElements.forEach(el => {
      fadeInOnScroll.observe(el);
    });
  } else {
    // Если IntersectionObserver не поддерживается, сразу показываем элементы
    fadeInElements.forEach(el => {
      el.classList.add('show');
    });
  }
}

// Инициализация после загрузки DOM
document.addEventListener('DOMContentLoaded', () => {
  // Устанавливаем язык из localStorage или по умолчанию
  const savedLanguage = localStorage.getItem('language') || 'ru';
  setLanguage(savedLanguage);

  // Обработчики переключения языка
  document.querySelectorAll('.language-switcher button').forEach(button => {
    button.addEventListener('click', () => {
      const selectedLanguage = button.getAttribute('data-lang');
      setLanguage(selectedLanguage);
    });
  });

  // Инициализируем тему
  const savedTheme = localStorage.getItem('theme') || 'light';
  if (savedTheme === 'dark') {
    document.body.classList.add('dark-mode');
  }

  // Обновляем иконку темы при загрузке
  const themeIcon = document.getElementById('themeToggle').querySelector('i');
  if (document.body.classList.contains('dark-mode')) {
    themeIcon.classList.remove('fa-moon');
    themeIcon.classList.add('fa-sun');
  } else {
    themeIcon.classList.remove('fa-sun');
    themeIcon.classList.add('fa-moon');
  }

  // Обработчик переключения темы
  document.getElementById('themeToggle').addEventListener('click', toggleTheme);

  // Инициализируем анимацию появления при скролле
  initFadeInOnScroll();

  // Инициализируем бургер-меню для мобильных устройств
  const menuToggle = document.querySelector('.menu-toggle');
  const menuClose = document.querySelector('.menu-close');
  const nav = document.querySelector('nav');

  if (menuToggle && nav && menuClose) {
    // Открытие меню
    menuToggle.addEventListener('click', () => {
      nav.classList.add('open');
      document.body.classList.add('menu-open');
    });

    // Закрытие меню при нажатии на крестик
    menuClose.addEventListener('click', () => {
      nav.classList.remove('open');
      document.body.classList.remove('menu-open');
    });
  }

  // Инициализируем скрытие/отображение шапки при скролле
  initHeaderScroll();
});
