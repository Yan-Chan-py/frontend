/**
 * DB Initialization Script (Sequelize Version)
 * Run: node db/init.js
 * Syncs database tables and seeds initial bouquet data.
 */
const sequelize = require('./db');
const Bouquet = require('../models/Bouquet');
const Order = require('../models/Order');

const BOUQUETS_SEED = [
  {
    title: 'Spring Elegance',
    description:
      'A delicate blend of peonies, tulips, and roses – perfect for springtime gifting and bright smiles.',
    price: 35,
    photoURL: 'https://images.unsplash.com/photo-1490750967868-88df5691cc5b?w=530&q=80',
    category: 'bestseller',
    is_bestseller: true,
  },
  {
    title: 'Berry Chic',
    description:
      'A stylish composition of roses, seasonal greenery, and vibrant berries – a bold and elegant floral statement.',
    price: 40,
    photoURL: 'https://images.unsplash.com/photo-1519225421980-715cb0215aed?w=530&q=80',
    category: 'bestseller',
    is_bestseller: true,
  },
  {
    title: 'Lavender Dream',
    description:
      'A rich bouquet with lavender, lisianthus, and roses – ideal for those who love deep hues and gentle fragrance.',
    price: 55,
    photoURL: 'https://images.unsplash.com/photo-1468327768560-75b778cbb551?w=530&q=80',
    category: 'bestseller',
    is_bestseller: true,
  },
  {
    title: 'Peach Meadow',
    description:
      'A soft and radiant arrangement of peach and blush roses with lush greenery in a straw basket – light and natural.',
    price: 55,
    photoURL: 'https://images.unsplash.com/photo-1525310072745-f49212b5ac6d?w=530&q=80',
    category: 'general',
    is_bestseller: false,
  },
  {
    title: 'Blush Romance',
    description:
      'A premium bouquet of deep pink and rosy roses, complemented by silver eucalyptus – sophisticated and intimate.',
    price: 34,
    photoURL: 'https://images.unsplash.com/photo-1548094878-84ced0f19bb3?w=530&q=80',
    category: 'general',
    is_bestseller: false,
  },
  {
    title: 'Pastel Garden',
    description:
      'A pastel-toned mix of spring roses and greenery in a woven basket – gentle, airy, and perfect for any occasion.',
    price: 40,
    photoURL: 'https://images.unsplash.com/photo-1473172707857-f9e276582ab6?w=530&q=80',
    category: 'general',
    is_bestseller: false,
  },
  {
    title: 'Tulip Charm',
    description:
      'A vivid bouquet of bright tulips and roses in a lavender box – cheerful and full of charm.',
    price: 61,
    photoURL: 'https://images.unsplash.com/photo-1471879832106-c7ab9e0cee23?w=530&q=80',
    category: 'general',
    is_bestseller: false,
  },
  {
    title: 'Berry Bloom',
    description:
      'A lush mix of rich pink, purple, and cream blooms with textured green accents – romantic and elegant.',
    price: 32,
    photoURL: 'https://images.unsplash.com/photo-1561181286-d3fee7d55364?w=530&q=80',
    category: 'general',
    is_bestseller: false,
  },
  {
    title: 'Sweet Whisper',
    description:
      'A charming spring bouquet with peonies, roses, and lilac forest accents – fresh, lively, and expressive.',
    price: 40,
    photoURL: 'https://images.unsplash.com/photo-1534954553104-88cb75be7648?w=530&q=80',
    category: 'general',
    is_bestseller: false,
  },
  {
    title: 'Field Joy',
    description:
      'A rustic hand-tied bouquet of sunflowers, lisianthus, and daisies – perfect for brightening the day.',
    price: 49,
    photoURL: 'https://images.unsplash.com/photo-1463936575829-25148e1db1b8?w=530&q=80',
    category: 'general',
    is_bestseller: false,
  },
  {
    title: 'Soft Bloom',
    description:
      'A delicate bouquet of pink carnations and roses wrapped in satin paper – soft, stylish, and versatile.',
    price: 37,
    photoURL: 'images/soft-bloom.png',
    category: 'general',
    is_bestseller: false,
  },
  {
    title: 'Sunset Glow',
    description:
      'Warm orange roses and golden accents — a radiant bouquet for cheerful celebrations.',
    price: 42,
    photoURL: 'images/peach-meadow.png',
    category: 'general',
    is_bestseller: false,
  },
  {
    title: 'Morning Dew',
    description:
      'Soft whites and pale greens evoking early spring — fresh and calming.',
    price: 38,
    photoURL: 'images/pastel-garden.png',
    category: 'general',
    is_bestseller: false,
  },
  {
    title: 'Ruby Garden',
    description:
      'Deep reds and burgundy tones for a dramatic, romantic statement.',
    price: 58,
    photoURL: 'images/blush-romance.png',
    category: 'general',
    is_bestseller: false,
  },
  {
    title: 'Citrus Splash',
    description:
      'Bright yellows and citrus hues paired with lush greens — instant sunshine.',
    price: 44,
    photoURL: 'images/field-joy.png',
    category: 'general',
    is_bestseller: false,
  },
  {
    title: 'Ocean Mist',
    description:
      'Cool blues, whites, and silver foliage — serene and sophisticated.',
    price: 52,
    photoURL: 'images/tulip-charm.png',
    category: 'general',
    is_bestseller: false,
  },
  {
    title: 'Golden Hour',
    description:
      'Amber blooms and wheat tones inspired by late-afternoon light.',
    price: 46,
    photoURL: 'images/sweet-whisper.png',
    category: 'general',
    is_bestseller: false,
  },
  {
    title: 'Forest Walk',
    description:
      'Textured greens, ferns, and woodland blooms — natural and grounded.',
    price: 41,
    photoURL: 'images/berry-bloom.png',
    category: 'general',
    is_bestseller: false,
  },
  {
    title: 'Ivory Lace',
    description:
      'All-white composition with delicate texture — timeless wedding-ready style.',
    price: 62,
    photoURL: 'images/blush-romance.png',
    category: 'general',
    is_bestseller: false,
  },
  {
    title: 'Wild Meadow Mix',
    description:
      'Loose, garden-picked look with seasonal wildflowers and herbs.',
    price: 36,
    photoURL: 'images/peach-meadow.png',
    category: 'general',
    is_bestseller: false,
  },
];

async function init() {
  try {
    console.log('🌸 Initializing database with Sequelize...');
    await sequelize.authenticate();
    console.log('✅ Connection has been established successfully.');

    // Sync database (creates table if not exists or updates them depending on alter/force option)
    // We will use alter: true or force: true to recreate tables so that columns match Sequelize attributes
    await sequelize.sync({ force: true });
    console.log('✅ Database synchronized (tables recreated)');

    // Seed bouquets
    await Bouquet.bulkCreate(BOUQUETS_SEED);
    console.log(`✅ Successfully seeded ${BOUQUETS_SEED.length} bouquets`);

  } catch (err) {
    console.error('❌ Database initialization error:', err.message);
    process.exitCode = 1;
  } finally {
    await sequelize.close();
  }
}

init();
