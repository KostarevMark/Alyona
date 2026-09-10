// Ночной экспресс — RU/EN language switch. Plain classic script (loaded
// before main.js) so window.__i18n is available to both the static markup
// pass below and to main.js's dynamically-created lightbox/expand buttons.
(() => {
  const DICT = {
    ru: {
      'meta-title': 'Алёна Лаптева — ивент-креатор и креативный копирайтер',
      'meta-description': 'Креативные концепции для корпоративов, свадеб, спецпроектов и других событий. Портфолио ивент-креатора Алёны Лаптевой.',

      'hero-eyebrow': 'Креативные концепции',
      'hero-name-first': 'Алёна',
      'hero-name-last': 'Лаптева',
      'hero-role': 'Ивент-креатор&nbsp;/ креативный копирайтер',
      'hero-tagline': 'Пишу креативные концепции для корпоративов, свадеб, спецпроектов и других событий.',
      'hero-clients-label': 'Вместе со мной «путешествовали»',
      'hero-client-1': 'X5 Group', 'hero-client-2': 'ББР', 'hero-client-3': 'ADG Group',
      'hero-client-4': 'Ситидрайв', 'hero-client-5': 'Банк ОТП', 'hero-client-6': 'Major',
      'hero-cta': 'Отправиться в путь',

      'manifesto-portrait-alt': 'Алёна Лаптева в образе проводника',
      'manifesto-eyebrow': 'О креаторе',
      'manifesto-heading': 'Каждая концепция —<br><em>отдельная вселенная</em>',
      'manifesto-text-1': 'Мне важно разработать целый мир, в который погрузятся гости программы. Читая бриф, я между строк вижу, какие эмоции должны получить участники, чтобы все цели заказчика были выполнены.',
      'manifesto-text-2': 'Затем собираю всё в креативную концепцию, где каждый элемент имеет своё место и смысл.',
      'merit-tags-label': 'Что я умею:',
      'manifesto-tag-1': 'смысловая основа концепции',
      'manifesto-tag-2': 'драматургия события',
      'manifesto-tag-3': 'tone of voice проекта',
      'manifesto-tag-4': 'нейминг и слоганы',
      'manifesto-tag-5': 'сценарий и шоу-программа',
      'manifesto-tag-6': 'авторские активности',
      'manifesto-tag-7': 'пространство и декор',
      'manifesto-tag-8': 'подбор площадки и подрядчиков',
      'manifesto-quote': '«Мне кажется, каждый креатор — это начальник поезда, который делает путешествие своих «пассажиров» незабываемым. Мой поезд прицеплял самые разные вагоны. В каждом я создавала особый мир и уют. Приглашаю вас в мой поезд-портфолио. Счастливого пути!»',
      'manifesto-sig': '— Алёна Лаптева',

      'portfolio-eyebrow': 'Портфолио в 8 вагонах',
      'portfolio-heading': 'Состав <em>проектов</em>',

      'label-task': 'Задача',
      'label-concept': 'Концепция',
      'label-developed': 'Что было разработано',

      'wagon0-photo-1': 'Крыша «Дача» — фотография 1',
      'wagon0-photo-2': 'Крыша «Дача» — фотография 2',
      'wagon0-photo-3': 'Крыша «Дача» — фотография 3',
      'wagon0-photo-4': 'Крыша «Дача» — фотография 4',
      'wagon0-tag': 'Спецпроект · ADG Group',
      'wagon0-title': 'Крыша «Дача»',
      'wagon0-task': 'Превратить крышу торгового центра в место притяжения на всё лето: разработать концепцию пространства, дизайн-код, функциональные зоны, событийную программу и идеи партнёрских интеграций.',
      'wagon0-concept': '«У бабушки на даче» — место, куда мечтает сбежать каждый городской житель летом. Пространство переносит гостей в атмосферу беззаботных каникул, где каждая деталь вызывает тёплые воспоминания.',
      'wagon0-list-1': 'Дизайн-код: цветники, грядки, бар-погреб, бельевые верёвки с брендированными простынями, винтажная мебель и тёплые фразы из детства',
      'wagon0-list-2': 'Функциональные зоны: городской солярий, лаунж-лекторий со сценой, бар, детская кухня, агро-зона, маркет и спортивная площадка',
      'wagon0-list-3': 'Культурное наполнение: библиотека, настольные игры, фотозона, велостимулятор, бадминтон, городки и другие дачные развлечения',
      'wagon0-list-4': 'Событийная программа «Три дачных сезона»: «сажаем», «окучиваем» и «копаем» картошку — с йогой, спид-дейтингом, кинопоказами, мастер-классами, лекциями и концертами',

      'wagon1-photo-1': 'Киноплёнка чудес — фотография 1',
      'wagon1-photo-2': 'Киноплёнка чудес — фотография 2',
      'wagon1-photo-3': 'Киноплёнка чудес — фотография 3',
      'wagon1-tag': 'Новогоднее мероприятие · Кино',
      'wagon1-title': '«Кинопленка чудес»',
      'wagon1-task': 'Создать новогодний праздник, который объединит команду, подчеркнёт достижения года и подарит ощущение настоящего чуда.',
      'wagon1-concept': 'Сотрудники отправляются в путешествие по волшебной киноплёнке и оказываются внутри любимых советских фильмов. Здесь они не зрители, а главные герои собственной новогодней истории.',
      'wagon1-list-1': 'Кинопремия с награждением сотрудников в номинациях «Лучшая роль», «Лучший дебют», «Монтаж года»',
      'wagon1-list-2': 'Фотозоны по мотивам «Иронии судьбы», «12 месяцев» и других культовых фильмов',
      'wagon1-list-3': 'Кинопробы, озвучка фильмов, караоке, киноребусы, кинопантомима и викторина по советскому кино',
      'wagon1-list-4': 'Юмористические видеоролики с участием сотрудников и финальный ритуал «Бьём тарелку!» на удачу',

      'wagon2-photo-1': 'Бани Лаптевой — фотография 1',
      'wagon2-photo-2': 'Бани Лаптевой — фотография 2',
      'wagon2-photo-3': 'Бани Лаптевой — фотография 3',
      'wagon2-tag': 'Тестовое задание · Юбилей 25 лет',
      'wagon2-title': '«Бани Лаптевой»',
      'wagon2-task': 'В рамках тестового задания представить себя в образе компании со штатом 500 человек и разработать концепцию юбилея к 25-летию, отражающую её характер, tone of voice и корпоративную культуру.',
      'wagon2-concept': '«Юбилейный съезд исследователей русского бессознательного». Сотрудники становятся исследователями русского культурного кода на торжественном заседании Комиссии по делам русской души. Советская эстетика и атмосфера Дома культуры превращают праздник в единое иммерсивное пространство.',
      'wagon2-list-1': 'Драматургия и сценарий мероприятия',
      'wagon2-list-2': 'Концепция официальной части и церемонии награждения',
      'wagon2-list-3': 'Тематические активности и творческие мастерские',
      'wagon2-list-4': 'Дресс-код, фотозоны и оформление пространства',
      'wagon2-list-5': 'Кейтеринг, основанный на советской гастрономии',

      'wagon3-photo-1': 'День водителя «Связь дорог» — фотография 1',
      'wagon3-photo-2': 'День водителя «Связь дорог» — фотография 2',
      'wagon3-photo-3': 'День водителя «Связь дорог» — фотография 3',
      'wagon3-tag': 'Профессиональный праздник',
      'wagon3-title': 'День водителя «Связь дорог»',
      'wagon3-task': 'Объединить сотрудников из разных регионов в День водителя и подарить ощущение, что все находятся на одной волне.',
      'wagon3-concept': 'Корпоративное радио «Связь дорог» — эфир, который сопровождал водителей в пути. Каждый сотрудник мог выйти в эфир, поделиться историей, передать привет коллегам или принять участие в интерактивах.',
      'wagon3-list-1': 'Рубрики: «Караоке на колёсах», «Герой дня», «Юмор на колёсах», «Полный газ!», «Груз эмоций»',
      'wagon3-list-2': 'Интерактивы: угадай регион, викторина «Что по ПДД?», ребусы, музыкальные игры и шоу талантов',
      'wagon3-list-3': 'Telegram-бот для участия в эфире, конкурсах и обратной связи',
      'wagon3-list-4': 'Голосовые сообщения, истории с маршрутов, приветы и благодарности от сотрудников',

      'wagon4-photo-1': '5th Avenue улица успеха — фотография 1',
      'wagon4-photo-2': '5th Avenue улица успеха — фотография 2',
      'wagon4-tag': 'Корпоратив · Нью-Йорк',
      'wagon4-title': '«5th Avenue — улица успеха»',
      'wagon4-task': 'Отметить 5-летие компании, подчеркнуть её успехи и вдохновить команду на новые достижения.',
      'wagon4-concept': 'Пятая авеню — символ успеха, амбиций и движения вперёд. Юбилей стал путешествием по главной улице Нью-Йорка: с жёлтым такси, уличными артистами, люксовым бутиком и атмосферой большого города.',
      'wagon4-list-1': 'Награждение: эксклюзивные аксессуары и номинации «Wall Street энергия», «Рокфеллер года», «Свет на Таймс-сквер»',
      'wagon4-list-2': 'Масштабное шоу с акробатикой, барабанами и визуальными вау-эффектами',
      'wagon4-list-3': 'Номера сотрудников в формате «Утро в Нью-Йорке» и выступления известных хедлайнеров',
      'wagon4-list-4': 'Финальное исполнение «New York State of Mind» и эффектный денежный салют',

      'wagon5-photo-1': 'Спартакиада «Вперёд в будущее» — фотография 1',
      'wagon5-photo-2': 'Спартакиада «Вперёд в будущее» — фотография 2',
      'wagon5-tag': 'Командный дух · Спорт',
      'wagon5-title': 'Спартакиада «Вперёд в будущее»',
      'wagon5-task': 'Отметить 10-летие компании, укрепить командный дух и объединить сотрудников через масштабную спортивную программу.',
      'wagon5-concept': 'Компания уже 10 лет создаёт будущее, поэтому участники становятся пилотами транспорта нового поколения. Выполняя спортивные испытания, они получают «водительские права будущего» и готовятся к новым достижениям.',
      'wagon5-list-1': 'Спартакиада в формате получения водительских прав с чек-листом и маршрутной картой',
      'wagon5-list-2': 'VR-полоса препятствий, гонки дронов и летающих автомобилей, космический фрисби',
      'wagon5-list-3': 'Интерактивные фотозоны, робот-бармен, молекулярная кухня и поздравления на экране в реальном времени',
      'wagon5-list-4': 'Вечернее шоу с нейросетью-ведущим, капсулой времени и нейропрогнозом будущего компании',

      'wagon6-photo-1': 'Свадьба «Лаборатория любви» — фотография 1',
      'wagon6-tag': 'Дарья & Андрей',
      'wagon6-title': 'Свадьба «Лаборатория любви»',
      'wagon6-task': 'Создать концепцию свадьбы, которая объединит историю знакомства пары, их любовь к науке и превратит праздник в уникальное исследование отношений.',
      'wagon6-concept': 'От первой гипотезы до доказанной теории — отношения Дарьи и Андрея прошли путь настоящего научного открытия. Гости собирают формулу их любви и рассматривают историю пары под микроскопом.',
      'wagon6-list-1': 'Лабораторная эстетика: белые цветы, алые розы, стекло, пробирки и символы научного открытия',
      'wagon6-list-2': 'Рассадка по принципу таблицы Менделеева и коктейльный бар с напитками в колбах',
      'wagon6-list-3': 'Интерактивная доска с «формулой любви», которую гости дополняли пожеланиями',
      'wagon6-list-4': 'Фотоколлажи пары с «микроскопными» образами',
      'wagon6-list-5': 'Драматургия вечера: постановка проблемы, эксперименты, открытие и подтверждение теории любви',

      'wagon7-photo-1': 'Свадьба «Как в кино!» — фотография 1',
      'wagon7-tag': 'Александр & Валерия',
      'wagon7-title': 'Свадьба «Как в кино!»',
      'wagon7-task': 'Создать концепцию свадьбы для пары, которая любит культовый кинематограф, превратив их историю любви в атмосферный фильм с гостями в главных ролях.',
      'wagon7-concept': 'Их отношения развивались как ромком: соседние кабинеты, случайный мэтч в Tinder, дружба и множество смешных эпизодов. В эстетике старого кинотеатра соединились винтаж, романтика и любимые киноленты пары.',
      'wagon7-list-1': 'Старый кинотеатр: красная дорожка, арка-кадр, плёнки, винтажные камеры и декор из киносценариев',
      'wagon7-list-2': 'Приглашения-билеты в кинозал и приветственный попкорн',
      'wagon7-list-3': 'Фотографии как кадры из фильма и рассадка гостей в стиле финальных титров',
      'wagon7-list-4': 'Фильм о паре и интерактивы через язык кино',
      'wagon7-list-5': 'Денежные подарки как «инвестиции в фильм» будущих приключений пары',

      'portfolio-cta-text': 'Хотите увидеть больше деталей?',
      'portfolio-cta-button': 'Посмотреть концепции целиком',

      'contact-eyebrow': 'Конечная станция',
      'contact-heading': 'Буду рада видеть вас<br><em>в проводниках и пассажирах!</em>',
      'contact-text': 'Расскажите вашу задачу — я превращу её в креативную концепцию.',

      'footer-text': '© 2026 · Алёна Лаптева · Ивент-креатор и креативный копирайтер',

      'aria-photo-prev': 'Предыдущее фото',
      'aria-photo-next': 'Следующее фото',
      'aria-photo-expand': 'Развернуть фото',
      'aria-lightbox-close': 'Закрыть',
      'aria-lightbox-prev': 'Предыдущее фото',
      'aria-lightbox-next': 'Следующее фото',
    },
    en: {
      'meta-title': 'Alyona Lapteva — Event Creator & Creative Copywriter',
      'meta-description': 'Creative concepts for corporate events, weddings, brand activations and more. Portfolio of event creator Alyona Lapteva.',

      'hero-eyebrow': 'Creative concepts',
      'hero-name-first': 'Alyona',
      'hero-name-last': 'Lapteva',
      'hero-role': 'Event creator&nbsp;/ creative copywriter',
      'hero-tagline': 'I write creative concepts for corporate events, weddings, brand activations and more.',
      'hero-clients-label': 'I’ve "travelled" together with',
      'hero-client-1': 'X5 Group', 'hero-client-2': 'BBR', 'hero-client-3': 'ADG Group',
      'hero-client-4': 'Citydrive', 'hero-client-5': 'OTP Bank', 'hero-client-6': 'Major',
      'hero-cta': 'Begin the journey',

      'manifesto-portrait-alt': 'Alyona Lapteva as a train conductor',
      'manifesto-eyebrow': 'About the creator',
      'manifesto-heading': 'Each concept is<br><em>its own universe</em>',
      'manifesto-text-1': "It matters to me to build a whole world for guests to step into. Reading a brief, I can see between the lines what emotions the audience needs to feel for every one of the client's goals to land.",
      'manifesto-text-2': 'Then I gather it all into a creative concept where every element has its own place and meaning.',
      'merit-tags-label': 'What I do:',
      'manifesto-tag-1': 'the meaning behind the concept',
      'manifesto-tag-2': 'event dramaturgy',
      'manifesto-tag-3': 'project tone of voice',
      'manifesto-tag-4': 'naming and taglines',
      'manifesto-tag-5': 'script and show program',
      'manifesto-tag-6': 'signature activities',
      'manifesto-tag-7': 'space and décor',
      'manifesto-tag-8': 'venue and vendor sourcing',
      'manifesto-quote': '"I think every creator is a train conductor, making the journey unforgettable for their ‘passengers.’ My train has coupled all kinds of carriages along the way. In each one, I built its own world and warmth. Welcome aboard my portfolio train. Have a wonderful journey!"',
      'manifesto-sig': '— Alyona Lapteva',

      'portfolio-eyebrow': 'Portfolio in 8 carriages',
      'portfolio-heading': 'A train of <em>projects</em>',

      'label-task': 'The brief',
      'label-concept': 'The concept',
      'label-developed': 'What was created',

      'wagon0-photo-1': 'Rooftop "Dacha" — photo 1',
      'wagon0-photo-2': 'Rooftop "Dacha" — photo 2',
      'wagon0-photo-3': 'Rooftop "Dacha" — photo 3',
      'wagon0-photo-4': 'Rooftop "Dacha" — photo 4',
      'wagon0-tag': 'Special project · ADG Group',
      'wagon0-title': 'Rooftop "Dacha"',
      'wagon0-task': "Turn a shopping mall's rooftop into a summer-long destination: develop the space concept, design code, functional zones, event program and partner-integration ideas.",
      'wagon0-concept': '"At Grandma\'s dacha" — the place every city dweller dreams of escaping to in summer. The space transports guests into carefree-holiday vibes, where every detail sparks a warm memory.',
      'wagon0-list-1': "Design code: flowerbeds, garden beds, a cellar bar, clotheslines with branded sheets, vintage furniture and warm phrases from childhood",
      'wagon0-list-2': "Functional zones: a city solarium, a lounge-lecture stage, a bar, a kids' kitchen, an agro-zone, a market and a sports ground",
      'wagon0-list-3': "Cultural programming: a library, board games, a photo zone, an exercise bike, badminton, gorodki and other dacha pastimes",
      'wagon0-list-4': '"Three Dacha Seasons" event program: "planting," "hilling" and "digging up" potatoes — with yoga, speed-dating, film screenings, workshops, lectures and concerts',

      'wagon1-photo-1': 'Film Reel of Wonders — photo 1',
      'wagon1-photo-2': 'Film Reel of Wonders — photo 2',
      'wagon1-photo-3': 'Film Reel of Wonders — photo 3',
      'wagon1-tag': 'New Year event · Cinema',
      'wagon1-title': '"Film Reel of Wonders"',
      'wagon1-task': "Create a New Year celebration that brings the team together, highlights the year's achievements and delivers a real sense of wonder.",
      'wagon1-concept': 'Employees travel through a magical film reel and land inside beloved Soviet-era films — not as spectators, but as the leads of their own New Year story.',
      'wagon1-list-1': 'A film-awards ceremony honouring employees in categories like "Best Role," "Best Debut," "Edit of the Year"',
      'wagon1-list-2': 'Photo zones inspired by "Irony of Fate," "12 Months" and other cult classics',
      'wagon1-list-3': 'Screen tests, film dubbing, karaoke, movie riddles, film pantomime and a Soviet-cinema quiz',
      'wagon1-list-4': 'Comedy videos starring employees and a final "Break the Plate!" ritual for good luck',

      'wagon2-photo-1': "Lapteva's Banya — photo 1",
      'wagon2-photo-2': "Lapteva's Banya — photo 2",
      'wagon2-photo-3': "Lapteva's Banya — photo 3",
      'wagon2-tag': 'Test assignment · 25th anniversary',
      'wagon2-title': '"Lapteva\'s Banya"',
      'wagon2-task': "As a test assignment, imagine a 500-person company and develop an anniversary concept for its 25th birthday that reflects its character, tone of voice and corporate culture.",
      'wagon2-concept': '"Anniversary Congress of Researchers of the Russian Unconscious." Employees become researchers of the Russian cultural code at a formal session of the Commission for Matters of the Russian Soul. Soviet aesthetics and the atmosphere of a House of Culture turn the celebration into one immersive space.',
      'wagon2-list-1': 'Event dramaturgy and script',
      'wagon2-list-2': 'Concept for the formal program and awards ceremony',
      'wagon2-list-3': 'Themed activities and creative workshops',
      'wagon2-list-4': 'Dress code, photo zones and space design',
      'wagon2-list-5': 'Catering built around Soviet-era gastronomy',

      'wagon3-photo-1': 'Driver\'s Day "Roads Connected" — photo 1',
      'wagon3-photo-2': 'Driver\'s Day "Roads Connected" — photo 2',
      'wagon3-photo-3': 'Driver\'s Day "Roads Connected" — photo 3',
      'wagon3-tag': 'Professional holiday',
      'wagon3-title': 'Driver\'s Day "Roads Connected"',
      'wagon3-task': "Bring together employees from different regions for Driver's Day and give everyone the feeling of being on the same wavelength.",
      'wagon3-concept': 'Corporate radio "Roads Connected" — a broadcast that kept drivers company on the road. Every employee could go on air, share a story, send greetings to colleagues, or join in on interactive segments.',
      'wagon3-list-1': 'Segments: "Karaoke on Wheels," "Hero of the Day," "Humor on Wheels," "Full Throttle!", "Cargo of Emotions"',
      'wagon3-list-2': 'Interactive games: guess-the-region, a traffic-rules quiz, riddles, music games and a talent show',
      'wagon3-list-3': 'A Telegram bot for joining the broadcast, contests and feedback',
      'wagon3-list-4': 'Voice messages, stories from the road, greetings and thanks from employees',

      'wagon4-photo-1': '5th Avenue — Street of Success — photo 1',
      'wagon4-photo-2': '5th Avenue — Street of Success — photo 2',
      'wagon4-tag': 'Corporate event · New York',
      'wagon4-title': '"5th Avenue — Street of Success"',
      'wagon4-task': "Celebrate the company's 5th anniversary, highlight its achievements and inspire the team toward new milestones.",
      'wagon4-concept': "Fifth Avenue — a symbol of success, ambition and forward motion. The anniversary became a journey down New York's most famous street: a yellow cab, street performers, a luxury boutique and the buzz of a big city.",
      'wagon4-list-1': 'Awards: exclusive accessories and categories like "Wall Street Energy," "Rockefeller of the Year," "Times Square Spotlight"',
      'wagon4-list-2': 'A large-scale show with acrobatics, drumlines and visual wow-effects',
      'wagon4-list-3': 'Employee numbers in a "Morning in New York" format, plus headline performers',
      'wagon4-list-4': 'A finale of "New York State of Mind" and a striking money-shower salute',

      'wagon5-photo-1': 'Spartakiad "Forward to the Future" — photo 1',
      'wagon5-photo-2': 'Spartakiad "Forward to the Future" — photo 2',
      'wagon5-tag': 'Team spirit · Sport',
      'wagon5-title': 'Spartakiad "Forward to the Future"',
      'wagon5-task': "Celebrate the company's 10th anniversary, strengthen team spirit and bring employees together through a large-scale sports program.",
      'wagon5-concept': 'The company has been building the future for 10 years, so participants become pilots of next-generation transport. Completing sports challenges earns them a "future driver\'s license" as they prepare for new achievements.',
      'wagon5-list-1': "A Spartakiad structured as earning a driver's license, complete with a checklist and route map",
      'wagon5-list-2': 'A VR obstacle course, drone and flying-car races, and cosmic frisbee',
      'wagon5-list-3': 'Interactive photo zones, a robot bartender, molecular cuisine and live on-screen congratulations',
      'wagon5-list-4': "An evening show with an AI host, a time capsule and a neural-network forecast of the company's future",

      'wagon6-photo-1': 'Wedding "Laboratory of Love" — photo 1',
      'wagon6-tag': 'Darya & Andrey',
      'wagon6-title': 'Wedding "Laboratory of Love"',
      'wagon6-task': "Create a wedding concept that unites the couple's story of how they met, their shared love of science, and turns the celebration into a unique study of relationships.",
      'wagon6-concept': "From first hypothesis to proven theory — Darya and Andrey's relationship followed the path of a genuine scientific discovery. Guests assemble the formula of their love and examine the couple's story under a microscope.",
      'wagon6-list-1': 'Laboratory aesthetics: white flowers, scarlet roses, glass, test tubes and symbols of scientific discovery',
      'wagon6-list-2': 'Seating arranged by the periodic table, and a cocktail bar with drinks served in flasks',
      'wagon6-list-3': 'An interactive board with a "formula of love" for guests to complete with their wishes',
      'wagon6-list-4': 'Photo collages of the couple in "microscope" imagery',
      'wagon6-list-5': 'An evening dramaturgy of posing the problem, running experiments, discovery and proving the theory of love',

      'wagon7-photo-1': 'Wedding "Just Like in the Movies!" — photo 1',
      'wagon7-tag': 'Alexander & Valeria',
      'wagon7-title': 'Wedding "Just Like in the Movies!"',
      'wagon7-task': 'Create a wedding concept for a couple who love classic cinema, turning their love story into an atmospheric film with the guests in leading roles.',
      'wagon7-concept': "Their relationship unfolded like a rom-com: neighbouring offices, a chance Tinder match, friendship and countless funny episodes. The aesthetic of an old cinema blended vintage charm, romance and the couple's favourite films.",
      'wagon7-list-1': 'An old-cinema theme: a red carpet, a frame-arch photo op, film reels, vintage cameras and décor built from movie scripts',
      'wagon7-list-2': 'Ticket-style invitations to the screening, with welcome popcorn',
      'wagon7-list-3': 'Photos styled as film stills, and guest seating in end-credits style',
      'wagon7-list-4': 'A film about the couple and interactive games built around the language of cinema',
      'wagon7-list-5': 'Cash gifts framed as "investments" in the couple\'s future adventures',

      'portfolio-cta-text': 'Want to see more details?',
      'portfolio-cta-button': 'View the full concepts',

      'contact-eyebrow': 'Final station',
      'contact-heading': "I'd love to have you<br><em>aboard — as crew or passenger!</em>",
      'contact-text': "Tell me about your brief — I'll turn it into a creative concept.",

      'footer-text': '© 2026 · Alyona Lapteva · Event creator & creative copywriter',

      'aria-photo-prev': 'Previous photo',
      'aria-photo-next': 'Next photo',
      'aria-photo-expand': 'Expand photo',
      'aria-lightbox-close': 'Close',
      'aria-lightbox-prev': 'Previous photo',
      'aria-lightbox-next': 'Next photo',
    },
  };

  const STORAGE_KEY = 'ne-lang';
  let currentLang = localStorage.getItem(STORAGE_KEY) || 'ru';

  function t(key) {
    return DICT[currentLang][key] ?? DICT.ru[key] ?? key;
  }

  function applyLanguage(lang) {
    currentLang = lang === 'en' ? 'en' : 'ru';
    localStorage.setItem(STORAGE_KEY, currentLang);
    document.documentElement.lang = currentLang;
    document.title = t('meta-title');
    document.querySelector('meta[name="description"]')?.setAttribute('content', t('meta-description'));

    document.querySelectorAll('[data-i18n]').forEach((el) => {
      el.innerHTML = t(el.getAttribute('data-i18n'));
    });
    document.querySelectorAll('[data-i18n-alt]').forEach((el) => {
      el.alt = t(el.getAttribute('data-i18n-alt'));
    });
    document.querySelectorAll('[data-i18n-aria]').forEach((el) => {
      el.setAttribute('aria-label', t(el.getAttribute('data-i18n-aria')));
    });

    const switchEl = document.getElementById('langSwitch');
    if (switchEl) {
      switchEl.classList.toggle('is-en', currentLang === 'en');
      switchEl.querySelectorAll('.lang-option').forEach((btn) => {
        btn.classList.toggle('is-active', btn.dataset.lang === currentLang);
      });
    }

    window.dispatchEvent(new CustomEvent('i18n:change', { detail: currentLang }));
  }

  window.__i18n = { t, get lang() { return currentLang; }, setLang: applyLanguage };

  document.addEventListener('DOMContentLoaded', () => {
    const switchEl = document.getElementById('langSwitch');
    switchEl?.querySelectorAll('.lang-option').forEach((btn) => {
      btn.addEventListener('click', () => applyLanguage(btn.dataset.lang));
    });
    applyLanguage(currentLang);
  });
})();
