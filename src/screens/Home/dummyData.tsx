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
  { id: '2', title: 'Shoes', image: require('../../assets/images/home/shoes.png'), badgeText: 'Starting @ ₹999' },
  { id: '3', title: 'Shoes', image: require('../../assets/images/home/shoes.png'), badgeText: 'Starting @ ₹999' },
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

export const bestSellingItem = {
  brand: 'Cargos',
  price: '₹324.00',
  originalPrice: 'MRP ₹394.00',
  image: require('../../assets/images/home/shoes.png'),
};

export const topBrands = [
  { id: '1', image: require('../../assets/images/home/iPhone 16 Plus - 106.png'), logoText: 'Apple' },
  { id: '2', image: require('../../assets/images/home/shoes.png'), logoText: 'Nike' },
  { id: '3', image: require('../../assets/images/home/cooling_glass.png'), logoText: 'Infinity' },
];

export const gShockData = {
  mainImage: require('../../assets/images/home/gshock.png'),
  items: [
    { id: '1', title: '₹999', image: require('../../assets/images/home/gshock.png'), theme: 'dark' },
    { id: '2', title: '₹999', image: require('../../assets/images/home/gshock.png'), theme: 'light' },
    { id: '3', title: '₹999', image: require('../../assets/images/home/gshock.png'), theme: 'dark' },
    { id: '4', title: '₹999', image: require('../../assets/images/home/gshock.png'), theme: 'light' },
  ]
};

export const superSaleBanner = require('../../assets/images/home/super_sale.png');

export const flashSaleItems = [
  { id: '1', price: '₹324.00', image: require('../../assets/images/home/shoes.png') },
  { id: '2', price: '₹400.00', image: require('../../assets/images/home/phone.png') },
  { id: '3', price: '₹550.00', image: require('../../assets/images/home/cooling_glass.png') },
];
