export const topFilters = [
    { id: '1', name: 'Men', image: require('../../assets/images/category/men.jpg') },
    { id: '2', name: 'Women', image: require('../../assets/images/category/perfume.jpg') },
    { id: '3', name: 'Kids', image: require('../../assets/images/category/perfume.jpg') },
    { id: '4', name: 'Beauty', image: require('../../assets/images/category/perfume.jpg') },
];

export const subCategories: Record<string, any[]> = {
    '1': [
        { id: 'm1', name: 'Dress', icon: require('../../assets/images/category/shirt.png') },
        { id: 'm2', name: 'Footware', icon: require('../../assets/images/category/nike.png') },
        { id: 'm3', name: 'Accessories', icon: require('../../assets/images/category/casual.png') },
    ],
    '2': [
        { id: 'w1', name: 'Dresses', icon: require('../../assets/images/home/dress.png') },
        { id: 'w2', name: 'Footware', icon: require('../../assets/images/category/nike.png') },
        { id: 'w3', name: 'Beauty', icon: require('../../assets/images/category/perfume.jpg') },
    ],
    '3': [
        { id: 'k1', name: 'Toys', icon: require('../../assets/images/category/nike.png') },
        { id: 'k2', name: 'Clothing', icon: require('../../assets/images/category/shirt.png') },
    ],
    '4': [
        { id: 'b1', name: 'Makeup', icon: require('../../assets/images/category/perfume.jpg') },
        { id: 'b2', name: 'Skin Care', icon: require('../../assets/images/category/bathroom_essential.jpg') },
    ],
};

export const productsData: Record<string, any[]> = {
    'm1': [
        { id: '1', title: 'Men Casual Shirt', price: '₹324.00', oldPrice: 'MRP ₹394.00', discount: '-17%', rating: 4, image: require('../../assets/images/category/casual.png') },
        { id: '2', title: 'Men Formal Shirt', price: '₹400.00', oldPrice: 'MRP ₹500.00', discount: '-20%', rating: 5, image: require('../../assets/images/category/shirt.png') },
    ],
    'm2': [
        { id: '3', title: 'Nike Running Shoes', price: '₹1200.00', oldPrice: 'MRP ₹1500.00', discount: '-20%', rating: 4, image: require('../../assets/images/category/nike.png') },
        { id: '4', title: 'Sports Sneakers', price: '₹999.00', oldPrice: 'MRP ₹1299.00', discount: '-23%', rating: 3, image: require('../../assets/images/category/nike.png') },
    ],
    'm3': [
        { id: '5', title: 'Stylish Watch', price: '₹250.00', oldPrice: 'MRP ₹500.00', discount: '-50%', rating: 4, image: require('../../assets/images/category/casual.png') },
    ],
    'w1': [
        { id: '6', title: 'Women Summer Dress', price: '₹750.00', oldPrice: 'MRP ₹1000.00', discount: '-25%', rating: 5, image: require('../../assets/images/home/dress.png') },
        { id: '7', title: 'Women Evening Gown', price: '₹1500.00', oldPrice: 'MRP ₹2000.00', discount: '-25%', rating: 4, image: require('../../assets/images/home/dress.png') },
    ],
    'w2': [
        { id: '8', title: 'Women Heels', price: '₹800.00', oldPrice: 'MRP ₹1200.00', discount: '-33%', rating: 4, image: require('../../assets/images/category/nike.png') },
    ],
    'w3': [
        { id: '9', title: 'Premium Perfume', price: '₹2000.00', oldPrice: 'MRP ₹2500.00', discount: '-20%', rating: 5, image: require('../../assets/images/category/perfume.jpg') },
    ],
    'k1': [],
    'k2': [],
    'b1': [],
    'b2': [],
};

export const filterOptions = {
    'Prize': [
        'Below ₹500',
        '₹500 - ₹1000',
        '₹1000 - ₹2000',
        'Above ₹2000'
    ],
    // 'Brands': [
    //     'Nike',
    //     'Puma',
    //     'Zara',
    //     'Adidas'
    // ],
    // 'Discount Range': [
    //     '10% and above',
    //     '20% and above',
    //     '30% and above',
    //     '40% and above'
    // ],
    // 'Size': [
    //     'S',
    //     'M',
    //     'L',
    //     'XL',
    //     'XXL'
    // ],
    'Sort by': [
        'relevance',
        'price_low_to_high',
        'price_high_to_low',
        'rating',
        'newest'
    ]
};

export const SORT_OPTIONS = [
    { label: 'Relevance', value: 'relevance' },
    { label: 'Latest', value: 'latest' },
    { label: 'A to Z', value: 'a-z' },
    { label: 'Z to A', value: 'z-a' },
    { label: 'Price: Low to High', value: 'lowToHigh' },
    { label: 'Price: High to Low', value: 'highToLow' },
];
