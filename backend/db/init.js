/**
 * DB Initialization Script
 * Run: node db/init.js
 * Creates tables and seeds initial bouquet data.
 */
const path = require('path');
require('dotenv').config({ path: path.join(__dirname, '..', '.env') });
const pool = require('./db');

const SQL_CREATE = `
  CREATE TABLE IF NOT EXISTS bouquets (
    id          SERIAL PRIMARY KEY,
    name        VARCHAR(255)  NOT NULL,
    description TEXT          NOT NULL,
    price       NUMERIC(10,2) NOT NULL,
    image_url   TEXT,
    category    VARCHAR(100)  DEFAULT 'general',
    is_bestseller BOOLEAN     DEFAULT FALSE,
    created_at  TIMESTAMPTZ   DEFAULT NOW()
  );

  CREATE TABLE IF NOT EXISTS orders (
    id         SERIAL PRIMARY KEY,
    name       VARCHAR(255) NOT NULL,
    phone      VARCHAR(50)  NOT NULL,
    address    TEXT,
    message    TEXT,
    product    VARCHAR(255),
    quantity   INTEGER      DEFAULT 1,
    status     VARCHAR(50)  DEFAULT 'pending',
    created_at TIMESTAMPTZ  DEFAULT NOW()
  );
`;

const BOUQUETS_SEED = [
  {
    name: 'Spring Elegance',
    description:
      'A delicate blend of peonies, tulips, and roses – perfect for springtime gifting and bright smiles.',
    price: 35,
    image_url: 'https://images.unsplash.com/photo-1490750967868-88df5691cc5b?w=530&q=80',
    category: 'bestseller',
    is_bestseller: true,
  },
  {
    name: 'Berry Chic',
    description:
      'A stylish composition of roses, seasonal greenery, and vibrant berries – a bold and elegant floral statement.',
    price: 40,
    image_url: 'https://images.unsplash.com/photo-1519225421980-715cb0215aed?w=530&q=80',
    category: 'bestseller',
    is_bestseller: true,
  },
  {
    name: 'Lavender Dream',
    description:
      'A rich bouquet with lavender, lisianthus, and roses – ideal for those who love deep hues and gentle fragrance.',
    price: 55,
    image_url: 'https://images.unsplash.com/photo-1468327768560-75b778cbb551?w=530&q=80',
    category: 'bestseller',
    is_bestseller: true,
  },
  {
    name: 'Peach Meadow',
    description:
      'A soft and radiant arrangement of peach and blush roses with lush greenery in a straw basket – light and natural.',
    price: 55,
    image_url: 'https://images.unsplash.com/photo-1525310072745-f49212b5ac6d?w=530&q=80',
    category: 'general',
    is_bestseller: false,
  },
  {
    name: 'Blush Romance',
    description:
      'A premium bouquet of deep pink and rosy roses, complemented by silver eucalyptus – sophisticated and intimate.',
    price: 34,
    image_url: 'https://images.unsplash.com/photo-1548094878-84ced0f19bb3?w=530&q=80',
    category: 'general',
    is_bestseller: false,
  },
  {
    name: 'Pastel Garden',
    description:
      'A pastel-toned mix of spring roses and greenery in a woven basket – gentle, airy, and perfect for any occasion.',
    price: 40,
    image_url: 'https://images.unsplash.com/photo-1473172707857-f9e276582ab6?w=530&q=80',
    category: 'general',
    is_bestseller: false,
  },
  {
    name: 'Tulip Charm',
    description:
      'A vivid bouquet of bright tulips and roses in a lavender box – cheerful and full of charm.',
    price: 61,
    image_url: 'https://images.unsplash.com/photo-1471879832106-c7ab9e0cee23?w=530&q=80',
    category: 'general',
    is_bestseller: false,
  },
  {
    name: 'Berry Bloom',
    description:
      'A lush mix of rich pink, purple, and cream blooms with textured green accents – romantic and elegant.',
    price: 32,
    image_url: 'https://images.unsplash.com/photo-1561181286-d3fee7d55364?w=530&q=80',
    category: 'general',
    is_bestseller: false,
  },
  {
    name: 'Sweet Whisper',
    description:
      'A charming spring bouquet with peonies, roses, and lilac forest accents – fresh, lively, and expressive.',
    price: 40,
    image_url: 'https://images.unsplash.com/photo-1534954553104-88cb75be7648?w=530&q=80',
    category: 'general',
    is_bestseller: false,
  },
  {
    name: 'Field Joy',
    description:
      'A rustic hand-tied bouquet of sunflowers, lisianthus, and daisies – perfect for brightening the day.',
    price: 49,
    image_url: 'https://images.unsplash.com/photo-1463936575829-25148e1db1b8?w=530&q=80',
    category: 'general',
    is_bestseller: false,
  },
  {
    name: 'Soft Bloom',
    description:
      'A delicate bouquet of pink carnations and roses wrapped in satin paper – soft, stylish, and versatile.',
    price: 37,
    image_url: 'images/soft-bloom.png',
    category: 'general',
    is_bestseller: false,
  },
  /* Extra rows for pagination demos (15 per page) */
  {
    name: 'Sunset Glow',
    description:
      'Warm orange roses and golden accents — a radiant bouquet for cheerful celebrations.',
    price: 42,
    image_url: 'images/peach-meadow.png',
    category: 'general',
    is_bestseller: false,
  },
  {
    name: 'Morning Dew',
    description:
      'Soft whites and pale greens evoking early spring — fresh and calming.',
    price: 38,
    image_url: 'images/pastel-garden.png',
    category: 'general',
    is_bestseller: false,
  },
  {
    name: 'Ruby Garden',
    description:
      'Deep reds and burgundy tones for a dramatic, romantic statement.',
    price: 58,
    image_url: 'images/blush-romance.png',
    category: 'general',
    is_bestseller: false,
  },
  {
    name: 'Citrus Splash',
    description:
      'Bright yellows and citrus hues paired with lush greens — instant sunshine.',
    price: 44,
    image_url: 'images/field-joy.png',
    category: 'general',
    is_bestseller: false,
  },
  {
    name: 'Ocean Mist',
    description:
      'Cool blues, whites, and silver foliage — serene and sophisticated.',
    price: 52,
    image_url: 'images/tulip-charm.png',
    category: 'general',
    is_bestseller: false,
  },
  {
    name: 'Golden Hour',
    description:
      'Amber blooms and wheat tones inspired by late-afternoon light.',
    price: 46,
    image_url: 'images/sweet-whisper.png',
    category: 'general',
    is_bestseller: false,
  },
  {
    name: 'Forest Walk',
    description:
      'Textured greens, ferns, and woodland blooms — natural and grounded.',
    price: 41,
    image_url: 'images/berry-bloom.png',
    category: 'general',
    is_bestseller: false,
  },
  {
    name: 'Ivory Lace',
    description:
      'All-white composition with delicate texture — timeless wedding-ready style.',
    price: 62,
    image_url: 'images/blush-romance.png',
    category: 'general',
    is_bestseller: false,
  },
  {
    name: 'Wild Meadow Mix',
    description:
      'Loose, garden-picked look with seasonal wildflowers and herbs.',
    price: 36,
    image_url: 'images/peach-meadow.png',
    category: 'general',
    is_bestseller: false,
  },
];

async function init() {
  let client;
  try {
    client = await pool.connect();
    console.log('🌸 Initializing database...');

    // Create tables
    await client.query(SQL_CREATE);
    console.log('✅ Tables created');

    // Check if already seeded
    const { rows } = await client.query('SELECT COUNT(*) FROM bouquets');
    if (parseInt(rows[0].count) > 0) {
      console.log('ℹ️  Bouquets already seeded. Skipping.');
      return;
    }

    // Seed bouquets
    for (const b of BOUQUETS_SEED) {
      await client.query(
        `INSERT INTO bouquets (name, description, price, image_url, category, is_bestseller)
         VALUES ($1, $2, $3, $4, $5, $6)`,
        [b.name, b.description, b.price, b.image_url, b.category, b.is_bestseller]
      );
    }
    console.log(`✅ Seeded ${BOUQUETS_SEED.length} bouquets`);
  } catch (err) {
    if (err.code === '28P01') {
      console.error('\n❌ Невірний пароль PostgreSQL (код 28P01).');
      console.error('   Відкрий backend\\.env і встанови DB_PASSWORD так само,');
      console.error('   як пароль користувача postgres у твоїй установці.');
      console.error('   Перевірити/змінити: pgAdmin → Login/Group Roles → postgres → Definition.\n');
    } else {
      console.error('❌ Init error:', err.message);
    }
    process.exitCode = 1;
  } finally {
    if (client) client.release();
    await pool.end();
  }
}

init();
