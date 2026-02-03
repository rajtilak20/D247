import prisma from './prisma';
import bcrypt from 'bcrypt';

async function main() {
  console.log('🌱 Starting database seed...');

  // Create admin user
  console.log('Creating admin user...');
  const adminPassword = await bcrypt.hash('admin123', 10);
  
  const admin = await prisma.admin.upsert({
    where: { email: 'admin@deals247.com' },
    update: {},
    create: {
      name: 'Admin User',
      email: 'admin@deals247.com',
      passwordHash: adminPassword,
      role: 'ADMIN',
      status: 'ACTIVE',
    },
  });
  console.log('✅ Admin user created:', admin.email);

  // Create stores
  console.log('Creating stores...');
  const stores = await Promise.all([
    prisma.store.upsert({
      where: { slug: 'amazon' },
      update: {},
      create: {
        name: 'Amazon',
        slug: 'amazon',
        websiteUrl: 'https://amazon.in',
        logoUrl: 'https://logo.clearbit.com/amazon.in',
        affiliateProgramName: 'Amazon Associates',
        status: 'ACTIVE',
      },
    }),
    prisma.store.upsert({
      where: { slug: 'flipkart' },
      update: {},
      create: {
        name: 'Flipkart',
        slug: 'flipkart',
        websiteUrl: 'https://flipkart.com',
        logoUrl: 'https://logo.clearbit.com/flipkart.com',
        affiliateProgramName: 'Flipkart Affiliate',
        status: 'ACTIVE',
      },
    }),
    prisma.store.upsert({
      where: { slug: 'myntra' },
      update: {},
      create: {
        name: 'Myntra',
        slug: 'myntra',
        websiteUrl: 'https://myntra.com',
        logoUrl: 'https://logo.clearbit.com/myntra.com',
        status: 'ACTIVE',
      },
    }),
    prisma.store.upsert({
      where: { slug: 'ajio' },
      update: {},
      create: {
        name: 'Ajio',
        slug: 'ajio',
        websiteUrl: 'https://ajio.com',
        logoUrl: 'https://logo.clearbit.com/ajio.com',
        status: 'ACTIVE',
      },
    }),
    prisma.store.upsert({
      where: { slug: 'croma' },
      update: {},
      create: {
        name: 'Croma',
        slug: 'croma',
        websiteUrl: 'https://croma.com',
        logoUrl: 'https://logo.clearbit.com/croma.com',
        status: 'ACTIVE',
      },
    }),
  ]);
  console.log('✅ Created', stores.length, 'stores');

  // Create categories
  console.log('Creating categories...');
  const categories = await Promise.all([
    prisma.category.upsert({
      where: { slug: 'electronics' },
      update: {},
      create: {
        name: 'Electronics',
        slug: 'electronics',
        sortOrder: 1,
      },
    }),
    prisma.category.upsert({
      where: { slug: 'fashion' },
      update: {},
      create: {
        name: 'Fashion',
        slug: 'fashion',
        sortOrder: 2,
      },
    }),
    prisma.category.upsert({
      where: { slug: 'home-kitchen' },
      update: {},
      create: {
        name: 'Home & Kitchen',
        slug: 'home-kitchen',
        sortOrder: 3,
      },
    }),
    prisma.category.upsert({
      where: { slug: 'beauty' },
      update: {},
      create: {
        name: 'Beauty & Personal Care',
        slug: 'beauty',
        sortOrder: 4,
      },
    }),
    prisma.category.upsert({
      where: { slug: 'sports' },
      update: {},
      create: {
        name: 'Sports & Fitness',
        slug: 'sports',
        sortOrder: 5,
      },
    }),
  ]);
  console.log('✅ Created', categories.length, 'categories');

  // Create subcategories
  const electronicsId = categories.find(c => c.slug === 'electronics')?.id;
  const fashionId = categories.find(c => c.slug === 'fashion')?.id;

  const subcategories = await Promise.all([
    prisma.category.upsert({
      where: { slug: 'smartphones' },
      update: {},
      create: {
        name: 'Smartphones',
        slug: 'smartphones',
        parentId: electronicsId,
        sortOrder: 1,
      },
    }),
    prisma.category.upsert({
      where: { slug: 'laptops' },
      update: {},
      create: {
        name: 'Laptops',
        slug: 'laptops',
        parentId: electronicsId,
        sortOrder: 2,
      },
    }),
    prisma.category.upsert({
      where: { slug: 'mens-clothing' },
      update: {},
      create: {
        name: "Men's Clothing",
        slug: 'mens-clothing',
        parentId: fashionId,
        sortOrder: 1,
      },
    }),
    prisma.category.upsert({
      where: { slug: 'womens-clothing' },
      update: {},
      create: {
        name: "Women's Clothing",
        slug: 'womens-clothing',
        parentId: fashionId,
        sortOrder: 2,
      },
    }),
  ]);
  console.log('✅ Created', subcategories.length, 'subcategories');

  // Create tags
  console.log('Creating tags...');
  const tags = await Promise.all([
    prisma.tag.upsert({
      where: { slug: 'hot-deal' },
      update: {},
      create: {
        name: 'Hot Deal',
        slug: 'hot-deal',
      },
    }),
    prisma.tag.upsert({
      where: { slug: 'limited-time' },
      update: {},
      create: {
        name: 'Limited Time',
        slug: 'limited-time',
      },
    }),
    prisma.tag.upsert({
      where: { slug: 'best-seller' },
      update: {},
      create: {
        name: 'Best Seller',
        slug: 'best-seller',
      },
    }),
    prisma.tag.upsert({
      where: { slug: 'flash-sale' },
      update: {},
      create: {
        name: 'Flash Sale',
        slug: 'flash-sale',
      },
    }),
  ]);
  console.log('✅ Created', tags.length, 'tags');

  // Create deals
  console.log('Creating deals...');
  const amazonStore = stores.find(s => s.slug === 'amazon')!;
  const flipkartStore = stores.find(s => s.slug === 'flipkart')!;
  const myntraStore = stores.find(s => s.slug === 'myntra')!;

  const smartphonesCategory = subcategories.find(c => c.slug === 'smartphones')!;
  const laptopsCategory = subcategories.find(c => c.slug === 'laptops')!;
  const mensClothingCategory = subcategories.find(c => c.slug === 'mens-clothing')!;

  const hotDealTag = tags.find(t => t.slug === 'hot-deal')!;
  const limitedTimeTag = tags.find(t => t.slug === 'limited-time')!;

  const deals = [
    {
      title: 'iPhone 15 Pro Max - 256GB (Natural Titanium)',
      slug: 'iphone-15-pro-max-256gb-natural-titanium',
      storeId: amazonStore.id,
      shortDescription: 'Latest iPhone 15 Pro Max with A17 Pro chip, titanium design, and advanced camera system',
      longDescription: '<p>Experience the most powerful iPhone ever with the iPhone 15 Pro Max. Featuring the revolutionary A17 Pro chip, aerospace-grade titanium design, and the most advanced camera system in iPhone.</p>',
      productImageUrl: 'https://images.unsplash.com/photo-1695048133142-1a20484d2569?w=500',
      affiliateUrl: 'https://amazon.in/iphone-15-pro-max',
      originalPrice: 159900,
      dealPrice: 144990,
      currency: 'INR',
      discountPercent: 9.33,
      status: 'PUBLISHED',
      isFeatured: true,
      createdBy: admin.id,
      categoryIds: [smartphonesCategory.id],
      tagIds: [hotDealTag.id],
    },
    {
      title: 'Samsung Galaxy S24 Ultra 5G - 512GB (Titanium Black)',
      slug: 'samsung-galaxy-s24-ultra-512gb',
      storeId: flipkartStore.id,
      shortDescription: 'Samsung Galaxy S24 Ultra with AI-powered camera, S Pen, and stunning 6.8" display',
      longDescription: '<p>The Samsung Galaxy S24 Ultra redefines smartphone photography with AI-powered enhancements, powerful S Pen integration, and a gorgeous 6.8-inch Dynamic AMOLED display.</p>',
      productImageUrl: 'https://images.unsplash.com/photo-1610945415295-d9bbf067e59c?w=500',
      affiliateUrl: 'https://flipkart.com/samsung-s24-ultra',
      couponCode: 'SAMSUNG500',
      originalPrice: 129999,
      dealPrice: 119999,
      currency: 'INR',
      discountPercent: 7.69,
      status: 'PUBLISHED',
      isFeatured: true,
      createdBy: admin.id,
      categoryIds: [smartphonesCategory.id],
      tagIds: [hotDealTag.id, limitedTimeTag.id],
    },
    {
      title: 'MacBook Air M3 - 13" (8GB RAM, 256GB SSD)',
      slug: 'macbook-air-m3-13-inch-256gb',
      storeId: amazonStore.id,
      shortDescription: 'Ultra-thin MacBook Air powered by M3 chip with exceptional battery life',
      longDescription: '<p>The new MacBook Air with M3 chip delivers incredible performance in a remarkably thin and light design. Perfect for students and professionals.</p>',
      productImageUrl: 'https://images.unsplash.com/photo-1517336714731-489689fd1ca8?w=500',
      affiliateUrl: 'https://amazon.in/macbook-air-m3',
      originalPrice: 114900,
      dealPrice: 104900,
      currency: 'INR',
      discountPercent: 8.70,
      status: 'PUBLISHED',
      isFeatured: true,
      createdBy: admin.id,
      categoryIds: [laptopsCategory.id],
      tagIds: [hotDealTag.id],
    },
    {
      title: 'HP Pavilion Gaming Laptop - AMD Ryzen 5, RTX 3050',
      slug: 'hp-pavilion-gaming-laptop-ryzen5-rtx3050',
      storeId: flipkartStore.id,
      shortDescription: 'Powerful gaming laptop with AMD Ryzen 5, NVIDIA RTX 3050, 16GB RAM, 512GB SSD',
      longDescription: '<p>Dominate your games with the HP Pavilion Gaming laptop featuring AMD Ryzen 5 processor and NVIDIA RTX 3050 graphics.</p>',
      productImageUrl: 'https://images.unsplash.com/photo-1603302576837-37561b2e2302?w=500',
      affiliateUrl: 'https://flipkart.com/hp-pavilion-gaming',
      couponCode: 'GAMING2000',
      originalPrice: 74990,
      dealPrice: 64990,
      currency: 'INR',
      discountPercent: 13.34,
      status: 'PUBLISHED',
      isFeatured: false,
      createdBy: admin.id,
      categoryIds: [laptopsCategory.id],
      tagIds: [limitedTimeTag.id],
    },
    {
      title: "Men's Cotton Casual Shirt - Blue Checks",
      slug: 'mens-cotton-casual-shirt-blue-checks',
      storeId: myntraStore.id,
      shortDescription: '100% Cotton casual shirt with comfortable fit and stylish blue checks pattern',
      longDescription: '<p>Premium quality 100% cotton casual shirt perfect for daily wear. Features a modern fit and trendy blue checks design.</p>',
      productImageUrl: 'https://images.unsplash.com/photo-1602810318383-e386cc2a3ccf?w=500',
      affiliateUrl: 'https://myntra.com/mens-shirt-blue-checks',
      originalPrice: 1999,
      dealPrice: 799,
      currency: 'INR',
      discountPercent: 60.03,
      status: 'PUBLISHED',
      isFeatured: false,
      createdBy: admin.id,
      categoryIds: [mensClothingCategory.id],
      tagIds: [hotDealTag.id],
    },
  ];

  for (const dealData of deals) {
    const { categoryIds, tagIds, ...dealInfo } = dealData;

    const deal = await prisma.deal.upsert({
      where: { slug: dealInfo.slug },
      update: {},
      create: dealInfo,
    });

    // Add categories
    for (const categoryId of categoryIds) {
      await prisma.dealCategory.upsert({
        where: {
          dealId_categoryId: {
            dealId: deal.id,
            categoryId,
          },
        },
        update: {},
        create: {
          dealId: deal.id,
          categoryId,
        },
      });
    }

    // Add tags
    for (const tagId of tagIds) {
      await prisma.dealTag.upsert({
        where: {
          dealId_tagId: {
            dealId: deal.id,
            tagId,
          },
        },
        update: {},
        create: {
          dealId: deal.id,
          tagId,
        },
      });
    }

    console.log('✅ Created deal:', deal.title);
  }

  console.log('✅ Created', deals.length, 'deals');

  // Create static pages
  console.log('Creating static pages...');
  await prisma.page.upsert({
    where: { slug: 'about-us' },
    update: {},
    create: {
      slug: 'about-us',
      title: 'About Us',
      contentHtml: '<p>Welcome to Deals247! We are your trusted source for the best deals online.</p>',
      status: 'PUBLISHED',
    },
  });
  console.log('✅ Created static pages');

  console.log('🎉 Database seed completed successfully!');
}

main()
  .catch((e) => {
    console.error('❌ Error seeding database:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
