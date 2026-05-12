const figmaKitchen = "https://www.figma.com/api/mcp/asset/e954ef7d-b38b-49eb-9464-550e24b3682d";

/**
 * Структура под будущий Strapi:
 * - cardVariant: enum — default | establishment | discount
 * - badgeText: короткий текст для «заведение месяца» (если нужен не дефолтный)
 * - discountText: строка скидки для variant discount
 * - bookingPhone: строка телефона или null — без кнопки «Забронировать»
 * - images[]: медиа-галерея точки
 * - lat, lng: координаты для карты (Leaflet), порядок в routePoints = порядок линии маршрута
 */
export const mockRouteDetails = {
  id: "route-details-1",
  routeSummary: {
    title: "Сердце Байкала: Ольхон и Листвянка",
    description:
      "Погрузитесь в атмосферу зимнего Байкала. Маршрут включает посещение знаменитого камня Черского, прогулки по прозрачному льду и знакомство с культурой коренных народов.",
    transport:
      "Рекомендуется аренда автомобиля или использование рейсовых автобусов/хивусов (судно на воздушной подушке).",
    location: "Камчатка",
    city: "Не указан",
    tags: ["байкал", "активныйотдых", "природа", "шаманизм"],
  },
  routeReviews: [
    {
      id: "review-1",
      author: "Айдажы Саая",
      rating: 4.4,
      text: "Маршрут очень крутой! Всем советую!",
    },
    {
      id: "review-2",
      author: "Ольга Петрова",
      rating: 4.8,
      text: "Красивые места и удобная логистика, особенно понравилась часть с Ольхоном.",
    },
    {
      id: "review-3",
      author: "Дмитрий Иванов",
      rating: 4.2,
      text: "Хороший маршрут, добавил бы больше времени на смотровые площадки.",
    },
  ],
  gallery: [
    { id: "photo-1", src: "/images/datsan.png", alt: "Иволгинский дацан" },
    { id: "photo-2", src: "/images/shamanka.png", alt: "Скала Шаманка" },
    { id: "photo-3", src: figmaKitchen, alt: "Локальная кухня" },
  ],
  routePoints: [
    {
      id: "rp-1",
      cardVariant: "establishment",
      badgeText: "Заведение месяца",
      title: "КАМЧАТКА Local Kitchen",
      rating: 4.9,
      workingHours: "Пн–Вс 10:00–23:00",
      averageCheck: "от 1 800 ₽",
      address: "г. Улан-Удэ, ул. Ленина, 45",
      description:
        "Авторская кухня с акцентом на местные продукты и уютный зал. Подходит для обеда после экскурсии по маршруту.",
      images: [
        { id: "rp1-1", src: figmaKitchen, alt: "Зал" },
        { id: "rp1-2", src: "/images/datsan.png", alt: "Блюдо" },
        { id: "rp1-3", src: "/images/shamanka.png", alt: "Интерьер" },
        { id: "rp1-4", src: figmaKitchen, alt: "Бар" },
        { id: "rp1-5", src: "/images/datsan.png", alt: "Веранда" },
      ],
      bookingPhone: "+7 900 123-45-67",
      href: "/place",
      audioSrc: "/sample-9s.mp3",
      lat: 51.8348,
      lng: 107.5842,
    },
    {
      id: "rp-2",
      cardVariant: "discount",
      discountText: "Скидка 15%",
      title: "Концертная площадка «Карта»",
      rating: 4.6,
      workingHours: "По афише",
      averageCheck: "от 900 ₽",
      address: "г. Улан-Удэ, пл. Советов, 1",
      description: "Площадка для мероприятий и концертов. При предъявлении маршрута действует скидка на билеты.",
      images: [
        { id: "rp2-1", src: "/images/shamanka.png", alt: "Сцена" },
        { id: "rp2-2", src: figmaKitchen, alt: "Зрители" },
        { id: "rp2-3", src: "/images/datsan.png", alt: "Вход" },
      ],
      bookingPhone: "+7 900 765-43-21",
      href: "/place",
      audioSrc: null,
      lat: 51.8264,
      lng: 107.5995,
    },
    {
      id: "rp-3",
      cardVariant: "default",
      title: "Смотровая площадка «Точка 3»",
      rating: 4.8,
      workingHours: "Круглосуточно",
      averageCheck: "бесплатно",
      address: "с. Верхняя Иволга, маршрут №2",
      description: "Панорамный вид на долину и монастырский комплекс. Удобная остановка в пешей части маршрута.",
      images: [
        { id: "rp3-1", src: "/images/datsan.png", alt: "Вид" },
        { id: "rp3-2", src: "/images/shamanka.png", alt: "Тропа" },
      ],
      bookingPhone: null,
      href: "/place",
      audioSrc: "/sample-9s.mp3",
      lat: 51.7492,
      lng: 107.2988,
    },
  ],
};
