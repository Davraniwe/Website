// Файл translate.js

// Объект, содержащий переводы для 'ru' и 'en'
const translations = {
  ru: {
    // Header elements
    logoText: "Biograft",
    navAbout: "О нас",
    navProblem: "Проблема",
    navSolutions: "Решения",
    navAdvantages: "Преимущества",
    navFAQ: "FAQ",
    navContact: "Контакты",
    // Hero section
    heroTitle: "Инновации в регенеративной медицине",
    heroSubtitle: "Современное решение молекулярной медицины для лечения костей и нервов",
    contactButton: "Связаться с нами",
    // About Us section
    aboutTitle: "О нас",
    aboutText1: "Компания <strong>Биографт</strong> сосредоточена на создании генных препаратов и уникальных скаффолдов на основе наноматериалов, которые позволяют существенно улучшить методы лечения заболеваний опорно-двигательного аппарата и неврологических расстройств.",
    aboutText2: "Наша миссия — разработка инновационных решений для терапии заболеваний костной и нервной тканей, применяя передовые технологии генной терапии и наноматериалов.",
    // Problem section
    problemTitle: "Проблема",
    problemText: "Традиционные методы лечения повреждений костной и нервной тканей часто недостаточно эффективны. Пациенты сталкиваются с длительным восстановлением, риском осложнений и неполным восстановлением функций. Отсутствие инновационных подходов в регенеративной медицине ограничивает возможности полного выздоровления и влияет на качество жизни миллионов людей.",
    // Solutions and Molecular Medicine section
    solutionsTitle: "Решения",
    solutionsGenetic: "Генные препараты",
    solutionsGeneticText: "Мы разрабатываем генотерапевтические препараты, которые способны восстанавливать повреждённые ткани за счёт увеличения продукции ключевых молекул — факторов роста.",
    solutionsNano: "Наноматериалы и скаффолды",
    solutionsNanoText: "Используя современные достижения в области тканевой инженерии, мы создаём активные матрицы, способствующие регенерации костной и нервной тканей.",
    solutionsNerve: "Ген-активированные матрицы",
    solutionsNerveText: "Комбинированный подход с применением генного препарата и скаффолдов приводит к полному и более эффективному процессу восстановления нервной ткани и формирования костной структуры.",
    molecularTitle: "Молекулярная медицина",
    molecularIntro: "Факторы VEGF (сосудистый эндотелиальный фактор роста) и GDNF (фактор роста нервов) играют ключевую роль в нейропротекции и имеют различные молекулярные механизмы действия.",
    vegfTitle: "VEGF (сосудистый эндотелиальный фактор роста)",
    vegfList: [
      "Ангиогенез: VEGF стимулирует образование новых сосудов, увеличивая кровоснабжение тканей.",
      "Нейропротекция: VEGF активирует сигнальные пути, способствующие выживанию нейронов.",
      "Модуляция воспаления: VEGF регулирует воспалительные реакции, снижая уровень провоспалительных цитокинов.",
      "Клеточная миграция: VEGF способствует миграции клеток к месту повреждения."
    ],
    gdnfTitle: "GDNF (фактор роста нервов)",
    gdnfList: [
      "Выживание нейронов: GDNF активирует рецепторы, ведущие к выживанию клеток.",
      "Нейропластичность: GDNF поддерживает изменения в синапсах, улучшая функции нейронных сетей.",
      "Защита нейронов: GDNF улучшает функцию глиальных клеток, защищая нейроны от повреждений.",
      "Восстановление: GDNF способствует регенерации нейронов после травм."
    ],
    interaction: "<strong>Взаимодействие:</strong> совместное применение VEGF и GDNF усиливает нейропротекцию и регенерацию нервной ткани.",
    boneIntro: "Факторы роста, такие как BMP и VEGF, играют важную роль в восстановлении и регенерации костной ткани.",
    bmpTitle: "Белки морфогенеза костей (BMP)",
    bmpList: [
      "Сигнальные пути: BMP инициирует активацию сигнальных путей для роста костей.",
      "Дифференцировка: BMP способствует превращению стволовых клеток в остеобласты.",
      "Минерализация: BMP обеспечивает формирование и стабильность костной ткани."
    ],
    vegfBoneTitle: "Сосудистый эндотелиальный фактор роста (VEGF)",
    vegfBoneList: [
      "Сигнальные пути: VEGF активирует пролиферацию и миграцию клеток.",
      "Ангиогенез: VEGF обеспечивает кровоснабжение для новых костных клеток.",
      "Синергия с BMP: VEGF усиливает остеоиндуктивные свойства BMP."
    ],
    interactionBone: "<strong>Взаимодействие BMP и VEGF:</strong> совместное действие способствует оптимальному росту и ремоделированию костей.",
    // Advantages section
    advantagesTitle: "Преимущества",
    advantagesList: [
      {
        title: "Инновационные технологии:",
        text: "Используем передовые методы и материалы в биоинженерии."
      },
      {
        title: "Высокая эффективность:",
        text: "Наши решения показывают высокие результаты в клинических исследованиях."
      },
      {
        title: "Безопасность:",
        text: "Продукты биосовместимы и минимизируют риск отторжения."
      },
      {
        title: "Персонализация:",
        text: "Индивидуальный подход к каждому пациенту для максимальной эффективности."
      }
    ],
    // Product Features section
    productFeaturesTitle: "Характеристики продукта",
    product1Title: "Nerve Guide",
    product1Features: [
      "Рассасывающийся имплантат для восстановления периферических нервов",
      "Изготовлен из биобезопасного материала – поликапролактона",
      "Защищает нерв при регенерации аксонов",
      "Пористая структура матрицы",
      "Высвобождает GDNF и VEGF в области повреждения",
      "Обеспечивает диффузию питательных веществ",
      "Лёгок в обработке при увлажнении"
    ],
    product2Title: "Power Bone Matrix",
    product2Features: [
      "Костнопластический материал для регенерации костей",
      "Обеспечивает механическую поддержку перелома",
      "Пористая мембрана",
      "Обеспечивает диффузию питательных веществ",
      "Активирует остеоиндукцию за счёт BMP и VEGF"
    ],
    // FAQ section
    faqTitle: "Часто задаваемые вопросы",
    faqQuestions: [
      {
        question: "Как работают ваши генные препараты и матрицы?",
        answer: "Наши продукты создают благоприятную среду для естественной регенерации тканей, направляя рост клеток и обеспечивая необходимые факторы для восстановления."
      },
      {
        question: "Безопасны ли ваши технологии для пациентов?",
        answer: "Да, все наши разработки проходят строгие испытания на биосовместимость и безопасность перед клиническим применением."
      },
      {
        question: "Когда ваши продукты будут доступны на рынке?",
        answer: "Мы активно работаем над завершением клинических исследований и планируем выход на рынок в ближайшие годы. Следите за обновлениями на нашем сайте."
      },
      {
        question: "Как стать партнёром или инвестором компании?",
        answer: "Для обсуждения возможностей сотрудничества свяжитесь с нами через форму обратной связи или по указанным контактам."
      }
    ],
    // Contact section
    contactTitle: "Связаться с нами",
    contactText: "Заполните форму ниже, и мы свяжемся с вами в ближайшее время.",
    formName: "Имя",
    formEmail: "Электронная почта",
    formMessage: "Сообщение",
    formSubmit: "Отправить",
    // Footer
    footerText: "Проект выполнен при поддержке «Фонда содействия инновациям» в рамках программы \"Студенческий стартап\" федерального проекта «Платформа университетского технологического предпринимательства»",
    copyright: "© 2025 Биографт. Все права защищены."
  },
  en: {
    // Header elements
    logoText: "Biograft",
    navAbout: "About Us",
    navProblem: "Problem",
    navSolutions: "Solutions",
    navAdvantages: "Advantages",
    navFAQ: "FAQ",
    navContact: "Contact",
    // Hero section
    heroTitle: "Innovations in Regenerative Medicine",
    heroSubtitle: "Modern molecular medicine solutions for bone and nerve treatment",
    contactButton: "Contact Us",
    // About Us section
    aboutTitle: "About Us",
    aboutText1: "Biograft focuses on creating gene products and unique scaffolds based on nanomaterials, which significantly improve treatment methods for musculoskeletal and neurological disorders.",
    aboutText2: "Our mission is to develop innovative solutions for the treatment of bone and nerve tissue diseases using advanced gene therapy technologies and nanomaterials.",
    // Problem section
    problemTitle: "Problem",
    problemText: "Here will be the description of the problem the company is working on. (You need to replace this text with the actual content.)",
    // Solutions and Molecular Medicine section
    solutionsTitle: "Solutions",
    solutionsGenetic: "Gene Therapeutics",
    solutionsGeneticText: "We develop gene therapeutics capable of restoring damaged tissues by increasing the production of key molecules—growth factors.",
    solutionsNano: "Nanomaterials and Scaffolds",
    solutionsNanoText: "Using modern advancements in tissue engineering, we create active matrices that promote the regeneration of bone and nerve tissues.",
    solutionsNerve: "Gene-Activated Matrices",
    solutionsNerveText: "A combined approach using gene therapeutics and scaffolds leads to a more complete and efficient process of nerve tissue reinnervation and bone tissue formation.",
    molecularTitle: "Molecular Medicine",
    molecularIntro: "Factors VEGF (vascular endothelial growth factor) and GDNF (glial cell line-derived neurotrophic factor) play a key role in neuroprotection and have various molecular mechanisms of action.",
    vegfTitle: "VEGF (vascular endothelial growth factor)",
    vegfList: [
      "Angiogenesis: VEGF stimulates the formation of new vessels, increasing blood supply to nerve tissue.",
      "Neuroprotection: VEGF exhibits neuroprotective properties by activating signaling pathways that promote neuron survival.",
      "Modulation of inflammatory processes: VEGF can regulate inflammatory reactions by reducing the level of pro-inflammatory cytokines.",
      "Cell migration: VEGF promotes the migration of neural progenitors and glial cells to the site of injury."
    ],
    gdnfTitle: "GDNF (glial cell line-derived neurotrophic factor)",
    gdnfList: [
      "Modulation of neuronal survival: GDNF activates receptors on the surface of neurons, leading to the activation of survival signaling pathways.",
      "Regulation of neuroplasticity: GDNF supports neuroplasticity by promoting synaptic changes and improving neural network function.",
      "Modulation of glial cells: GDNF affects glial cells, improving their function and protecting nearby neurons from damage.",
      "Recovery after injuries: GDNF promotes the recovery of neurons after injuries and strokes."
    ],
    interaction: "<strong>Interrelation and joint action:</strong> both factors play an important role in the pathogenesis and recovery of nerve tissue. Their interaction can have a synergistic effect, enhancing neuroprotection and regeneration after neurodegenerative diseases or injuries.",
    boneIntro: "Growth factors such as bone morphogenetic proteins (BMP) and vascular endothelial growth factor (VEGF) play an important role in osteoinduction and angiogenesis, promoting the restoration and regeneration of bone tissue.",
    bmpTitle: "Bone Morphogenetic Proteins (BMP)",
    bmpList: [
      "Signaling pathways: BMP binds to specific receptors, initiating the activation of signaling pathways such as SMAD.",
      "Production of osteoblasts: BMP promotes the differentiation of mesenchymal stem cells into osteoblasts.",
      "Matrix mineralization: BMP promotes matrix mineralization, ensuring the formation and stability of bone tissue."
    ],
    vegfBoneTitle: "Vascular Endothelial Growth Factor (VEGF)",
    vegfBoneList: [
      "Signaling pathways: VEGF binds to receptors on endothelial cells, activating signaling pathways for cell proliferation and migration.",
      "Angiogenesis: VEGF stimulates the growth and permeability of vessels, providing blood supply for new osteoblasts.",
      "Connection with osteogenesis: VEGF interacts with BMP, enhancing their osteoinductive properties."
    ],
    interactionBone: "<strong>Interaction of BMP and VEGF:</strong> the combined action of BMP and VEGF contributes not only to the formation of bone tissue but also to providing it with necessary blood supply, which is important for optimal growth and bone remodeling.",
    // Advantages section
    advantagesTitle: "Advantages",
    advantagesList: [
      {
        title: "Innovative Technologies:",
        text: "We use advanced methods and materials in bioengineering."
      },
      {
        title: "High Efficiency:",
        text: "Our solutions show high results in clinical trials."
      },
      {
        title: "Safety:",
        text: "The products are biocompatible and minimize the risk of rejection."
      },
      {
        title: "Personalization:",
        text: "Individual approach to each patient for maximum efficiency."
      }
    ],
    // Product Features section
    productFeaturesTitle: "Product Features",
    product1Title: "Nerve Guide",
    product1Features: [
      "Absorbable implant for repairing peripheral nerve damage",
      "Made from biocompatible synthetic material – Polycaprolactone",
      "Isolates and protects the peripheral nerve during axon regeneration",
      "Semi-permeable, porous matrix structure",
      "Retains and releases nerve growth factor (GDNF) and vascular growth factor (VEGF) at the injury site",
      "Allows diffusion of smaller nutrient molecules",
      "Becomes soft, pliable, and easy to handle when hydrated"
    ],
    product2Title: "Nerve Guide Matrix",
    product2Features: [
      "Absorbable implant for repairing peripheral nerve damage",
      "Made from biocompatible synthetic material – Polycaprolactone",
      "Isolates and protects the peripheral nerve during axon regeneration",
      "Semi-permeable, porous matrix structure",
      "Retains and releases nerve growth factor (GDNF) and vascular growth factor (VEGF) at the injury site",
      "Allows diffusion of smaller nutrient molecules",
      "Becomes soft, pliable, and easy to handle when hydrated"
    ],
    // FAQ section
    faqTitle: "Frequently Asked Questions",
    faqQuestions: [
      {
        question: "How do your gene therapeutics and matrices work?",
        answer: "Our products create a favorable environment for natural tissue regeneration, guiding cell growth and providing the necessary factors for recovery."
      },
      {
        question: "Are your technologies safe for patients?",
        answer: "Yes, all our developments undergo rigorous biocompatibility and safety testing before clinical application."
      },
      {
        question: "When will your products be available on the market?",
        answer: "We are actively working on completing clinical trials and plan to enter the market in the coming years. Stay updated on our website."
      },
      {
        question: "How can I become a partner or investor in the company?",
        answer: "To discuss collaboration opportunities, contact us through the feedback form or via the provided contact details."
      }
    ],
    // Contact section
    contactTitle: "Contact Us",
    contactText: "Fill out the form below, and we will get in touch with you as soon as possible.",
    formName: "Name",
    formEmail: "Email",
    formMessage: "Message",
    formSubmit: "Submit",
    // Footer
    footerText: "Project implemented with the support of the Innovation Assistance Fund under the 'Student Startup' program of the federal project 'University Technological Entrepreneurship Platform'.",
    copyright: "© 2025 Biograft. All rights reserved."
  }
};
