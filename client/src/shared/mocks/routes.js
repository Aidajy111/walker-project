const baseRoutes = [
  {
    id: "route-1",
    image: "/images/datsan.png",
    imageAlt: "Иволгинский дацан",
    title: "Иволгинский дацан",
    description:
      "буддийский монастырь-дацан, центр Буддийской традиционной Сангхи России. Расположен в Республике Бурятия в селе Верхняя Иволга в 36 км западнее центра Улан-Удэ.",
    chips: [
      { text: "Тур-агентство", color: "#ff8d3b" },
      { text: "Гид", color: "#884cff" },
      { text: "Транспорт", color: "#ff0048" },
    ],
    region: "Республика Бурятия",
    city: "Улан-Удэ",
    season: "Лето",
    tags: ["бузы", "природа", "байкал"],
  },
  {
    id: "route-2",
    image: "/images/shamanka.png",
    imageAlt: "Скала Шаманка",
    title: "Скала шаманка",
    description: "Мыс в средней части западного побережья острова Ольхон на озере Байкал.",
    chips: [{ text: "Авторский", color: "#ff8d3b" }],
    region: "Республика Бурятия",
    city: "Селенгинск",
    season: "Лето",
    tags: ["природа", "байкал"],
  },
  {
    id: "route-3",
    image: "/images/datsan.png",
    imageAlt: "Иволгинский дацан",
    title: "Дацан и этно-маршрут",
    description: "Насыщенный культурный маршрут с гидом и трансфером.",
    chips: [{ text: "Гид", color: "#884cff" }],
    region: "Республика Бурятия",
    city: "Гусиноозёрск",
    season: "Осень",
    tags: ["культура", "дацаны"],
  },
  {
    id: "route-4",
    image: "/images/shamanka.png",
    imageAlt: "Скала Шаманка",
    title: "Байкал выходного дня",
    description: "Короткий маршрут на выходные с красивыми локациями.",
    chips: [{ text: "Транспорт", color: "#ff0048" }],
    region: "Республика Бурятия",
    city: "Нижнеангарск",
    season: "Весна",
    tags: ["байкал", "природа"],
  },
];

export const mockRoutes = Array.from({ length: 8 }).flatMap((_, batchIndex) =>
  baseRoutes.map((route) => ({
    ...route,
    id: `${route.id}-b${batchIndex + 1}`,
  })),
);
