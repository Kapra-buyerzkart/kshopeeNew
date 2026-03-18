import database from './index';
import Product from './models/Product';

export const seedDummyClients = async () => {
  try {
    const clientsCollection = database.collections.get('clients');
    const existingClients = await clientsCollection.query().fetch();

    // Only seed if there are no clients
    if (existingClients.length === 0) {
      console.log('Seeding dummy client data...');

      await database.write(async () => {
        const dummyClients = [
          { name: 'Jean Moussa', mobile: '+224 654121212', email: 'jean.moussa@email.com', address: 'N3, Dubreka, Guinée' },
          { name: 'Marie Camara', mobile: '+224 623456789', email: 'marie.camara@email.com', address: 'Kaloum, Conakry, Guinée' },
          { name: 'Ahmed Diallo', mobile: '+224 655987654', email: 'ahmed.diallo@email.com', address: 'Ratoma, Conakry, Guinée' },
          { name: 'Fatima Barry', mobile: '+224 664112233', email: 'fatima.barry@email.com', address: 'Matam, Conakry, Guinée' },
          { name: 'Mamadou Bah', mobile: '+224 677998877', email: 'mamadou.bah@email.com', address: 'Dixinn, Conakry, Guinée' },
          { name: 'Aissatou Sow', mobile: '+224 688554433', email: null, address: 'Matoto, Conakry, Guinée' },
          { name: 'Ibrahim Konaté', mobile: '+224 699223344', email: 'ibrahim.konate@email.com', address: null },
        ];

        for (const clientData of dummyClients) {
          await clientsCollection.create((client: any) => {
            client.name = clientData.name;
            client.mobile = clientData.mobile;
            client.email = clientData.email || '';
            client.address = clientData.address || '';
          });
        }
      });

      console.log('Dummy clients seeded successfully!');
    } else {
      console.log(`Found ${existingClients.length} existing clients, skipping seed.`);
    }
  } catch (error) {
    console.error('Error seeding dummy clients:', error);
  }
};

export const seedProducts = async () => {
  try {
    const productsCollection = database.collections.get<Product>('products');
    const existingProducts = await productsCollection.query().fetch();

    if (existingProducts.length === 0) {
      console.log('Seeding dummy product data...');

      const dummyProducts = [
        {
          name: 'Salad Tuna',
          description: '(Must choose level)',
          price: 500.67,
          image: 'https://images.unsplash.com/photo-1546069901-ba9599a7e63c?w=500&auto=format&fit=crop&q=60',
          categoryId: 'appetizer',
        },
        {
          name: 'Salad Egg',
          description: '',
          price: 300.99,
          image: 'https://images.unsplash.com/photo-1512621776951-a57141f2eefd?w=500&auto=format&fit=crop&q=60',
          categoryId: 'appetizer',
        },
        {
          name: 'Wagyu Black Paper',
          description: '(Must choose level)',
          price: 34.98,
          image: 'https://images.unsplash.com/photo-1504674900247-0877df9cc836?w=500&auto=format&fit=crop&q=60',
          categoryId: 'main',
        },
        {
          name: 'Avocado Juice',
          description: 'Fresh',
          price: 45.00,
          image: 'https://images.unsplash.com/photo-1603569283847-aa295f0d016a?w=500&auto=format&fit=crop&q=60',
          categoryId: 'drink',
        },
      ];

      await database.write(async () => {
        for (const p of dummyProducts) {
          await productsCollection.create((product: any) => {
            product.name = p.name;
            product.description = p.description;
            product.price = p.price;
            product.image = p.image;
            product.categoryId = p.categoryId;
          });
        }
      });

      console.log('Dummy products seeded successfully!');
    } else {
      console.log(`Found ${existingProducts.length} existing products, skipping seed.`);
    }
  } catch (error) {
    console.error('Error seeding products:', error);
  }
};
