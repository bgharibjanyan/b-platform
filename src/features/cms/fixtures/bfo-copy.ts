import type { Locale } from "../types";

type Copy = {
  eyebrow: string;
  hero: string;
  intro: string;
  discover: string;
  services: string;
  servicesIntro: string;
  offerings: [title: string, summary: string, icon: string][];
  about: string;
  aboutText: string;
  process: string;
  steps: [title: string, summary: string][];
  contact: string;
  contactIntro: string;
  write: string;
  call: string;
  address: string;
  website: string;
};

export const BFO_COPY: Record<Locale, Copy> = {
  en: {
    eyebrow: "Accounting and advisory · Yerevan",
    hero: "Know where your business stands.",
    intro: "Get a clear picture of your books, tax obligations, and finances. BFO Consulting Group supports businesses in Armenia with day-to-day accounting and advice for the decisions ahead.",
    discover: "Explore services",
    services: "Support where your business needs it",
    servicesIntro: "Bring us a specific question or ask us to run your accounting. We’ll help define the scope and what your team needs to prepare.",
    offerings: [
      ["Outsourced accounting", "From recording transactions to preparing reports and restoring incomplete books.", "ledger"],
      ["Tax advisory", "Understand your obligations, review reporting issues, and plan for upcoming filings.", "percent"],
      ["Financial advisory", "Review cash flow and financial reports to understand how the business is performing.", "chart"],
      ["Corporate and legal support", "Get help with company documentation, contracts, and routine corporate matters.", "scale"],
      ["Payroll and HR", "Get support with payroll and employee records as your team changes.", "users"],
      ["Business consulting", "Review internal processes and plan the next stage of your operations.", "compass"],
    ],
    about: "Finance support based in Armenia",
    aboutText: "Our Yerevan team works with startups, established companies, and local teams of international businesses. We can take on regular accounting or help resolve a specific issue such as incomplete records or a change in how the company operates.",
    process: "How we start working together",
    steps: [
      ["Tell us what’s happening", "Share what your company does, what is changing, and any deadlines you’re working toward."],
      ["Agree on the scope", "We’ll discuss which records we need and what we can take on."],
      ["Set a rhythm", "Agree how to share documents, exchange questions, and receive updates."],
    ],
    contact: "Talk to the BFO team",
    contactIntro: "Tell us about your company and the support you need. Mention any upcoming filing or payroll deadline.",
    write: "Email BFO",
    call: "Call BFO",
    address: "8 Vardanants Blind Alley, Yerevan, Armenia",
    website: "BFO website",
  },
  hy: {
    eyebrow: "Հաշվապահություն և խորհրդատվություն · Երևան",
    hero: "Հստակ պատկեր ձեր բիզնեսի մասին։",
    intro: "Իմացեք՝ ինչ վիճակում են ձեր հաշվառումը, հարկային պարտավորություններն ու ֆինանսները։ BFO Consulting Group-ն աջակցում է Հայաստանում գործող ընկերություններին ամենօրյա հաշվապահական աշխատանքներում և կարևոր որոշումներ կայացնելիս։",
    discover: "Դիտել ծառայությունները",
    services: "Աջակցություն՝ ըստ ձեր բիզնեսի կարիքների",
    servicesIntro: "Դիմեք կոնկրետ հարցով կամ վստահեք մեզ ձեր հաշվապահությունը։ Կքննարկենք աշխատանքների ծավալն ու անհրաժեշտ փաստաթղթերը։",
    offerings: [
      ["Հաշվապահության աութսորսինգ", "Գործարքների հաշվառում, հաշվետվությունների կազմում և թերի հաշվառման վերականգնում։", "ledger"],
      ["Հարկային խորհրդատվություն", "Պարզաբանեք հարկային պարտավորությունները, վերանայեք հաշվետվություններն ու պլանավորեք դրանց ներկայացումը։", "percent"],
      ["Ֆինանսական խորհրդատվություն", "Վերլուծեք դրամական հոսքերն ու ֆինանսական հաշվետվությունները՝ հասկանալու բիզնեսի արդյունքները։", "chart"],
      ["Իրավաբանական աջակցություն", "Աջակցություն ընկերության փաստաթղթերի, պայմանագրերի և ընթացիկ կորպորատիվ հարցերում։", "scale"],
      ["Աշխատավարձ և կադրեր", "Աջակցություն աշխատավարձի հաշվարկման և աշխատակիցների փաստաթղթերի վարման հարցերում։", "users"],
      ["Բիզնես խորհրդատվություն", "Վերանայեք ներքին գործընթացները և պլանավորեք ձեր գործունեության հաջորդ փուլը։", "compass"],
    ],
    about: "Ֆինանսական աջակցություն Հայաստանում",
    aboutText: "Մեր երևանյան թիմն աշխատում է նորաստեղծ և գործող ընկերությունների, ինչպես նաև միջազգային կազմակերպությունների տեղական թիմերի հետ։ Մենք կարող ենք վարել ընթացիկ հաշվապահությունը կամ օգնել լուծել առանձին խնդիր՝ օրինակ վերականգնել թերի հաշվառումը։",
    process: "Ինչպես ենք սկսում համագործակցությունը",
    steps: [
      ["Պատմեք ձեր բիզնեսի մասին", "Ներկայացրեք ձեր գործունեությունը, սպասվող փոփոխություններն ու կարևոր ժամկետները։"],
      ["Համաձայնեցրեք աշխատանքների ծավալը", "Կքննարկենք՝ ինչ փաստաթղթեր են պետք և որ աշխատանքները կարող ենք ստանձնել։"],
      ["Պայմանավորվեք կապի մասին", "Կորոշենք՝ ինչպես փոխանցել փաստաթղթերը, ուղղել հարցերն ու ստանալ թարմացումներ։"],
    ],
    contact: "Կապվեք BFO-ի թիմի հետ",
    contactIntro: "Ներկայացրեք ձեր ընկերությունը և նշեք, թե ինչ աջակցություն է ձեզ անհրաժեշտ։ Գրեք նաև առաջիկա կարևոր ժամկետները։",
    write: "Գրել BFO-ին",
    call: "Զանգահարել BFO-ին",
    address: "Վարդանանց փակուղի 8, Երևան, Հայաստան",
    website: "BFO-ի կայք",
  },
  ru: {
    eyebrow: "Бухгалтерия и консалтинг · Ереван",
    hero: "Будьте в курсе финансов вашего бизнеса.",
    intro: "Получите ясную картину учёта, налоговых обязательств и финансов. BFO Consulting Group помогает компаниям в Армении вести бухгалтерию и принимать взвешенные решения.",
    discover: "Смотреть услуги",
    services: "Поддержка под задачи вашего бизнеса",
    servicesIntro: "Обратитесь с конкретным вопросом или передайте нам ведение бухгалтерии. Обсудим объём работ и подготовку документов.",
    offerings: [
      ["Аутсорсинг бухгалтерии", "Учёт операций, подготовка отчётности и восстановление неполных записей.", "ledger"],
      ["Налоговое консультирование", "Разберитесь с обязательствами, проверьте отчётность и спланируйте её подачу.", "percent"],
      ["Финансовый консалтинг", "Проанализируйте денежные потоки и отчётность, чтобы понять результаты бизнеса.", "chart"],
      ["Юридическая поддержка", "Помощь с документами компании, договорами и текущими корпоративными вопросами.", "scale"],
      ["Расчёт зарплаты и кадры", "Помощь с расчётом зарплаты и ведением кадровых документов.", "users"],
      ["Бизнес-консалтинг", "Оцените внутренние процессы и спланируйте следующий этап работы.", "compass"],
    ],
    about: "Финансовая поддержка в Армении",
    aboutText: "Наша команда в Ереване работает со стартапами, действующими компаниями и местными командами международных организаций. Мы можем вести текущий учёт или помочь с отдельной задачей, например с восстановлением неполных записей.",
    process: "Как мы начинаем сотрудничество",
    steps: [
      ["Расскажите о своём бизнесе", "Опишите, чем занимается компания, какие изменения ожидаются и какие сроки важны."],
      ["Согласуйте объём работ", "Обсудим, какие документы понадобятся и какие задачи мы можем взять на себя."],
      ["Договоритесь о связи", "Определим, как обмениваться документами, задавать вопросы и получать обновления."],
    ],
    contact: "Свяжитесь с командой BFO",
    contactIntro: "Расскажите о компании и нужной вам поддержке. Укажите ближайшие сроки подачи отчётности или расчёта зарплаты.",
    write: "Написать BFO",
    call: "Позвонить в BFO",
    address: "тупик Вардананц, 8, Ереван, Армения",
    website: "Сайт BFO",
  },
};
