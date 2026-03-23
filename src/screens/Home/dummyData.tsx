export const sliderImages = [
  // Fallback to placeholder since no specific header image was provided in the folder
  { id: '1', image: { uri: 'https://picsum.photos/seed/kshop_hero1/800/600' } },
  { id: '2', image: { uri: 'https://picsum.photos/seed/kshop_hero2/800/600' } },
  { id: '3', image: { uri: 'https://picsum.photos/seed/kshop_hero3/800/600' } },
  { id: '4', image: { uri: 'https://picsum.photos/seed/kshop_hero4/800/600' } },
  { id: '5', image: { uri: 'https://picsum.photos/seed/kshop_hero5/800/600' } },
];

export const goatDeals = [
  { id: '1', title: 'Phone', image: require('../../assets/images/home/phone.png'), badgeText: 'Starting @ ₹999' },
  { id: '2', title: 'Shoes', image: require('../../assets/images/home/items/shoes.png'), badgeText: 'Starting @ ₹999' },
  { id: '3', title: 'Shoes', image: require('../../assets/images/home/items/shoes_02.png'), badgeText: 'Starting @ ₹999' },
  { id: '4', title: 'Dress', image: require('../../assets/images/home/dress.png'), badgeText: 'Starting @ ₹999' },
];

export const exploreItems = [
  {
    id: '1',
    title: 'Lorem Ipsum is simply dummy textLorem Ipsum is simply dummy',
    image: require('../../assets/images/home/explore.png'),
    originalPrice: 'MRP ₹394.00',
    currentPrice: '₹324.00',
    discountBadge: '-17%',
    rating: 1
  },
  {
    id: '2',
    title: 'Lorem Ipsum is simply dummy textLorem Ipsum is simply dummy',
    image: require('../../assets/images/home/explore.png'),
    originalPrice: 'MRP ₹394.00',
    currentPrice: '₹324.00',
    discountBadge: '-17%',
    rating: 1
  },
  {
    id: '3',
    title: 'Lorem Ipsum is simply dummy textLorem Ipsum is simply dummy',
    image: require('../../assets/images/home/explore.png'),
    originalPrice: 'MRP ₹394.00',
    currentPrice: '₹324.00',
    discountBadge: '-17%',
    rating: 1
  },
];

export const bestSellingItems = [
  { id: '1', brand: 'Sneakers', price: '₹499.00', originalPrice: 'MRP ₹699.00', image: require('../../assets/images/home/items/shoes_02.png') },
  { id: '2', brand: 'Cargos', price: '₹324.00', originalPrice: 'MRP ₹394.00', image: require('../../assets/images/home/items/shoes.png') },
  { id: '3', brand: 'Loafers', price: '₹279.00', originalPrice: 'MRP ₹350.00', image: require('../../assets/images/home/items/shoes_03.jpg') },
  { id: '4', brand: 'Formals', price: '₹599.00', originalPrice: 'MRP ₹799.00', image: require('../../assets/images/home/items/shoes.png') },
];

export const topBrands = [
  { id: '1', image: require('../../assets/images/home/phone.png'), logoText: 'Apple', logo: require('../../assets/images/logos/apple.png') },
  { id: '2', image: require('../../assets/images/home/items/shoes.png'), logoText: 'Nike', logo: require('../../assets/images/logos/nike.png') },
  { id: '3', image: require('../../assets/images/home/cooling_glass.png'), logoText: 'Infinity', logo: require('../../assets/images/logos/lenscart.png') },
];

export const gShockData = {
  mainImage: require('../../assets/images/home/items/gshock.png'),
  items: [
    { id: '1', title: '₹999', image: require('../../assets/images/home/items/watch.png'), theme: 'dark' },
    { id: '2', title: '₹999', image: require('../../assets/images/home/items/watch.png'), theme: 'light' },
    { id: '3', title: '₹999', image: require('../../assets/images/home/items/watch.png'), theme: 'dark' },
    { id: '4', title: '₹999', image: require('../../assets/images/home/items/watch.png'), theme: 'light' },
  ]
};

export const superSaleBanners = [
  { id: '1', title: '11.11 SALE', subtitle: 'Biggest Sale of the Year!', badge: 'Up to 70% OFF', colors: ['#78BFB9', '#A4E8DF'], image: require('../../assets/images/home/super_sale.png') },
  { id: '2', title: 'FLASH DEALS', subtitle: 'Limited time offers!', badge: 'Up to 50% OFF', colors: ['#5BA3B0', '#8ED2C9'], image: require('../../assets/images/home/super_sale.png') },
  { id: '3', title: 'NEW ARRIVALS', subtitle: 'Fresh styles, hot prices', badge: 'Starting ₹299', colors: ['#4A9DA8', '#78C5BD'], image: require('../../assets/images/home/super_sale.png') },
  { id: '4', title: 'CLEARANCE', subtitle: 'Last chance to grab it!', badge: 'Min 60% OFF', colors: ['#3D8A96', '#6BB8B0'], image: require('../../assets/images/home/super_sale.png') },
  { id: '5', title: 'WEEKEND SALE', subtitle: 'Shop more, save more', badge: 'Extra 15% OFF', colors: ['#5BB0A8', '#80CFC6'], image: require('../../assets/images/home/super_sale.png') },
];

export const flashSaleItems = [
  { id: '1', price: '₹324.00', image: require('../../assets/images/home/items/shoes.png') },
  { id: '2', price: '₹400.00', image: require('../../assets/images/home/phone.png') },
  { id: '3', price: '₹550.00', image: require('../../assets/images/home/cooling_glass.png') },
];
