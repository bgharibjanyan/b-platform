import type { Locale } from "../types";

type Copy = {
  eyebrow: string;
  hero: string;
  intro: string;
  catalog: string;
  seller: string;
  examples: string;
  sampleNote: string;
  products: [name: string, description: string][];
  order: string;
  orderText: string;
  contact: string;
  contactText: string;
  email: string;
  address: string;
  heroAlt: string;
  productAlts: string[];
};

export const ARPHARMA_COPY: Record<Locale, Copy> = {
  en: {
    eyebrow: "Arpharma · Yerevan",
    hero: "Essentials for your daily routine.",
    intro: "Explore personal-care catalogue examples and visit Arpharma’s Wildberries storefront for the current range, pack sizes, and ordering details.",
    catalog: "Explore the catalogue",
    seller: "View Arpharma on Wildberries",
    examples: "Personal-care catalogue examples",
    sampleNote: "These examples show product types and illustrate the catalogue layout. Check the seller’s listings for current stock, photos, and specifications.",
    products: [
      ["Cotton rounds", "Soft round pads for everyday face care and makeup removal."],
      ["Cotton swabs", "Double-ended cotton tips for small tasks such as makeup touch-ups."],
      ["Travel bottle set", "Refillable containers for small amounts of shampoo, body wash, or lotion."],
    ],
    order: "See the current Arpharma range",
    orderText: "Open our Wildberries storefront to check product listings, prices, and delivery options.",
    contact: "Contact Arpharma",
    contactText: "For product or business enquiries, write to Arpharma directly. For an existing Wildberries order, use the order details in your marketplace account.",
    email: "Email Arpharma",
    address: "14 Nikoghayos Tigranyan Street, Yerevan, Armenia",
    heroAlt: "Illustration of cotton rounds, swabs and travel bottles",
    productAlts: ["White cotton rounds beside a lavender pouch", "Cotton swabs in a clear dispenser", "Three pastel bottles with flip-top caps"],
  },
  hy: {
    eyebrow: "Արֆարմա · Երևան",
    hero: "Ամենօրյա խնամքի անհրաժեշտ պարագաներ։",
    intro: "Դիտեք անձնական խնամքի ապրանքների օրինակներ։ Ընթացիկ տեսականուն, փաթեթավորման չափերին և պատվերի պայմաններին ծանոթացեք Wildberries-ի Արֆարմա խանութում։",
    catalog: "Դիտել կատալոգը",
    seller: "Դիտել Արֆարման Wildberries-ում",
    examples: "Խնամքի ապրանքների օրինակներ",
    sampleNote: "Այս օրինակները ներկայացնում են ապրանքների տեսակներն ու կատալոգի ձևավորումը։ Առկայությունը, լուսանկարները և բնութագրերը ստուգեք վաճառողի ապրանքների էջերում։",
    products: [
      ["Բամբակյա սկավառակներ", "Փափուկ սկավառակներ դեմքի ամենօրյա խնամքի և դիմահարդարումը մաքրելու համար։"],
      ["Բամբակյա փայտիկներ", "Երկկողմանի բամբակյա ծայրերով փայտիկներ՝ դիմահարդարումը շտկելու և այլ մանր աշխատանքների համար։"],
      ["Ճամփորդական շշերի հավաքածու", "Լիցքավորվող տարաներ՝ փոքր չափաբաժիններով շամպունի, լոգանքի գելի կամ լոսյոնի համար։"],
    ],
    order: "Դիտեք Արֆարմայի ընթացիկ տեսականին",
    orderText: "Բացեք մեր Wildberries խանութը՝ տեսականին, գները և առաքման պայմանները ստուգելու համար։",
    contact: "Կապ Արֆարմայի հետ",
    contactText: "Ապրանքների կամ համագործակցության հարցերով գրեք անմիջապես Արֆարմային։ Wildberries-ի արդեն ձևակերպված պատվերների տվյալները տեսեք ձեր հաշվում։",
    email: "Գրել Արֆարմային",
    address: "Նիկողայոս Տիգրանյան փողոց 14, Երևան, Հայաստան",
    heroAlt: "Բամբակյա սկավառակների, փայտիկների և ճամփորդական շշերի պատկերազարդում",
    productAlts: ["Սպիտակ բամբակյա սկավառակներ մանուշակագույն փաթեթի կողքին", "Բամբակյա փայտիկներ թափանցիկ տարայի մեջ", "Երեք պաստելային շիշ՝ բացվող կափարիչներով"],
  },
  ru: {
    eyebrow: "Арфарма · Ереван",
    hero: "Всё для повседневного ухода.",
    intro: "Посмотрите примеры товаров для личного ухода. Актуальный ассортимент, объём упаковки и условия заказа доступны в магазине Арфарма на Wildberries.",
    catalog: "Смотреть каталог",
    seller: "Арфарма на Wildberries",
    examples: "Примеры товаров для ухода",
    sampleNote: "Примеры показывают типы товаров и оформление каталога. Наличие, фотографии и характеристики уточняйте в карточках продавца.",
    products: [
      ["Ватные диски", "Мягкие круглые диски для ежедневного ухода за лицом и снятия макияжа."],
      ["Ватные палочки", "Двусторонние палочки с ватными наконечниками, например для коррекции макияжа."],
      ["Набор дорожных флаконов", "Флаконы, которые можно наполнить небольшим количеством шампуня, геля для душа или лосьона."],
    ],
    order: "Посмотрите актуальный ассортимент Арфарма",
    orderText: "Откройте наш магазин на Wildberries, чтобы узнать цены, наличие товаров и условия доставки.",
    contact: "Связаться с Арфарма",
    contactText: "По вопросам о товарах и сотрудничестве напишите нам напрямую. Информацию по оформленным заказам Wildberries можно найти в личном кабинете маркетплейса.",
    email: "Написать в Арфарма",
    address: "ул. Никогайоса Тиграняна, 14, Ереван, Армения",
    heroAlt: "Иллюстрация ватных дисков, палочек и дорожных флаконов",
    productAlts: ["Белые ватные диски рядом с сиреневой упаковкой", "Ватные палочки в прозрачном контейнере", "Три флакона пастельных оттенков с откидными крышками"],
  },
};
