
DROP TABLE IF EXISTS `_prisma_migrations`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `_prisma_migrations` (
  `id` varchar(36) COLLATE utf8mb4_unicode_ci NOT NULL,
  `checksum` varchar(64) COLLATE utf8mb4_unicode_ci NOT NULL,
  `finished_at` datetime(3) DEFAULT NULL,
  `migration_name` varchar(255) COLLATE utf8mb4_unicode_ci NOT NULL,
  `logs` text COLLATE utf8mb4_unicode_ci,
  `rolled_back_at` datetime(3) DEFAULT NULL,
  `started_at` datetime(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
  `applied_steps_count` int unsigned NOT NULL DEFAULT '0',
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `_prisma_migrations`
--

LOCK TABLES `_prisma_migrations` WRITE;
/*!40000 ALTER TABLE `_prisma_migrations` DISABLE KEYS */;
INSERT INTO `_prisma_migrations` VALUES ('1e4584a5-3398-4bad-8faa-8b98323c4658','b6d77e7275640862de8ff081ceba5c5d42cef4999743c93d28e3e04803611a19','2026-07-30 09:14:18.834','20260701204413_remove_sku_unique_constraint',NULL,NULL,'2026-07-30 09:14:17.110',1),('46f3caf8-ef04-4a90-b474-b0b655ddf1dc','e4f180b1e13eec804f6945ed0b8b27b20403d119b59745def275381b01642b42','2026-07-30 09:14:14.620','20260528174552_add_admin_seed_support',NULL,NULL,'2026-07-30 09:06:50.568',1),('b01e5428-c8c5-4cf9-9bac-ced4cc451962','920d023471fdbce2a2361969253d5ad8bc3e9f17c1062ef784a765aff3c9faf8','2026-07-30 09:14:16.665','20260630090352_refresh_token_length_fix',NULL,NULL,'2026-07-30 09:14:14.930',1);
/*!40000 ALTER TABLE `_prisma_migrations` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `addresses`
--

DROP TABLE IF EXISTS `addresses`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `addresses` (
  `id` varchar(191) COLLATE utf8mb4_unicode_ci NOT NULL,
  `userId` varchar(191) COLLATE utf8mb4_unicode_ci NOT NULL,
  `label` varchar(191) COLLATE utf8mb4_unicode_ci NOT NULL DEFAULT 'Home',
  `fullName` varchar(191) COLLATE utf8mb4_unicode_ci NOT NULL,
  `phone` varchar(191) COLLATE utf8mb4_unicode_ci NOT NULL,
  `addressLine1` varchar(191) COLLATE utf8mb4_unicode_ci NOT NULL,
  `addressLine2` varchar(191) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `city` varchar(191) COLLATE utf8mb4_unicode_ci NOT NULL,
  `state` varchar(191) COLLATE utf8mb4_unicode_ci NOT NULL,
  `country` varchar(191) COLLATE utf8mb4_unicode_ci NOT NULL DEFAULT 'Nigeria',
  `isDefault` tinyint(1) NOT NULL DEFAULT '0',
  `createdAt` datetime(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
  `updatedAt` datetime(3) NOT NULL,
  PRIMARY KEY (`id`),
  KEY `addresses_userId_fkey` (`userId`),
  CONSTRAINT `addresses_userId_fkey` FOREIGN KEY (`userId`) REFERENCES `users` (`id`) ON DELETE CASCADE ON UPDATE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `addresses`
--

LOCK TABLES `addresses` WRITE;
/*!40000 ALTER TABLE `addresses` DISABLE KEYS */;
/*!40000 ALTER TABLE `addresses` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `banners`
--

DROP TABLE IF EXISTS `banners`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `banners` (
  `id` varchar(191) COLLATE utf8mb4_unicode_ci NOT NULL,
  `title` varchar(191) COLLATE utf8mb4_unicode_ci NOT NULL,
  `subtitle` varchar(191) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `description` text COLLATE utf8mb4_unicode_ci,
  `image` varchar(191) COLLATE utf8mb4_unicode_ci NOT NULL,
  `mobileImage` varchar(191) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `badgeText` varchar(191) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `ctaLabel` varchar(191) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `ctaUrl` varchar(191) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `position` enum('HERO','PROMO_LEFT','PROMO_RIGHT','CATEGORY_TOP','SIDEBAR') COLLATE utf8mb4_unicode_ci NOT NULL,
  `sortOrder` int NOT NULL DEFAULT '0',
  `isActive` tinyint(1) NOT NULL DEFAULT '1',
  `startsAt` datetime(3) DEFAULT NULL,
  `endsAt` datetime(3) DEFAULT NULL,
  `createdAt` datetime(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
  `updatedAt` datetime(3) NOT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `banners`
--

LOCK TABLES `banners` WRITE;
/*!40000 ALTER TABLE `banners` DISABLE KEYS */;
/*!40000 ALTER TABLE `banners` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `brands`
--

DROP TABLE IF EXISTS `brands`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `brands` (
  `id` varchar(191) COLLATE utf8mb4_unicode_ci NOT NULL,
  `name` varchar(191) COLLATE utf8mb4_unicode_ci NOT NULL,
  `slug` varchar(191) COLLATE utf8mb4_unicode_ci NOT NULL,
  `logo` varchar(191) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `description` text COLLATE utf8mb4_unicode_ci,
  `website` varchar(191) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `isActive` tinyint(1) NOT NULL DEFAULT '1',
  `sortOrder` int NOT NULL DEFAULT '0',
  `createdAt` datetime(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
  `updatedAt` datetime(3) NOT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `brands_slug_key` (`slug`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `brands`
--

LOCK TABLES `brands` WRITE;
/*!40000 ALTER TABLE `brands` DISABLE KEYS */;
INSERT INTO `brands` VALUES ('1d5076cc-f2ef-490c-94ae-b7b6421a78b0','Ese Luxury','ese-luxury',NULL,'Premium luxury cosmetics brand',NULL,1,0,'2026-07-30 09:55:48.293','2026-07-30 09:55:48.293');
/*!40000 ALTER TABLE `brands` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `cart_items`
--

DROP TABLE IF EXISTS `cart_items`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `cart_items` (
  `id` varchar(191) COLLATE utf8mb4_unicode_ci NOT NULL,
  `userId` varchar(191) COLLATE utf8mb4_unicode_ci NOT NULL,
  `productId` varchar(191) COLLATE utf8mb4_unicode_ci NOT NULL,
  `variantId` varchar(191) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `quantity` int NOT NULL DEFAULT '1',
  `createdAt` datetime(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
  `updatedAt` datetime(3) NOT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `cart_items_userId_productId_variantId_key` (`userId`,`productId`,`variantId`),
  KEY `cart_items_productId_fkey` (`productId`),
  KEY `cart_items_variantId_fkey` (`variantId`),
  CONSTRAINT `cart_items_productId_fkey` FOREIGN KEY (`productId`) REFERENCES `products` (`id`) ON DELETE RESTRICT ON UPDATE CASCADE,
  CONSTRAINT `cart_items_userId_fkey` FOREIGN KEY (`userId`) REFERENCES `users` (`id`) ON DELETE CASCADE ON UPDATE CASCADE,
  CONSTRAINT `cart_items_variantId_fkey` FOREIGN KEY (`variantId`) REFERENCES `product_variants` (`id`) ON DELETE SET NULL ON UPDATE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `cart_items`
--

LOCK TABLES `cart_items` WRITE;
/*!40000 ALTER TABLE `cart_items` DISABLE KEYS */;
/*!40000 ALTER TABLE `cart_items` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `categories`
--

DROP TABLE IF EXISTS `categories`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `categories` (
  `id` varchar(191) COLLATE utf8mb4_unicode_ci NOT NULL,
  `name` varchar(191) COLLATE utf8mb4_unicode_ci NOT NULL,
  `slug` varchar(191) COLLATE utf8mb4_unicode_ci NOT NULL,
  `description` text COLLATE utf8mb4_unicode_ci,
  `image` varchar(191) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `parentId` varchar(191) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `sortOrder` int NOT NULL DEFAULT '0',
  `isActive` tinyint(1) NOT NULL DEFAULT '1',
  `metaTitle` varchar(191) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `metaDesc` varchar(191) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `createdAt` datetime(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
  `updatedAt` datetime(3) NOT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `categories_slug_key` (`slug`),
  KEY `categories_parentId_fkey` (`parentId`),
  CONSTRAINT `categories_parentId_fkey` FOREIGN KEY (`parentId`) REFERENCES `categories` (`id`) ON DELETE SET NULL ON UPDATE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `categories`
--

LOCK TABLES `categories` WRITE;
/*!40000 ALTER TABLE `categories` DISABLE KEYS */;
INSERT INTO `categories` VALUES ('086f2586-4d0e-4d56-8465-da6e55a94f9c','🧼 Skincare Soap','skincare-soap','',NULL,NULL,0,1,NULL,NULL,'2026-07-30 09:55:40.085','2026-07-30 09:55:40.085'),('1111137a-3f93-4d3d-ac83-bb41ec8015fb','Body wash','body-wash','',NULL,NULL,0,1,NULL,NULL,'2026-07-30 09:55:40.619','2026-07-30 09:55:40.619'),('22ea5e3f-8b49-404c-a87f-8f4ecf7275db','🌿 Toner','toner','A gentle, refreshing embrace for your skin after every cleanse. Our toners do more than just remove residue  they restore your skin\'s natural pH balance, prep your complexion for better absorption, and deliver a surge of hydration. Whether soothing with Centella, exfoliating with AHA/BHA, or brightening with Rice, each toner is a revitalizing ritual that awakens your skin\'s natural glow.',NULL,NULL,0,1,NULL,NULL,'2026-07-30 09:55:41.044','2026-07-30 09:55:41.044'),('2db14e74-1537-46f7-9ce0-9ef941cb23d0','💧 Serum','serum','Consider this your skin\'s most powerful ally. Our serums are lightweight elixirs packed with high performance active ingredients that dive deep into your skin\'s layers to address your most pressing concerns from dullness and hyperpigmentation to fine lines and dehydration. A few drops of pure potency, designed to transform your complexion with every application. Your skin will thank you.',NULL,NULL,0,1,NULL,NULL,'2026-07-30 09:55:42.161','2026-07-30 09:55:42.161'),('30626755-2744-4244-989a-3b545eea922b','🧴 Moisturizer / Cream','moisturizer-cream','Seal in all the goodness with our moisturizers rich, velvety creams and lightweight lotions that lock in hydration while nourishing your skin barrier. Formulated with skin loving ingredients like Snail Mucin, Ceramides, and Hyaluronic Acid, these decadent creams leave your skin feeling supple, smooth, and visibly rejuvenated. The crowning step of your skincare symphony.',NULL,NULL,0,1,NULL,NULL,'2026-07-30 09:55:42.655','2026-07-30 09:55:42.655'),('4e5c1f50-c6b4-4738-82f0-58b206e285d0','Face and body oil','face-and-body-oil','',NULL,NULL,0,1,NULL,NULL,'2026-07-30 09:55:43.121','2026-07-30 09:55:43.121'),('6772f431-077b-43a8-b102-e67d6dc589c2','✦ Ampoule','ampoule','When your skin needs that extra boost, turn to our ampoules the ultimate concentrated treatments in the Ese Luxury Cosmetics. Formulated with potent, high dose active ingredients, these powerful drops target specific skin concerns with surgical precision. Think of them as a skincare fast track: a quick, intensive remedy that delivers visible results when you need them most.',NULL,NULL,0,1,NULL,NULL,'2026-07-30 09:55:43.752','2026-07-30 09:55:43.752'),('77566a51-bcd0-4b5c-a2df-01aaaf03938c','💊 Dietary Supplement','dietary-supplement','A fusion of nature and science, our dietary supplements are crafted to support your wellness journey from the inside out. Infused with potent botanicals, essential vitamins, and targeted nutrients, these delicious gummies and capsules work harmoniously with your body to boost immunity, enhance energy, and promote radiant skin. Because true beauty is more than skin deep it\'s a feeling, a glow, a lifestyle.',NULL,NULL,0,1,NULL,NULL,'2026-07-30 09:55:44.313','2026-07-30 09:55:44.313'),('7f925fd9-ba9b-4af6-92ac-131c928b7773','☀️Facial Cleanser / Face Wash','facial-cleanser-face-wash','',NULL,NULL,0,1,NULL,NULL,'2026-07-30 09:55:44.759','2026-07-30 09:55:44.759'),('98836f15-1be2-43f5-a63a-021bb5970b38','🌟Beauty and health','beauty-and-health','Our Beauty & Health collection brings together the best of internal wellness and external care, so you can feel as good as you look. From digestion supporting supplements and daily vitamins to nourishing skincare and clean beauty essentials, every product is curated to help you build a balanced, sustainable self care routine. ',NULL,NULL,0,1,NULL,NULL,'2026-07-30 09:55:45.310','2026-07-30 09:55:45.310'),('af971518-6c23-410b-a881-7cbe5d02daef','🧴 Sunscreen','sunscreen','',NULL,NULL,0,1,NULL,NULL,'2026-07-30 09:55:45.934','2026-07-30 09:55:45.934'),('b2180067-ab17-4ed0-a2b1-e59a8383c466','Facial Gel','facial-gel','',NULL,NULL,0,1,NULL,NULL,'2026-07-30 09:55:46.854','2026-07-30 09:55:46.854'),('bc983437-4e46-4718-ab40-30bc67c218dd','🌸 Essence','essence','A luxurious step that bridges hydration and transformation. Our essences are lightweight, nutrient-rich potions that soften, condition, and deeply hydrate your skin while enhancing the effectiveness of every product that follows. Infused with fermented extracts and botanical actives, this ritual is the secret to that coveted glass skin glow dewy, plump, and impossibly radiant.\n\n',NULL,NULL,0,1,NULL,NULL,'2026-07-30 09:55:47.309','2026-07-30 09:55:47.309'),('fbe24419-da5d-4055-9574-bc4b6999a1e3','🛁 Body Lotion / Milk','body-lotion-milk','Your skin deserves the same care from head to toe. Our body lotions and milks are sumptuous, fast-absorbing emulsions that drench your skin in lasting hydration while delivering targeted benefits like brightening, firming, and softening. Silky, sensorial, and irresistibly nourishing because your glow shouldn\'t stop at your neck',NULL,NULL,0,1,NULL,NULL,'2026-07-30 09:55:47.855','2026-07-30 09:55:47.855');
/*!40000 ALTER TABLE `categories` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `coupons`
--

DROP TABLE IF EXISTS `coupons`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `coupons` (
  `id` varchar(191) COLLATE utf8mb4_unicode_ci NOT NULL,
  `code` varchar(191) COLLATE utf8mb4_unicode_ci NOT NULL,
  `type` enum('PERCENTAGE','FIXED_AMOUNT','FREE_SHIPPING') COLLATE utf8mb4_unicode_ci NOT NULL,
  `value` decimal(12,2) NOT NULL,
  `minOrderAmount` decimal(12,2) DEFAULT NULL,
  `maxUses` int DEFAULT NULL,
  `usedCount` int NOT NULL DEFAULT '0',
  `perUserLimit` int NOT NULL DEFAULT '1',
  `startsAt` datetime(3) DEFAULT NULL,
  `expiresAt` datetime(3) DEFAULT NULL,
  `isActive` tinyint(1) NOT NULL DEFAULT '1',
  `createdAt` datetime(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
  `updatedAt` datetime(3) NOT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `coupons_code_key` (`code`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `coupons`
--

LOCK TABLES `coupons` WRITE;
/*!40000 ALTER TABLE `coupons` DISABLE KEYS */;
/*!40000 ALTER TABLE `coupons` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `loyalty_logs`
--

DROP TABLE IF EXISTS `loyalty_logs`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `loyalty_logs` (
  `id` varchar(191) COLLATE utf8mb4_unicode_ci NOT NULL,
  `userId` varchar(191) COLLATE utf8mb4_unicode_ci NOT NULL,
  `points` int NOT NULL,
  `type` varchar(191) COLLATE utf8mb4_unicode_ci NOT NULL,
  `description` varchar(191) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `orderId` varchar(191) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `createdAt` datetime(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
  PRIMARY KEY (`id`),
  KEY `loyalty_logs_userId_fkey` (`userId`),
  CONSTRAINT `loyalty_logs_userId_fkey` FOREIGN KEY (`userId`) REFERENCES `users` (`id`) ON DELETE CASCADE ON UPDATE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `loyalty_logs`
--

LOCK TABLES `loyalty_logs` WRITE;
/*!40000 ALTER TABLE `loyalty_logs` DISABLE KEYS */;
/*!40000 ALTER TABLE `loyalty_logs` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `newsletter_subscribers`
--

DROP TABLE IF EXISTS `newsletter_subscribers`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `newsletter_subscribers` (
  `id` varchar(191) COLLATE utf8mb4_unicode_ci NOT NULL,
  `email` varchar(191) COLLATE utf8mb4_unicode_ci NOT NULL,
  `isActive` tinyint(1) NOT NULL DEFAULT '1',
  `createdAt` datetime(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
  PRIMARY KEY (`id`),
  UNIQUE KEY `newsletter_subscribers_email_key` (`email`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `newsletter_subscribers`
--

LOCK TABLES `newsletter_subscribers` WRITE;
/*!40000 ALTER TABLE `newsletter_subscribers` DISABLE KEYS */;
/*!40000 ALTER TABLE `newsletter_subscribers` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `order_items`
--

DROP TABLE IF EXISTS `order_items`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `order_items` (
  `id` varchar(191) COLLATE utf8mb4_unicode_ci NOT NULL,
  `orderId` varchar(191) COLLATE utf8mb4_unicode_ci NOT NULL,
  `productId` varchar(191) COLLATE utf8mb4_unicode_ci NOT NULL,
  `variantId` varchar(191) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `name` varchar(191) COLLATE utf8mb4_unicode_ci NOT NULL,
  `image` varchar(191) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `price` decimal(12,2) NOT NULL,
  `quantity` int NOT NULL,
  `total` decimal(12,2) NOT NULL,
  `createdAt` datetime(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
  PRIMARY KEY (`id`),
  KEY `order_items_orderId_fkey` (`orderId`),
  KEY `order_items_productId_fkey` (`productId`),
  KEY `order_items_variantId_fkey` (`variantId`),
  CONSTRAINT `order_items_orderId_fkey` FOREIGN KEY (`orderId`) REFERENCES `orders` (`id`) ON DELETE CASCADE ON UPDATE CASCADE,
  CONSTRAINT `order_items_productId_fkey` FOREIGN KEY (`productId`) REFERENCES `products` (`id`) ON DELETE RESTRICT ON UPDATE CASCADE,
  CONSTRAINT `order_items_variantId_fkey` FOREIGN KEY (`variantId`) REFERENCES `product_variants` (`id`) ON DELETE SET NULL ON UPDATE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `order_items`
--

LOCK TABLES `order_items` WRITE;
/*!40000 ALTER TABLE `order_items` DISABLE KEYS */;
/*!40000 ALTER TABLE `order_items` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `order_status_history`
--

DROP TABLE IF EXISTS `order_status_history`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `order_status_history` (
  `id` varchar(191) COLLATE utf8mb4_unicode_ci NOT NULL,
  `orderId` varchar(191) COLLATE utf8mb4_unicode_ci NOT NULL,
  `status` enum('PENDING','CONFIRMED','PROCESSING','SHIPPED','DELIVERED','CANCELLED','REFUNDED') COLLATE utf8mb4_unicode_ci NOT NULL,
  `note` varchar(191) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `createdBy` varchar(191) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `createdAt` datetime(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
  PRIMARY KEY (`id`),
  KEY `order_status_history_orderId_fkey` (`orderId`),
  CONSTRAINT `order_status_history_orderId_fkey` FOREIGN KEY (`orderId`) REFERENCES `orders` (`id`) ON DELETE CASCADE ON UPDATE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `order_status_history`
--

LOCK TABLES `order_status_history` WRITE;
/*!40000 ALTER TABLE `order_status_history` DISABLE KEYS */;
/*!40000 ALTER TABLE `order_status_history` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `orders`
--

DROP TABLE IF EXISTS `orders`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `orders` (
  `id` varchar(191) COLLATE utf8mb4_unicode_ci NOT NULL,
  `orderNumber` varchar(191) COLLATE utf8mb4_unicode_ci NOT NULL,
  `userId` varchar(191) COLLATE utf8mb4_unicode_ci NOT NULL,
  `addressId` varchar(191) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `status` enum('PENDING','CONFIRMED','PROCESSING','SHIPPED','DELIVERED','CANCELLED','REFUNDED') COLLATE utf8mb4_unicode_ci NOT NULL DEFAULT 'PENDING',
  `paymentStatus` enum('PENDING','PAID','FAILED','REFUNDED','PARTIALLY_REFUNDED') COLLATE utf8mb4_unicode_ci NOT NULL DEFAULT 'PENDING',
  `paymentRef` varchar(191) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `paymentMethod` varchar(191) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `subtotal` decimal(12,2) NOT NULL,
  `shippingFee` decimal(12,2) NOT NULL DEFAULT '0.00',
  `discount` decimal(12,2) NOT NULL DEFAULT '0.00',
  `total` decimal(12,2) NOT NULL,
  `couponId` varchar(191) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `notes` text COLLATE utf8mb4_unicode_ci,
  `trackingNumber` varchar(191) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `shippingCarrier` varchar(191) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `cancelReason` varchar(191) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `deliveredAt` datetime(3) DEFAULT NULL,
  `createdAt` datetime(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
  `updatedAt` datetime(3) NOT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `orders_orderNumber_key` (`orderNumber`),
  KEY `orders_userId_idx` (`userId`),
  KEY `orders_orderNumber_idx` (`orderNumber`),
  KEY `orders_status_idx` (`status`),
  KEY `orders_addressId_fkey` (`addressId`),
  KEY `orders_couponId_fkey` (`couponId`),
  CONSTRAINT `orders_addressId_fkey` FOREIGN KEY (`addressId`) REFERENCES `addresses` (`id`) ON DELETE SET NULL ON UPDATE CASCADE,
  CONSTRAINT `orders_couponId_fkey` FOREIGN KEY (`couponId`) REFERENCES `coupons` (`id`) ON DELETE SET NULL ON UPDATE CASCADE,
  CONSTRAINT `orders_userId_fkey` FOREIGN KEY (`userId`) REFERENCES `users` (`id`) ON DELETE RESTRICT ON UPDATE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `orders`
--

LOCK TABLES `orders` WRITE;
/*!40000 ALTER TABLE `orders` DISABLE KEYS */;
/*!40000 ALTER TABLE `orders` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `otps`
--

DROP TABLE IF EXISTS `otps`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `otps` (
  `id` varchar(191) COLLATE utf8mb4_unicode_ci NOT NULL,
  `userId` varchar(191) COLLATE utf8mb4_unicode_ci NOT NULL,
  `phone` varchar(191) COLLATE utf8mb4_unicode_ci NOT NULL,
  `code` varchar(191) COLLATE utf8mb4_unicode_ci NOT NULL,
  `type` enum('REGISTRATION','LOGIN','PASSWORD_RESET','ORDER_NOTIFICATION') COLLATE utf8mb4_unicode_ci NOT NULL,
  `expiresAt` datetime(3) NOT NULL,
  `usedAt` datetime(3) DEFAULT NULL,
  `attempts` int NOT NULL DEFAULT '0',
  `createdAt` datetime(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
  PRIMARY KEY (`id`),
  KEY `otps_phone_type_idx` (`phone`,`type`),
  KEY `otps_userId_fkey` (`userId`),
  CONSTRAINT `otps_userId_fkey` FOREIGN KEY (`userId`) REFERENCES `users` (`id`) ON DELETE CASCADE ON UPDATE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `otps`
--

LOCK TABLES `otps` WRITE;
/*!40000 ALTER TABLE `otps` DISABLE KEYS */;
/*!40000 ALTER TABLE `otps` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `product_images`
--

DROP TABLE IF EXISTS `product_images`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `product_images` (
  `id` varchar(191) COLLATE utf8mb4_unicode_ci NOT NULL,
  `productId` varchar(191) COLLATE utf8mb4_unicode_ci NOT NULL,
  `url` varchar(191) COLLATE utf8mb4_unicode_ci NOT NULL,
  `altText` varchar(191) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `sortOrder` int NOT NULL DEFAULT '0',
  `isPrimary` tinyint(1) NOT NULL DEFAULT '0',
  `createdAt` datetime(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
  PRIMARY KEY (`id`),
  KEY `product_images_productId_fkey` (`productId`),
  CONSTRAINT `product_images_productId_fkey` FOREIGN KEY (`productId`) REFERENCES `products` (`id`) ON DELETE CASCADE ON UPDATE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `product_images`
--

LOCK TABLES `product_images` WRITE;
/*!40000 ALTER TABLE `product_images` DISABLE KEYS */;
INSERT INTO `product_images` VALUES ('01f5ae6a-7c81-470a-a364-b126d6d92c2e-0','01f5ae6a-7c81-470a-a364-b126d6d92c2e','/uploads/products/904aba3f-30e9-42a6-8ef4-e8fd4ce2722f-original.webp','COSRX AHA/BHA Clarifying Treatment Toner',0,1,'2026-07-30 09:55:49.582'),('07eb7482-ad65-407a-af3e-0a77fba7c56a-0','07eb7482-ad65-407a-af3e-0a77fba7c56a','/uploads/products/6c00895a-7ef4-4fa4-85e3-a75787cd1b3b-original.webp',' Biore UV Watery Essence',0,1,'2026-07-30 09:55:50.422'),('07eb7482-ad65-407a-af3e-0a77fba7c56a-1','07eb7482-ad65-407a-af3e-0a77fba7c56a','/uploads/products/2de76185-37af-47e6-a6b2-1194f15c02c7-original.webp',' Biore UV Watery Essence',1,0,'2026-07-30 09:55:50.921'),('08aa9941-ff65-49ed-b47c-a3d29cb249fa-0','08aa9941-ff65-49ed-b47c-a3d29cb249fa','/uploads/products/a668dd23-70ea-4d13-9f9e-5910dc11a911-original.webp',' Moisturizing Toner (Hyaluronic Acid + Vitamin C + Niacinamide)',0,1,'2026-07-30 09:55:51.667'),('0bb2a8b0-6ee3-442b-b279-ba8e7e4ddb31-0','0bb2a8b0-6ee3-442b-b279-ba8e7e4ddb31','/uploads/products/44f3ce91-45b0-42b4-8a33-8623e94d904a-original.webp',' VEEET Gold Facial Gel (Acne + Kojic Acid Whitening)',0,1,'2026-07-30 09:55:52.655'),('0bb2a8b0-6ee3-442b-b279-ba8e7e4ddb31-1','0bb2a8b0-6ee3-442b-b279-ba8e7e4ddb31','/uploads/products/7a1998d9-c73f-46fc-8c7b-425786844c03-original.webp',' VEEET Gold Facial Gel (Acne + Kojic Acid Whitening)',1,0,'2026-07-30 09:55:52.390'),('0d780502-8a9b-4893-8787-18036d0de885-0','0d780502-8a9b-4893-8787-18036d0de885','/uploads/products/bc919351-4c1d-42ec-9ede-8488389e3a3d-original.webp',' Face Facts Restore + Clarify Salicylic Acid Serum',0,1,'2026-07-30 09:55:53.832'),('0d780502-8a9b-4893-8787-18036d0de885-1','0d780502-8a9b-4893-8787-18036d0de885','/uploads/products/733d9ca9-71b4-4a4b-8f4e-f247f5575cd6-original.webp',' Face Facts Restore + Clarify Salicylic Acid Serum',1,0,'2026-07-30 09:55:53.561'),('119b7556-2fab-480f-91d7-4a087518a450-0','119b7556-2fab-480f-91d7-4a087518a450','/uploads/products/66e0a4fe-fef3-4874-911a-e5362a8d8380-original.webp',' Alpha Arbutin Collagen Peptide Drink (7D)',0,1,'2026-07-30 09:55:55.132'),('119b7556-2fab-480f-91d7-4a087518a450-1','119b7556-2fab-480f-91d7-4a087518a450','/uploads/products/a399abcb-1ebc-4df6-ba55-09050aceaac2-original.webp',' Alpha Arbutin Collagen Peptide Drink (7D)',1,0,'2026-07-30 09:55:54.732'),('1358f2a7-3195-4d41-8135-b5bf6ffd3aef-0','1358f2a7-3195-4d41-8135-b5bf6ffd3aef','/uploads/products/9e512fa7-1d00-4422-a65b-575657b33963-original.webp',' Aveeno Skin Relief Body Oil Spray',0,1,'2026-07-30 09:55:55.895'),('1358f2a7-3195-4d41-8135-b5bf6ffd3aef-1','1358f2a7-3195-4d41-8135-b5bf6ffd3aef','/uploads/products/2f85a722-9bcb-44a6-8d4c-f44e06dad2c7-original.webp',' Aveeno Skin Relief Body Oil Spray',1,0,'2026-07-30 09:55:56.342'),('1565f0ab-b1f4-492e-af65-0cce1d6bd969-0','1565f0ab-b1f4-492e-af65-0cce1d6bd969','/uploads/products/407dbce6-7075-4388-8627-e61baa16271b-original.webp',' AmLactin Daily Nourish 12% Lactic Acid Lotion',0,1,'2026-07-30 09:55:57.156'),('1565f0ab-b1f4-492e-af65-0cce1d6bd969-1','1565f0ab-b1f4-492e-af65-0cce1d6bd969','/uploads/products/ff368f45-c3ac-4c27-9795-f89b8e53fdc7-original.webp',' AmLactin Daily Nourish 12% Lactic Acid Lotion',1,0,'2026-07-30 09:55:57.622'),('1694ddf7-adeb-4bae-8bc1-78d9e9340669-0','1694ddf7-adeb-4bae-8bc1-78d9e9340669','/uploads/products/7a494906-4b69-4dea-88e8-6576317535f7-original.webp','Blemish Care Malaysian White Wash (Walnut Scrub)',0,1,'2026-07-30 09:55:58.376'),('1694ddf7-adeb-4bae-8bc1-78d9e9340669-1','1694ddf7-adeb-4bae-8bc1-78d9e9340669','/uploads/products/62a7b370-0189-4502-8773-6bf252cabaf2-original.webp','Blemish Care Malaysian White Wash (Walnut Scrub)',1,0,'2026-07-30 09:55:58.753'),('16e34433-a6a2-4627-8b62-0af0af92a1c9-0','16e34433-a6a2-4627-8b62-0af0af92a1c9','/uploads/products/cf0d68dd-7ab4-492e-b9d7-f5fe8d46e52f-original.webp',' Morrocan Argan Essential Oils Vitamin C Whitening & Glowing Oil',0,1,'2026-07-30 09:55:59.567'),('16e34433-a6a2-4627-8b62-0af0af92a1c9-1','16e34433-a6a2-4627-8b62-0af0af92a1c9','/uploads/products/ebd34ead-b157-4b2a-8dec-64650e6c16e4-original.webp',' Morrocan Argan Essential Oils Vitamin C Whitening & Glowing Oil',1,0,'2026-07-30 09:55:59.321'),('1c0bed7c-2f82-4035-9c9e-325b87e98ca1-0','1c0bed7c-2f82-4035-9c9e-325b87e98ca1','/uploads/products/ac5f46e2-67a5-426a-9f85-4c962d4919b0-original.webp',' Blemish Care Carrot Pure Malaysian Glow Body Lotion',0,1,'2026-07-30 09:56:00.178'),('1c0bed7c-2f82-4035-9c9e-325b87e98ca1-1','1c0bed7c-2f82-4035-9c9e-325b87e98ca1','/uploads/products/093fb391-d4b0-4d9d-b6fc-5b7e488fabef-original.webp',' Blemish Care Carrot Pure Malaysian Glow Body Lotion',1,0,'2026-07-30 09:56:01.277'),('1c0bed7c-2f82-4035-9c9e-325b87e98ca1-2','1c0bed7c-2f82-4035-9c9e-325b87e98ca1','/uploads/products/6a5717a8-7ddc-4d08-882d-f9366393d4b6-original.webp',' Blemish Care Carrot Pure Malaysian Glow Body Lotion',2,0,'2026-07-30 09:56:00.747'),('20f9b75e-e020-43d0-97f9-b1bcc34f49c8-0','20f9b75e-e020-43d0-97f9-b1bcc34f49c8','/uploads/products/bfe6c712-ac2f-442f-958b-d167e596815c-original.webp','Guanjing Rice Toner',0,1,'2026-07-30 09:56:01.856'),('248d96de-9d60-415a-8ca6-6f26ba7ea1f8-0','248d96de-9d60-415a-8ca6-6f26ba7ea1f8','/uploads/products/d4a450c2-eedc-41b5-9448-c5d6fe7a2545-original.webp','Skin By Zaron Vitamin C Body Wash',0,1,'2026-07-30 09:56:02.688'),('277f1a08-ac67-4fca-8bb1-dd940d7fd6a0-0','277f1a08-ac67-4fca-8bb1-dd940d7fd6a0','/uploads/products/1d203a46-5340-46e7-904d-a690e993ae6e-original.webp',' Retin-A Treatment Soap',0,1,'2026-07-30 09:56:03.845'),('277f1a08-ac67-4fca-8bb1-dd940d7fd6a0-1','277f1a08-ac67-4fca-8bb1-dd940d7fd6a0','/uploads/products/ee5c34de-7e0d-4861-81e0-6100fbd8c32a-original.webp',' Retin-A Treatment Soap',1,0,'2026-07-30 09:56:03.488'),('277f1a08-ac67-4fca-8bb1-dd940d7fd6a0-2','277f1a08-ac67-4fca-8bb1-dd940d7fd6a0','/uploads/products/bde681c8-acde-40d7-a05d-fc848c505482-original.webp',' Retin-A Treatment Soap',2,0,'2026-07-30 09:56:04.234'),('2a215aea-68b0-4bd1-9028-0e5278cfb47b-0','2a215aea-68b0-4bd1-9028-0e5278cfb47b','/uploads/products/651e10ac-6476-4132-919c-b500bf0a9497-original.webp','☕Coffee & Coconut Whitening Scrub',0,1,'2026-07-30 09:56:05.529'),('2a215aea-68b0-4bd1-9028-0e5278cfb47b-1','2a215aea-68b0-4bd1-9028-0e5278cfb47b','/uploads/products/1f4958a2-ef13-4404-afd7-ad2e5cdf48b4-original.webp','☕Coffee & Coconut Whitening Scrub',1,0,'2026-07-30 09:56:04.933'),('3e64e70d-e100-41cb-a1c7-a5811cf35eb1-0','3e64e70d-e100-41cb-a1c7-a5811cf35eb1','/uploads/products/eee0d02b-e2bc-4e55-b5a8-0907d0500bb9-original.webp',' Turmeric Super Whitening Soap',0,1,'2026-07-30 09:56:06.455'),('3e64e70d-e100-41cb-a1c7-a5811cf35eb1-1','3e64e70d-e100-41cb-a1c7-a5811cf35eb1','/uploads/products/bc4c9155-b8a3-4b98-ac8d-8722cae21b72-original.webp',' Turmeric Super Whitening Soap',1,0,'2026-07-30 09:56:05.932'),('42c54f7f-96bc-496c-bd7b-5b1d079511c6-0','42c54f7f-96bc-496c-bd7b-5b1d079511c6','/uploads/products/44913d4b-b74b-46ac-b61b-40d1899cffb3-original.webp','Beleclat Kenacol',0,1,'2026-07-30 09:56:07.555'),('42c54f7f-96bc-496c-bd7b-5b1d079511c6-1','42c54f7f-96bc-496c-bd7b-5b1d079511c6','/uploads/products/b0e60b36-283a-44da-a369-5dfee17655c4-original.webp','Beleclat Kenacol',1,0,'2026-07-30 09:56:07.034'),('48e08366-01e7-40db-8014-0f66c234eba2-0','48e08366-01e7-40db-8014-0f66c234eba2','/uploads/products/b9608312-162a-4c22-82ad-4b5d9c57f8e8-original.webp',' Face Facts Glow + Resurface Lactic Acid AHA Serum',0,1,'2026-07-30 09:56:08.422'),('48e08366-01e7-40db-8014-0f66c234eba2-1','48e08366-01e7-40db-8014-0f66c234eba2','/uploads/products/c245a6a7-a5b6-4bea-a6b5-e0c086aaa846-original.webp',' Face Facts Glow + Resurface Lactic Acid AHA Serum',1,0,'2026-07-30 09:56:08.087'),('4f25685f-59a0-4ce9-b093-6ae71187b73c-0','4f25685f-59a0-4ce9-b093-6ae71187b73c','/uploads/products/2156b5f7-f7d8-4e79-8de6-057bce68fb95-original.webp','G Glow Soap',0,1,'2026-07-30 09:56:09.088'),('4f25685f-59a0-4ce9-b093-6ae71187b73c-1','4f25685f-59a0-4ce9-b093-6ae71187b73c','/uploads/products/6c3dd1f4-5c82-4c84-91fd-629ec15b7de0-original.webp','G Glow Soap',1,0,'2026-07-30 09:56:10.035'),('56464e50-cbe5-4d73-a1ef-2439310c578b-0','56464e50-cbe5-4d73-a1ef-2439310c578b','/uploads/products/c0f494d3-0523-416a-8f76-d24c990b7d22-original.webp',' LAIT SNAPTCHAT DIAMANT BLEU Body Milk',0,1,'2026-07-30 09:56:11.499'),('56464e50-cbe5-4d73-a1ef-2439310c578b-1','56464e50-cbe5-4d73-a1ef-2439310c578b','/uploads/products/b6bc22b6-af08-4be0-a34f-e799fe6228ef-original.webp',' LAIT SNAPTCHAT DIAMANT BLEU Body Milk',1,0,'2026-07-30 09:56:11.166'),('59799ae0-b0de-4f23-9808-6dc6e8c4cb07-0','59799ae0-b0de-4f23-9808-6dc6e8c4cb07','/uploads/products/d46ac580-cd7f-42b9-be6a-f3d9959d068a-original.webp','Vitamin C Body Scrub',0,1,'2026-07-30 09:56:12.777'),('59799ae0-b0de-4f23-9808-6dc6e8c4cb07-1','59799ae0-b0de-4f23-9808-6dc6e8c4cb07','/uploads/products/b846d024-aa95-4e51-9797-db4ec15caa6e-original.webp','Vitamin C Body Scrub',1,0,'2026-07-30 09:56:12.222'),('663fcea3-7b3f-447f-a5c6-b5cf52db0a8f-0','663fcea3-7b3f-447f-a5c6-b5cf52db0a8f','/uploads/products/9fcbab2a-dff7-41dc-aacc-cd439924c967-original.webp',' SKIN1004 Madagascar Centella Asiatica',0,1,'2026-07-30 09:56:13.343'),('680fe692-0154-49dc-afc5-b2cb83deff0b-0','680fe692-0154-49dc-afc5-b2cb83deff0b','/uploads/products/86065937-eb93-4b78-a8e1-a6538f94aaca-original.webp',' Niu Skin Total Effects Platinum White Face Essence Lotion',0,1,'2026-07-30 09:56:14.000'),('680fe692-0154-49dc-afc5-b2cb83deff0b-1','680fe692-0154-49dc-afc5-b2cb83deff0b','/uploads/products/52ceb438-8b84-4bf8-b1e2-52afe13bc78e-original.webp',' Niu Skin Total Effects Platinum White Face Essence Lotion',1,0,'2026-07-30 09:56:14.277'),('680fe692-0154-49dc-afc5-b2cb83deff0b-2','680fe692-0154-49dc-afc5-b2cb83deff0b','/uploads/products/faafb921-6d68-4c25-ab31-d48287adcb0c-original.webp',' Niu Skin Total Effects Platinum White Face Essence Lotion',2,0,'2026-07-30 09:56:13.756'),('6bb5222a-1dfc-4a4d-999c-ce6a0d051c13-0','6bb5222a-1dfc-4a4d-999c-ce6a0d051c13','/uploads/products/f109b5d8-a072-4fd0-ae7b-6e738c58264a-original.webp','Good Molecules Discoloration Correcting Serum',0,1,'2026-07-30 09:56:15.145'),('6c0f9788-8d9a-4116-b4db-1cd73175bb5d-0','6c0f9788-8d9a-4116-b4db-1cd73175bb5d','/uploads/products/d8125890-fc42-44d0-bdc0-8b83d01d8d16-original.webp',' Duchess Glow Gluta Berry Vitamin Collagen Shower Gel',0,1,'2026-07-30 09:56:16.432'),('6c0f9788-8d9a-4116-b4db-1cd73175bb5d-1','6c0f9788-8d9a-4116-b4db-1cd73175bb5d','/uploads/products/775e0fa1-4119-491b-9c35-959f256aff55-original.webp',' Duchess Glow Gluta Berry Vitamin Collagen Shower Gel',1,0,'2026-07-30 09:56:16.010'),('7157acfb-68bc-4660-9740-5bac496e4c76-0','7157acfb-68bc-4660-9740-5bac496e4c76','/uploads/products/75269400-db4b-490a-adb0-341cc472a6ac-original.webp','Face Facts Nourish+ Ceramide Restore Serum',0,1,'2026-07-30 09:56:17.865'),('7157acfb-68bc-4660-9740-5bac496e4c76-1','7157acfb-68bc-4660-9740-5bac496e4c76','/uploads/products/d32b8e14-0930-415e-a4af-9919b4cf19d1-original.webp','Face Facts Nourish+ Ceramide Restore Serum',1,0,'2026-07-30 09:56:17.362'),('754d17fe-4953-41c4-bdba-a13183b80262-0','754d17fe-4953-41c4-bdba-a13183b80262','/uploads/products/362459bf-bd1d-414a-b851-6a9b53977404-original.webp','SKIN1004 Madagascar Centella Tone Brightening Capsule Ampoule',0,1,'2026-07-30 09:56:19.325'),('7a1fdbbb-ee6d-4c20-b598-9f4e0e9489f5-0','7a1fdbbb-ee6d-4c20-b598-9f4e0e9489f5','/uploads/products/f1401036-5bd9-4332-a006-d80a52e69584-original.webp',' Dr. Newhar Rose Water Facial Toner',0,1,'2026-07-30 09:56:20.614'),('7a1fdbbb-ee6d-4c20-b598-9f4e0e9489f5-1','7a1fdbbb-ee6d-4c20-b598-9f4e0e9489f5','/uploads/products/692e561e-6e25-46c0-9671-b2dc3928c04c-original.webp',' Dr. Newhar Rose Water Facial Toner',1,0,'2026-07-30 09:56:20.956'),('819ee790-2ee9-4235-9cd1-2e96a6395b1d-0','819ee790-2ee9-4235-9cd1-2e96a6395b1d','/uploads/products/be53aa27-2583-4409-b7ed-42a2a5f47a15-original.webp','Cos De BAHA AN Serum (Arbutin Niacinamide)',0,1,'2026-07-30 09:56:21.996'),('82a8e154-9716-4cb4-b682-0437eeb6d972-0','82a8e154-9716-4cb4-b682-0437eeb6d972','/uploads/products/2575e479-dd99-480d-bf0b-723d79f82a18-original.webp','FITGUM Extra Strength Apple Cider Vinegar Gummies',0,1,'2026-07-30 09:56:23.214'),('82a8e154-9716-4cb4-b682-0437eeb6d972-1','82a8e154-9716-4cb4-b682-0437eeb6d972','/uploads/products/f87044e2-19b0-4d0d-9346-c062d4452539-original.webp','FITGUM Extra Strength Apple Cider Vinegar Gummies',1,0,'2026-07-30 09:56:23.579'),('85dff5f5-3033-4bf9-87c3-bfd62a03bcca-0','85dff5f5-3033-4bf9-87c3-bfd62a03bcca','/uploads/products/37447e7a-4eda-429a-b9f7-77822156fe40-original.webp','Estelin Rejuvenate Toner',0,1,'2026-07-30 09:56:24.312'),('87c05c9e-2526-4b0c-9f75-1975f3f56938-0','87c05c9e-2526-4b0c-9f75-1975f3f56938','/uploads/products/6104a552-755d-4c29-8d0d-209c48c39880-original.webp','Blemish Care Exfoliating Korean Full Moon Intense Whitening Mask',0,1,'2026-07-30 09:56:25.325'),('87c05c9e-2526-4b0c-9f75-1975f3f56938-1','87c05c9e-2526-4b0c-9f75-1975f3f56938','/uploads/products/aa085e3b-91bb-4a72-80ff-ee1136c0656a-original.webp','Blemish Care Exfoliating Korean Full Moon Intense Whitening Mask',1,0,'2026-07-30 09:56:24.947'),('8f113ddc-0a6c-41b9-a98e-3b3b39d04d55-0','8f113ddc-0a6c-41b9-a98e-3b3b39d04d55','/uploads/products/dae59544-9d4e-4ac3-b311-c7432f633654-original.webp',' ESTELIN Rosehip Niacinamide Spots Fading Face Serum',0,1,'2026-07-30 09:56:27.201'),('8f113ddc-0a6c-41b9-a98e-3b3b39d04d55-1','8f113ddc-0a6c-41b9-a98e-3b3b39d04d55','/uploads/products/06fbab1f-8f30-4f86-90a9-b934a9f650d8-original.webp',' ESTELIN Rosehip Niacinamide Spots Fading Face Serum',1,0,'2026-07-30 09:56:26.737'),('9181e79a-dbef-407d-b11f-c83099b70bcb-0','9181e79a-dbef-407d-b11f-c83099b70bcb','/uploads/products/9b362f73-674f-4229-86e6-77059c1a1c9c-original.webp','Face Facts Firm+ Revitalise Polypeptide Serum',0,1,'2026-07-30 09:56:27.767'),('9181e79a-dbef-407d-b11f-c83099b70bcb-1','9181e79a-dbef-407d-b11f-c83099b70bcb','/uploads/products/610fcf35-3ac2-4f8f-839f-8461cef8e651-original.webp','Face Facts Firm+ Revitalise Polypeptide Serum',1,0,'2026-07-30 09:56:28.200'),('961d7f54-dccc-47a6-b30a-3370beb14d3d-0','961d7f54-dccc-47a6-b30a-3370beb14d3d','/uploads/products/a78a0f5c-b593-433a-b5a7-433e8dfe11d1-original.webp','Gana Sachi Plus Evening Primrose Oil',0,1,'2026-07-30 09:56:29.244'),('961d7f54-dccc-47a6-b30a-3370beb14d3d-1','961d7f54-dccc-47a6-b30a-3370beb14d3d','/uploads/products/6c067787-d10f-4ca2-a450-04c3bbd86218-original.webp','Gana Sachi Plus Evening Primrose Oil',1,0,'2026-07-30 09:56:28.945'),('962d41d7-33e0-4e76-9750-944a0ff537f4-0','962d41d7-33e0-4e76-9750-944a0ff537f4','/uploads/products/bcced4e5-9509-46c3-be9c-81abe2978f15-original.webp',' COSRX Advanced Snail 92 All in One Cream',0,1,'2026-07-30 09:56:30.212'),('962d41d7-33e0-4e76-9750-944a0ff537f4-1','962d41d7-33e0-4e76-9750-944a0ff537f4','/uploads/products/2a6e1889-e455-4890-bbc0-1a9b6f332f32-original.webp',' COSRX Advanced Snail 92 All in One Cream',1,0,'2026-07-30 09:56:29.922'),('9d503786-a100-4d6e-a6ce-0fd035dca587-0','9d503786-a100-4d6e-a6ce-0fd035dca587','/uploads/products/ca495ac4-652f-483d-90c7-7d3d575680ac-original.webp',' Niu Skin Bright & Clear Face Cream',0,1,'2026-07-30 09:56:30.999'),('9d503786-a100-4d6e-a6ce-0fd035dca587-1','9d503786-a100-4d6e-a6ce-0fd035dca587','/uploads/products/035982e8-e0bc-4df0-a402-4051e410258b-original.webp',' Niu Skin Bright & Clear Face Cream',1,0,'2026-07-30 09:56:31.267'),('9d503786-a100-4d6e-a6ce-0fd035dca587-2','9d503786-a100-4d6e-a6ce-0fd035dca587','/uploads/products/346bb3a4-01d5-4ecd-a1ec-8d3d782f036d-original.webp',' Niu Skin Bright & Clear Face Cream',2,0,'2026-07-30 09:56:31.645'),('a02f9b79-cf7c-4a50-b7aa-e4d1e18f36f6-0','a02f9b79-cf7c-4a50-b7aa-e4d1e18f36f6','/uploads/products/04c99249-666e-420c-8705-a95d45c63596-original.webp',' Dove Beauty Cream Bar',0,1,'2026-07-30 09:56:33.235'),('a02f9b79-cf7c-4a50-b7aa-e4d1e18f36f6-1','a02f9b79-cf7c-4a50-b7aa-e4d1e18f36f6','/uploads/products/c1fd04e6-b61b-4519-8495-602d2e616f46-original.webp',' Dove Beauty Cream Bar',1,0,'2026-07-30 09:56:32.299'),('a37e4c17-bbdc-4732-bf4a-511f130fae56-0','a37e4c17-bbdc-4732-bf4a-511f130fae56','/uploads/products/ecc3b59c-e24b-4f1e-8de0-a78a9e30cc83-original.webp',' Kojie-San Skin Lightening Soap',0,1,'2026-07-30 09:56:34.034'),('a8cb6bf2-cab1-4f33-b853-4d78241bd4db-0','a8cb6bf2-cab1-4f33-b853-4d78241bd4db','/uploads/products/19fd907d-0b9b-46ea-8738-e7d7f6deb0f7-original.webp',' DR.ALTHEA Gentle Vitamin C Serum',0,1,'2026-07-30 09:56:34.644'),('a8cb6bf2-cab1-4f33-b853-4d78241bd4db-1','a8cb6bf2-cab1-4f33-b853-4d78241bd4db','/uploads/products/b29ac975-0ce8-4f6b-8fb5-654be08c87d0-original.webp',' DR.ALTHEA Gentle Vitamin C Serum',1,0,'2026-07-30 09:56:34.444'),('aaeb1611-2a95-4b2f-9713-64c209201022-0','aaeb1611-2a95-4b2f-9713-64c209201022','/uploads/products/673cac8f-3491-4fc4-b275-4c7eddab3254-original.webp',' Asantee Salt Spa Turmeric & Ginger Soap',0,1,'2026-07-30 09:56:35.400'),('aaeb1611-2a95-4b2f-9713-64c209201022-1','aaeb1611-2a95-4b2f-9713-64c209201022','/uploads/products/bafe9b9b-d699-4c76-b9ef-b34c88dadb64-original.webp',' Asantee Salt Spa Turmeric & Ginger Soap',1,0,'2026-07-30 09:56:35.122'),('ab800d6d-ffd3-4983-8de2-383e43c5e4e6-0','ab800d6d-ffd3-4983-8de2-383e43c5e4e6','/uploads/products/eeef1c8c-9503-4047-a4c5-f3b1753dda3e-original.webp','Cos De BAHA TT Serum (Tranexamic Acid)',0,1,'2026-07-30 09:56:36.215'),('ab800d6d-ffd3-4983-8de2-383e43c5e4e6-1','ab800d6d-ffd3-4983-8de2-383e43c5e4e6','/uploads/products/d3a1af1e-b0d0-4747-904f-c1797861277a-original.webp','Cos De BAHA TT Serum (Tranexamic Acid)',1,0,'2026-07-30 09:56:35.979'),('afe9da14-a101-411f-9fd4-50639127167e-0','afe9da14-a101-411f-9fd4-50639127167e','/uploads/products/01da14fe-3204-4ce0-95aa-a0992894d8cd-original.webp',' Asantee Carrot with Honey Soap',0,1,'2026-07-30 09:56:37.356'),('afe9da14-a101-411f-9fd4-50639127167e-1','afe9da14-a101-411f-9fd4-50639127167e','/uploads/products/041245cf-ea80-474a-8cd0-dfcc7379c3e5-original.webp',' Asantee Carrot with Honey Soap',1,0,'2026-07-30 09:56:37.078'),('b1dc0cd1-e11b-4fb2-ba23-57b96e2c99f3-0','b1dc0cd1-e11b-4fb2-ba23-57b96e2c99f3','/uploads/products/9c198570-c4c0-4b92-8e3a-0f28d77cba82-original.webp',' Clini-tone Mild Lightening Glutathione Enriched Body Wash',0,1,'2026-07-30 09:56:38.591'),('b1dc0cd1-e11b-4fb2-ba23-57b96e2c99f3-1','b1dc0cd1-e11b-4fb2-ba23-57b96e2c99f3','/uploads/products/4563548d-829c-4886-baa2-6a15d181b4d3-original.webp',' Clini-tone Mild Lightening Glutathione Enriched Body Wash',1,0,'2026-07-30 09:56:38.269'),('b23e1f60-9fff-4d88-9f13-da6165c7f2c5-0','b23e1f60-9fff-4d88-9f13-da6165c7f2c5','/uploads/products/421ba443-1012-4fd2-8e5a-19ae46c84ce4-original.webp','Advanced Korean Skin Bright & Clear Body Gel Wash',0,1,'2026-07-30 09:56:39.303'),('b23e1f60-9fff-4d88-9f13-da6165c7f2c5-1','b23e1f60-9fff-4d88-9f13-da6165c7f2c5','/uploads/products/f1b5c4fc-f642-4b3c-b01c-8d92b87bf323-original.webp','Advanced Korean Skin Bright & Clear Body Gel Wash',1,0,'2026-07-30 09:56:39.590'),('b2f09fd7-9353-40be-8f2a-8d55afd53edc-0','b2f09fd7-9353-40be-8f2a-8d55afd53edc','/uploads/products/2950cbb8-8cd9-42ab-a99c-4385b4705fa5-original.webp',' JUMISO Snail Mucin 95 Peptide Facial Essence',0,1,'2026-07-30 09:56:40.325'),('b3bafd62-961b-4fe6-a70b-3fa28c66516a-0','b3bafd62-961b-4fe6-a70b-3fa28c66516a','/uploads/products/564eecd3-6bb8-4141-8828-240d34b59724-original.webp',' Advanced Korean Skin Bright & Clear Body Gel Wash',0,1,'2026-07-30 09:56:41.190'),('b5aa739d-e20c-45bf-99ec-5bfe1def66c9-0','b5aa739d-e20c-45bf-99ec-5bfe1def66c9','/uploads/products/07f0e03f-6535-47cc-b16d-0a051c845ddb-original.webp','COSRX Centella Water Alcohol-Free Toner',0,1,'2026-07-30 09:56:41.790'),('b7d29c19-ac79-413f-aca4-293f9ba295e4-0','b7d29c19-ac79-413f-aca4-293f9ba295e4','/uploads/products/ef84e647-242d-4199-a95d-fd75df59ca51-original.webp','The Ordinary Alpha Arbutin 2% + HA',0,1,'2026-07-30 09:56:42.837'),('b8120dce-1269-4fa1-9842-334bcb39c261-0','b8120dce-1269-4fa1-9842-334bcb39c261','/uploads/products/06789f2b-a952-4146-b627-e730a295de6e-original.webp',' Fruiser Premium Double Moisturising Shower Cream (Goat\'s Milk & Papaya)',0,1,'2026-07-30 09:56:43.724'),('b8120dce-1269-4fa1-9842-334bcb39c261-1','b8120dce-1269-4fa1-9842-334bcb39c261','/uploads/products/2301d56a-9ec9-41d4-84c8-82f1dc9eab05-original.webp',' Fruiser Premium Double Moisturising Shower Cream (Goat\'s Milk & Papaya)',1,0,'2026-07-30 09:56:43.536'),('c5cb6097-9eb8-4e82-afdc-042b269d62dc-0','c5cb6097-9eb8-4e82-afdc-042b269d62dc','/uploads/products/eed1fb02-e742-4dea-9e5f-eedaf35c3095-original.webp',' Glowing Secret Collagen Powder (Nourish + Glow)',0,1,'2026-07-30 09:56:45.003'),('c5cb6097-9eb8-4e82-afdc-042b269d62dc-1','c5cb6097-9eb8-4e82-afdc-042b269d62dc','/uploads/products/0523db0c-59dc-49b9-81b3-a28881e86108-original.webp',' Glowing Secret Collagen Powder (Nourish + Glow)',1,0,'2026-07-30 09:56:44.457'),('c5cb6097-9eb8-4e82-afdc-042b269d62dc-2','c5cb6097-9eb8-4e82-afdc-042b269d62dc','/uploads/products/8fc9bc95-459b-4dd2-b433-7192c98c86d0-original.webp',' Glowing Secret Collagen Powder (Nourish + Glow)',2,0,'2026-07-30 09:56:44.802'),('c7d8f401-db84-435e-9a45-3886c6dbba78-0','c7d8f401-db84-435e-9a45-3886c6dbba78','/uploads/products/630f1358-7496-45b9-a81a-c496838a1bb9-original.webp',' ESTELLA Repair Toner',0,1,'2026-07-30 09:56:45.613'),('ca7c5ba5-d414-4359-ad36-4fec8205a511-0','ca7c5ba5-d414-4359-ad36-4fec8205a511','/uploads/products/d833bf34-f553-4740-9123-f709dd251a7b-original.webp',' Face Facts Firm + Revitalise Collagen Serum',0,1,'2026-07-30 09:56:46.104'),('ca7c5ba5-d414-4359-ad36-4fec8205a511-1','ca7c5ba5-d414-4359-ad36-4fec8205a511','/uploads/products/55dcc89f-68a3-4162-9959-10af67130d05-original.webp',' Face Facts Firm + Revitalise Collagen Serum',1,0,'2026-07-30 09:56:46.325'),('cb49dfad-4af0-43a5-94a7-f182017bf8a8-0','cb49dfad-4af0-43a5-94a7-f182017bf8a8','/uploads/products/ec0d1562-d1f9-47fd-8adb-c6a1d81c4208-original.webp',' Dr. Althea 345 Relief Cream',0,1,'2026-07-30 09:56:47.035'),('cb49dfad-4af0-43a5-94a7-f182017bf8a8-1','cb49dfad-4af0-43a5-94a7-f182017bf8a8','/uploads/products/1be4cd1a-067e-418e-aceb-b1894303f4a8-original.webp',' Dr. Althea 345 Relief Cream',1,0,'2026-07-30 09:56:47.474'),('cee016a1-b979-4823-9d32-8a22e750cd58-0','cee016a1-b979-4823-9d32-8a22e750cd58','/uploads/products/ad31f4c7-ade9-46f6-b96f-a15fa567c8ce-original.webp','Juli Gold Halfcaste Oil',0,1,'2026-07-30 09:56:48.256'),('cee016a1-b979-4823-9d32-8a22e750cd58-1','cee016a1-b979-4823-9d32-8a22e750cd58','/uploads/products/6c6e5353-45d3-4df2-aed7-5ba9bcfb1e4e-original.webp','Juli Gold Halfcaste Oil',1,0,'2026-07-30 09:56:48.735'),('cfae249d-1720-4a4a-898a-2c1062a08fbb-0','cfae249d-1720-4a4a-898a-2c1062a08fbb','/uploads/products/90403a67-831b-4ca9-ae34-eef27a8d3575-original.webp',' Face Facts Renew+ Radiance Retinol Serum',0,1,'2026-07-30 09:56:49.735'),('cfae249d-1720-4a4a-898a-2c1062a08fbb-1','cfae249d-1720-4a4a-898a-2c1062a08fbb','/uploads/products/c1aa38b1-c73b-4cbd-86ac-4543218946d8-original.webp',' Face Facts Renew+ Radiance Retinol Serum',1,0,'2026-07-30 09:56:49.480'),('d5b3d538-3579-47bb-85f1-b2a407593915-0','d5b3d538-3579-47bb-85f1-b2a407593915','/uploads/products/a3304624-7bac-41ee-9fd3-003b7e93920c-original.webp',' Olay Vitamin C 24HR Moisturizing Body Wash',0,1,'2026-07-30 09:56:50.257'),('d67f8ba1-d0be-4231-86c7-dbe25e4e429b-0','d67f8ba1-d0be-4231-86c7-dbe25e4e429b','/uploads/products/9ac00d85-928c-4653-89cf-eb7164a5be57-original.webp','🛁 Aqua Rich Hydrating Bright Vitamin Body Lotion',0,1,'2026-07-30 09:56:50.846'),('d67f8ba1-d0be-4231-86c7-dbe25e4e429b-1','d67f8ba1-d0be-4231-86c7-dbe25e4e429b','/uploads/products/46766575-3f9f-4bbc-a69c-ce602d406a51-original.webp','🛁 Aqua Rich Hydrating Bright Vitamin Body Lotion',1,0,'2026-07-30 09:56:51.381'),('d89627b2-bb5d-40dc-a9a3-11a0eba72a89-0','d89627b2-bb5d-40dc-a9a3-11a0eba72a89','/uploads/products/8b64ce9a-3fb9-4cf1-aa02-1ff7ce34c353-original.webp',' Extra Cool  Smooth as Silk® Toning Soap',0,1,'2026-07-30 09:56:52.368'),('d89627b2-bb5d-40dc-a9a3-11a0eba72a89-1','d89627b2-bb5d-40dc-a9a3-11a0eba72a89','/uploads/products/f83d384a-4008-4495-8051-b7414f9c4e4c-original.webp',' Extra Cool  Smooth as Silk® Toning Soap',1,0,'2026-07-30 09:56:53.134'),('d89627b2-bb5d-40dc-a9a3-11a0eba72a89-2','d89627b2-bb5d-40dc-a9a3-11a0eba72a89','/uploads/products/95b33443-8e29-4ae3-9c1c-0aea9cdbae55-original.webp',' Extra Cool  Smooth as Silk® Toning Soap',2,0,'2026-07-30 09:56:52.734'),('dbd35e09-d70d-4002-b4fc-7feaddc3f0d7-0','dbd35e09-d70d-4002-b4fc-7feaddc3f0d7','/uploads/products/925457c7-c9f0-4d24-8a48-d4a2bfcac015-original.webp','D-Cure Stretch Marks Healing Oil',0,1,'2026-07-30 09:56:54.168'),('dbd35e09-d70d-4002-b4fc-7feaddc3f0d7-1','dbd35e09-d70d-4002-b4fc-7feaddc3f0d7','/uploads/products/f69ccee9-7c5f-45f3-979e-5f047dce163d-original.webp','D-Cure Stretch Marks Healing Oil',1,0,'2026-07-30 09:56:53.758'),('e00420ed-a8bd-446e-8ac0-5281f55eb182-0','e00420ed-a8bd-446e-8ac0-5281f55eb182','/uploads/products/433d8663-33ab-49f0-a2c4-13ceb0c72078-original.webp','Niu Skin Glowing Body Wash',0,1,'2026-07-30 09:56:54.780'),('e00420ed-a8bd-446e-8ac0-5281f55eb182-1','e00420ed-a8bd-446e-8ac0-5281f55eb182','/uploads/products/f512f82f-f7fc-40d5-9154-e11959b53fc9-original.webp','Niu Skin Glowing Body Wash',1,0,'2026-07-30 09:56:55.134'),('e132791a-51f3-400a-8a5b-ad267e98a3d7-0','e132791a-51f3-400a-8a5b-ad267e98a3d7','/uploads/products/6178d22a-2515-48f9-94c7-850091e9d892-original.webp','Face Facts Ceramide Skin Barrier Complex Blemish Gel Moisturiser',0,1,'2026-07-30 09:56:55.835'),('e132791a-51f3-400a-8a5b-ad267e98a3d7-1','e132791a-51f3-400a-8a5b-ad267e98a3d7','/uploads/products/70064a19-a4d6-4cff-9f79-e0db827aeffd-original.webp','Face Facts Ceramide Skin Barrier Complex Blemish Gel Moisturiser',1,0,'2026-07-30 09:56:56.225'),('e47df837-f94e-44f4-8efd-677e10bd992a-0','e47df837-f94e-44f4-8efd-677e10bd992a','/uploads/products/eb733b83-b3da-44e4-bec8-15fc2a59dcbf-original.webp',' White Blinks Premium Pearl Powder Cereal (Collagen + Astaxanthin + Stem Cell)',0,1,'2026-07-30 09:56:57.937'),('e47df837-f94e-44f4-8efd-677e10bd992a-1','e47df837-f94e-44f4-8efd-677e10bd992a','/uploads/products/934a819a-e13e-4acf-8f32-ae1a465cdee9-original.webp',' White Blinks Premium Pearl Powder Cereal (Collagen + Astaxanthin + Stem Cell)',1,0,'2026-07-30 09:56:57.115'),('e47df837-f94e-44f4-8efd-677e10bd992a-2','e47df837-f94e-44f4-8efd-677e10bd992a','/uploads/products/fed15d5d-c0c4-422f-962b-8c02bf3f28b4-original.webp',' White Blinks Premium Pearl Powder Cereal (Collagen + Astaxanthin + Stem Cell)',2,0,'2026-07-30 09:56:57.491'),('ebccfa5b-6b35-4534-af01-d7674c8d823b-0','ebccfa5b-6b35-4534-af01-d7674c8d823b','/uploads/products/f0a89bca-5a87-4313-8ff2-aa5d25a86f50-original.webp','Mary & May Glutathione Eye Cream',0,1,'2026-07-30 09:56:59.224'),('f7e4b880-19cf-4080-bfeb-4c2dcc1f47c5-0','f7e4b880-19cf-4080-bfeb-4c2dcc1f47c5','/uploads/products/fe5eb02e-3345-4d80-b44c-71a755944458-original.webp','Blemish Care Full Moisturising White Milk Lotion',0,1,'2026-07-30 09:56:59.938'),('fb2e2936-11a4-4e3b-8b37-c052e24c57b7-0','fb2e2936-11a4-4e3b-8b37-c052e24c57b7','/uploads/products/f09c74e4-d7c9-4ff1-8bee-aa24aad58f85-original.webp',' Niu Skin Amino Acid Gentle Face Wash',0,1,'2026-07-30 09:57:00.914'),('fb2e2936-11a4-4e3b-8b37-c052e24c57b7-1','fb2e2936-11a4-4e3b-8b37-c052e24c57b7','/uploads/products/bf62ed24-1b1c-4966-ad57-2589df66c024-original.webp',' Niu Skin Amino Acid Gentle Face Wash',1,0,'2026-07-30 09:57:01.370'),('fb2e2936-11a4-4e3b-8b37-c052e24c57b7-2','fb2e2936-11a4-4e3b-8b37-c052e24c57b7','/uploads/products/565c2d5a-3046-4785-b1ec-63b6c650a8f3-original.webp',' Niu Skin Amino Acid Gentle Face Wash',2,0,'2026-07-30 09:57:00.613');
/*!40000 ALTER TABLE `product_images` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `product_tags`
--

DROP TABLE IF EXISTS `product_tags`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `product_tags` (
  `id` varchar(191) COLLATE utf8mb4_unicode_ci NOT NULL,
  `productId` varchar(191) COLLATE utf8mb4_unicode_ci NOT NULL,
  `tag` varchar(191) COLLATE utf8mb4_unicode_ci NOT NULL,
  `createdAt` datetime(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
  PRIMARY KEY (`id`),
  KEY `product_tags_tag_idx` (`tag`),
  KEY `product_tags_productId_fkey` (`productId`),
  CONSTRAINT `product_tags_productId_fkey` FOREIGN KEY (`productId`) REFERENCES `products` (`id`) ON DELETE CASCADE ON UPDATE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `product_tags`
--

LOCK TABLES `product_tags` WRITE;
/*!40000 ALTER TABLE `product_tags` DISABLE KEYS */;
/*!40000 ALTER TABLE `product_tags` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `product_variants`
--

DROP TABLE IF EXISTS `product_variants`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `product_variants` (
  `id` varchar(191) COLLATE utf8mb4_unicode_ci NOT NULL,
  `productId` varchar(191) COLLATE utf8mb4_unicode_ci NOT NULL,
  `name` varchar(191) COLLATE utf8mb4_unicode_ci NOT NULL,
  `value` varchar(191) COLLATE utf8mb4_unicode_ci NOT NULL,
  `type` varchar(191) COLLATE utf8mb4_unicode_ci NOT NULL,
  `price` decimal(12,2) DEFAULT NULL,
  `stockQty` int NOT NULL DEFAULT '0',
  `sku` varchar(191) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `image` varchar(191) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `isActive` tinyint(1) NOT NULL DEFAULT '1',
  `sortOrder` int NOT NULL DEFAULT '0',
  `createdAt` datetime(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
  `updatedAt` datetime(3) NOT NULL,
  PRIMARY KEY (`id`),
  KEY `product_variants_productId_fkey` (`productId`),
  CONSTRAINT `product_variants_productId_fkey` FOREIGN KEY (`productId`) REFERENCES `products` (`id`) ON DELETE CASCADE ON UPDATE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `product_variants`
--

LOCK TABLES `product_variants` WRITE;
/*!40000 ALTER TABLE `product_variants` DISABLE KEYS */;
/*!40000 ALTER TABLE `product_variants` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `products`
--

DROP TABLE IF EXISTS `products`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `products` (
  `id` varchar(191) COLLATE utf8mb4_unicode_ci NOT NULL,
  `name` varchar(191) COLLATE utf8mb4_unicode_ci NOT NULL,
  `slug` varchar(191) COLLATE utf8mb4_unicode_ci NOT NULL,
  `description` longtext COLLATE utf8mb4_unicode_ci,
  `ingredients` text COLLATE utf8mb4_unicode_ci,
  `benefits` text COLLATE utf8mb4_unicode_ci,
  `usageInstructions` text COLLATE utf8mb4_unicode_ci,
  `basePrice` decimal(12,2) NOT NULL,
  `comparePrice` decimal(12,2) DEFAULT NULL,
  `sku` varchar(191) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `barcode` varchar(191) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `weight` double DEFAULT NULL,
  `categoryId` varchar(191) COLLATE utf8mb4_unicode_ci NOT NULL,
  `brandId` varchar(191) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `isFeatured` tinyint(1) NOT NULL DEFAULT '0',
  `isBestSeller` tinyint(1) NOT NULL DEFAULT '0',
  `isNewArrival` tinyint(1) NOT NULL DEFAULT '1',
  `isLimitedEdition` tinyint(1) NOT NULL DEFAULT '0',
  `isActive` tinyint(1) NOT NULL DEFAULT '1',
  `publishedAt` datetime(3) DEFAULT NULL,
  `metaTitle` varchar(191) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `metaDesc` varchar(191) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `metaKeywords` varchar(191) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `avgRating` double NOT NULL DEFAULT '0',
  `reviewCount` int NOT NULL DEFAULT '0',
  `totalSold` int NOT NULL DEFAULT '0',
  `createdAt` datetime(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
  `updatedAt` datetime(3) NOT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `products_slug_key` (`slug`),
  KEY `products_categoryId_idx` (`categoryId`),
  KEY `products_brandId_idx` (`brandId`),
  KEY `products_isFeatured_isActive_idx` (`isFeatured`,`isActive`),
  KEY `products_isBestSeller_isActive_idx` (`isBestSeller`,`isActive`),
  CONSTRAINT `products_brandId_fkey` FOREIGN KEY (`brandId`) REFERENCES `brands` (`id`) ON DELETE SET NULL ON UPDATE CASCADE,
  CONSTRAINT `products_categoryId_fkey` FOREIGN KEY (`categoryId`) REFERENCES `categories` (`id`) ON DELETE RESTRICT ON UPDATE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `products`
--

LOCK TABLES `products` WRITE;
/*!40000 ALTER TABLE `products` DISABLE KEYS */;
INSERT INTO `products` VALUES ('01f5ae6a-7c81-470a-a364-b126d6d92c2e','COSRX AHA/BHA Clarifying Treatment Toner','cosrx-ahabha-clarifying-treatment-toner','The ultimate clarifying first step. This toner is formulated with AHA and BHA to gently exfoliate and clear pores. It helps refine skin texture, remove dead skin cells, and reduce the appearance of blackheads and whiteheads, promoting a clearer, more radiant complexion.\n',NULL,NULL,NULL,250.00,280.00,'',NULL,NULL,'22ea5e3f-8b49-404c-a87f-8f4ecf7275db',NULL,0,0,1,0,1,NULL,NULL,NULL,NULL,0,0,0,'2026-07-30 09:55:48.874','2026-07-30 09:55:48.874'),('07eb7482-ad65-407a-af3e-0a77fba7c56a',' Biore UV Watery Essence','biore-uv-watery-essence','World-first micro-defense sunscreen. This ultra-light watery essence sunscreen offers powerful SPF 50+ PA++++ protection against harmful UV rays. The innovative formula provides a lightweight, non-sticky feel while effectively protecting your skin. The perfect daily sunscreen for all skin types.\n',NULL,NULL,NULL,250.00,280.00,'',NULL,NULL,'af971518-6c23-410b-a881-7cbe5d02daef',NULL,0,0,1,0,1,NULL,NULL,NULL,NULL,0,0,0,'2026-07-30 09:55:49.909','2026-07-30 09:55:49.909'),('08aa9941-ff65-49ed-b47c-a3d29cb249fa',' Estelin Moisturizing Toner (Hyaluronic Acid + Vitamin C + Niacinamide)','estelin-moisturizing-toner-hyaluronic-acid-vitamin-c-niacinamide','The ultimate hydration boost for your skin. This moisturizing fluid is formulated with Hyaluronic Acid, Vitamin C, and Niacinamide to hydrate, revitalize, and brighten your complexion. It delivers a surge of moisture while helping to even out skin tone and reduce the appearance of fine lines. Size: 100ml / 3.4fl.oz.\n',NULL,NULL,NULL,250.00,200.00,'',NULL,NULL,'22ea5e3f-8b49-404c-a87f-8f4ecf7275db',NULL,0,0,1,0,1,NULL,NULL,NULL,NULL,0,0,0,'2026-07-30 09:55:51.222','2026-07-30 09:55:51.222'),('0bb2a8b0-6ee3-442b-b279-ba8e7e4ddb31',' VEET Gold Facial Gel (Acne + Kojic Acid Whitening)','veet-gold-facial-gel-acne-kojic-acid-whitening','Bye-bye pimples and wrinkles. This facial gel is formulated with Kojic Acid to whiten and brighten the skin while targeting acne and blemishes. Suitable for all skin types, it helps reduce the appearance of pimples, wrinkles, and hyperpigmentation. Dermatologist recommended.\n',NULL,NULL,NULL,250.00,280.00,'',NULL,NULL,'b2180067-ab17-4ed0-a2b1-e59a8383c466',NULL,0,0,1,0,1,NULL,NULL,NULL,NULL,0,0,0,'2026-07-30 09:55:51.988','2026-07-30 09:55:51.988'),('0d780502-8a9b-4893-8787-18036d0de885',' Face Facts Restore + Clarify Salicylic Acid Serum','face-facts-restore-clarify-salicylic-acid-serum','Clarify and smooth blemish-prone and oily skin with this 2% Salicylic Acid serum.\n\nThis clarifying serum is formulated with 2% Salicylic Acid (BHA) to gently exfoliate and smooth the skin\'s appearance and texture. It helps unclog pores, reduce breakouts, and control excess oil production, making it ideal for blemish-prone and oily skin types. Suitable for AM and PM use.\n\nSize: 30ml / 1.01 fl.oz.',NULL,NULL,NULL,180.00,220.00,'',NULL,NULL,'2db14e74-1537-46f7-9ce0-9ef941cb23d0',NULL,0,0,1,0,1,NULL,NULL,NULL,NULL,0,0,0,'2026-07-30 09:55:53.030','2026-07-30 09:55:53.030'),('119b7556-2fab-480f-91d7-4a087518a450',' Alpha Arbutin Collagen Peptide Drink (7D)','alpha-arbutin-collagen-peptide-drink-7d','Beauty that starts from within. This powerful collagen peptide drink is formulated with Alpha Arbutin to support smooth, whitening, and anti-aging benefits. It works to inhibit melanin production, promote collagen growth, and repair damaged skin for a clear and glowing complexion. Each pack contains 8 bottles of 50ml.\n',NULL,NULL,NULL,250.00,300.00,'',NULL,NULL,'77566a51-bcd0-4b5c-a2df-01aaaf03938c',NULL,0,0,1,0,1,NULL,NULL,NULL,NULL,0,0,0,'2026-07-30 09:55:54.232','2026-07-30 09:55:54.232'),('1358f2a7-3195-4d41-8135-b5bf6ffd3aef',' Aveeno Skin Relief Body Oil Spray','aveeno-skin-relief-body-oil-spray','\nKey Ingredients:\nGlycine Soja Oil, Avena Sativa Kernel (Oat) Oil, Simmondsia Chinensis (Jojoba) Seed Oil, Lecithin, Ascorbyl Palmitate, Tocopherol (Vitamin E) .\n\n🧴 How to Use\nShake well before use.\n\nSpray directly onto clean, dry skin.\n\nMassage gently until fully absorbed.\n\nUse daily for best results, especially after showering.\n\nPro Tip: For very dry skin, apply immediately after bathing while skin is still slightly damp to lock in moisture.\n\n✨ Key Benefits\n💧 Intense Moisture: Clinically proven to provide long-lasting hydration\n\n🛡️ Restores Skin Barrier: Oat and jojoba oils rich in lipids and fatty acids help repair the skin barrier\n\n✨ Improves Texture: Helps smooth uneven skin texture\n\n🔬 Dermatologist Tested: Safe for very dry, sensitive skin\n\n🌱 Fast-Absorbing: Non-greasy, silky finish\n\n⚠️ Caution\nFor external use only\n\nAvoid contact with eyes\n\nDiscontinue use if irritation occurs\n\nKeep out of reach of children\n\n🏷️ Product Details\nDetail	Information\nSize	200ml (6.7 fl oz)\nSkin Type	Very dry, sensitive skin\nFormula	Hypoallergenic, tested on all skin tones\nKey Ingredients	Oat Oil, Jojoba Oil\n✨ Face Facts Restore + Clarify Salicylic Acid Serum\nCategory: Serum\nBrand: Face Facts\n\n🌸 Description\nClarify and smooth blemish-prone and oily skin with this 2% Salicylic Acid serum.\n\nThis clarifying serum is formulated with 2% Salicylic Acid (BHA) to gently exfoliate and smooth the skin\'s appearance and texture. It helps unclog pores, reduce breakouts, and control excess oil production, making it ideal for blemish-prone and oily skin types. Suitable for AM and PM use.\n\nSize: 30ml / 1.01 fl.oz.\n\n🌿 Key Ingredients\nIngredient	Benefit\n2% Salicylic Acid (BHA)	A beta-hydroxy acid that penetrates deep into pores to unclog and reduce breakouts, while gently exfoliating the skin\'s surface\nSoothing Agents	Help calm and comfort the skin during the exfoliation process\n🧴 How to Use\nCleanse your face thoroughly.\n\nApply a small amount to clean, dry skin.\n\nGently massage into the face, avoiding the eye area.\n\nAllow to absorb before applying moisturizer.\n\nUse in the morning and evening for best results.\n\nPro Tip: Start by using it once daily to build tolerance. Always apply a sunscreen during the day, as Salicylic Acid can increase sun sensitivity.\n\n✨ Key Benefits\n🎯 Clarifies Skin: Helps smooth skin\'s appearance and texture\n\n🧹 Unclogs Pores: Salicylic Acid penetrates pores to reduce breakouts\n\n💧 Controls Oil: Helps manage excess sebum production\n\n🧴 Suitable for AM/PM: Gentle enough for twice-daily use\n\n🌱 Vegan Formula: Cruelty-free and vegan\n\n⚠️ Caution\nFor external use only\n\nAvoid contact with eyes\n\nDiscontinue use if irritation occurs\n\nUse sunscreen during the day as Salicylic Acid may increase sun sensitivity\n\nPatch test before full use\n\n🥛 Blemish Care Full Moisturising White Milk Lotion\nCategory: Body Lotion\nBrand: Blemish Care\n\n🌸 Description\nExtra strength whitening and UV lightening formula for a radiant, even complexion.\n\nThis full moisturising white milk lotion is formulated with an extra strength whitening and UV lightening formula. It works to strengthen marks and provides a clearing specialist solution for a brighter, more even skin tone. The lightweight, fast-absorbing formula delivers deep hydration while targeting dark spots and uneven skin.\n\nSize: 350ml\n\n🌿 Key Ingredients\nIngredient	Benefit\nWhitening Agents	Help lighten dark spots and even skin tone\nUV Lightening Formula	Provides protection against UV damage\nMoisturising Ingredients	Deeply hydrate and nourish the skin\n🧴 How to Use\nApply generously to clean, dry skin. Massage gently until fully absorbed. Use daily for best results.\n\n✨ Key Benefits\n✨ Extra Strength Whitening: Helps lighten and brighten the skin\n\n☀️ UV Protection: Lightening formula helps protect against UV damage\n\n💧 Deep Moisturisation: Nourishes and hydrates the skin\n\n🎯 Clearing Specialist: Targets dark spots and uneven skin tone\n\n⚠️ Caution\nFor external use only\n\nAvoid contact with eyes\n\nDiscontinue use if irritation occurs\n\n💧 D-Cure Stretch Marks Healing Oil\nCategory: Body Oil\nBrand: D-Cure\n\n🌸 Description\nTarget and reduce the appearance of stretch marks with this healing oil.\n\nThis stretch marks eraser oil is formulated with Centella Asiatica and Aloe Vera to help reduce the appearance of stretch marks while soothing and nourishing the skin. The powerful combination of ingredients works to improve skin elasticity and promote a smoother, more even skin texture.\n\n🌿 Key Ingredients\nIngredient	Benefit\nCentella Asiatica	A skin-soothing herb that promotes wound healing and helps improve skin elasticity\nAloe Vera	Hydrates, soothes, and calms the skin\nHealing Oils	Nourish and improve skin texture\n🧴 How to Use\nApply to affected areas and gently massage in circular motions until fully absorbed. Use twice daily for best results.\n\n✨ Key Benefits\n🎯 Reduces Stretch Marks: Helps fade the appearance of existing stretch marks\n\n🔄 Improves Elasticity: Centella Asiatica promotes skin elasticity\n\n💧 Deep Nourishment: Aloe Vera and oils hydrate and soothe the skin\n\n🧴 Targeted Treatment: Designed specifically for stretch mark reduction\n\n⚠️ Caution\nFor external use only\n\nAvoid contact with eyes\n\nKeep out of reach of children\n\n💧 Olay Vitamin C 24HR Moisturizing Body Wash\nCategory: Body Wash\nBrand: Olay\n\n🌸 Description\nIndulge in a luxurious body wash that hydrates instantly for visibly radiant skin.\n\nThis rich, fast-absorbing formula is enriched with Vitamin C and Niacinamide (Vitamin B3) to cleanse, nourish, and hydrate your skin for 24 hours. The premium formula leaves skin feeling soft, silky, and beautifully radiant with every shower. Backed by 60 years of beauty science.\n\nSize: 591ml (20 FL OZ)\n\nKey Ingredients:\nWater, Petrolatum, Sodium Trideceth Sulfate, Sodium Chloride, Cocamidopropyl Betaine, Niacinamide (Vitamin B3), Ascorbic Acid (Vitamin C), Sodium Citrate, Guar Hydroxypropyltrimonium Chloride, Sodium Benzoate, Citric Acid, Disodium EDTA .\n\n🧴 How to Use\nApply to a wet washcloth, loofah, or hands. Massage onto skin to create a rich lather. Rinse thoroughly. Use daily for best results.\n\n✨ Key Benefits\n💧 24HR Hydration: Instantly hydrates for beautiful, healthy-looking skin\n\n✨ Visibly Radiant: Leaves skin looking vibrant and glowing\n\n🌿 Nourishing Formula: Enriched with Vitamin C and Niacinamide\n\n🧴 Premium Body Wash: Rich, fast-absorbing formula for soft, silky skin\n\n🔬 Expert Formulation: Backed by 60 years of Olay beauty science\n\n⚠️ Caution\nFor external use only\n\nAvoid contact with eyes\n\n🏷️ Product Details\nDetail	Information\nSize	591ml (20 FL OZ)\nKey Ingredients	Vitamin C, Vitamin B3 (Niacinamide)\nBenefits	Hydrating, Nourishing, Brightening\n🌙 Blemish Care Exfoliating Korean Full Moon Intense Whitening Mask\nCategory: Face Mask\nBrand: Blemish Care\n\n🌸 Description\nExperience natural fairness and anti-aging with this exfoliating intense whitening mask.\n\nInspired by Korean skincare rituals, this full moon mask is formulated with Gold Dust, Turmeric, and Almond to exfoliate, brighten, and nourish the skin. The powerful combination of ingredients works to promote natural fairness while fighting signs of aging for a radiant, glowing complexion.\n\nSize: 1000ml / 33.8 FL. OZ.\n\n🌿 Key Ingredients\nIngredient	Benefit\nGold Dust	Helps brighten and add radiance to the skin\nTurmeric	Powerful antioxidant that evens skin tone and reduces pigmentation\nAlmond	Nourishes and softens the skin\n🧴 How to Use\nApply a generous layer to clean, dry skin. Leave on for 15-20 minutes. Gently exfoliate while rinsing off with lukewarm water. Use 1-2 times a week.\n\n✨ Key Benefits\n🌙 Intense Whitening: Promotes natural fairness and brightness\n\n🛡️ Anti-Aging: Helps fight signs of aging\n\n🧹 Gentle Exfoliation: Removes dead skin cells for smoother skin\n\n✨ Radiant Glow: Leaves skin looking luminous and healthy\n\n⚠️ Caution\nFor external use only\n\nAvoid contact with eyes\n\nPatch test before full use\n\nUse sunscreen as exfoliating ingredients may increase sun sensitivity\n\n🧴 Advanced Korean Skin Bright & Clear Body Gel Wash\nCategory: Body Wash\nBrand: Advanced Korean Skin\n\n🌸 Description\nLuxury Korean skincare for your body.\n\nThis body gel wash is formulated to brighten and clarify your skin, leaving it fresh, clean, and radiant. Enriched with Korean skin-loving ingredients, it provides a gentle yet effective cleanse.\n\nSize: 1200ml / 42.3 FL.OZ.\n\n🌿 Key Ingredients\nIngredient	Benefit\nKorean Botanical Extracts	Gently cleanse and nourish the skin\nBrightening Agents	Help even skin tone and promote radiance\n🧴 How to Use\nApply to wet skin, massage gently, and rinse thoroughly. Use daily for best results.\n\n✨ Key Benefits\n✨ Brightens and clarifies the skin\n\n🧴 Gentle yet effective cleanse\n\n💧 Leaves skin fresh and radiant\n\n⚠️ Caution\nFor external use only\n\nAvoid contact with eyes\n\n🏷️ Product Details\nDetail	Information\nSize	1200ml / 42.3 FL.OZ.\nKey Benefits	Brightening, Clarifying\n✨ Duchess Glow Gluta Berry Vitamin Collagen Shower Gel\nCategory: Body Wash / Shower Gel\nBrand: DUCHESS GLOW\n\n🌸 Description\nExtra whitening shower gel for a radiant, glowing complexion.\n\nThis shower gel is formulated with Glutathione, Berry Extract, and Collagen to provide extra whitening and brightening benefits. The gentle, nourishing formula helps promote an even, luminous skin tone while leaving your skin feeling soft and refreshed.\n\nSize: 1000ml / 33.8 fl.oz.\n\n🌿 Key Ingredients\nIngredient	Benefit\nGlutathione	A powerful antioxidant that helps brighten and even skin tone\nBerry Extract	Rich in vitamins and antioxidants for skin nourishment\nCollagen	Helps improve skin elasticity and firmness\nKojic Acid	A natural skin-lightening agent that helps fade dark spots\n🧴 How to Use\nApply to wet skin, massage gently, and rinse thoroughly. Use daily for best results.\n\n✨ Key Benefits\n✨ Extra Whitening: Helps brighten and even skin tone\n\n🛡️ Antioxidant Protection: Glutathione and berries protect against free radicals\n\n💧 Nourishing: Collagen helps improve skin elasticity\n\n🧴 Gentle Formula: Suitable for daily use\n\n⚠️ Caution\nFor external use only\n\nAvoid contact with eyes\n\n🧴 Clini-tone Mild Lightening Glutathione Enriched Body Wash\nCategory: Body Wash\nBrand: Clini-tone\n\n🌸 Description\nA mild, glutathione-enriched body wash for an all-over glow.\n\nThis gentle body wash is formulated with Glutathione to help lighten and brighten the skin. Enriched with a vanilla scent, it nourishes and moisturizes while providing a radiant, all-over glow. Suitable for all skin types.\n\nSize: 100ml\n\n🌿 Key Ingredients\nIngredient	Benefit\nGlutathione	A powerful antioxidant that helps lighten and brighten skin\nNourishing Ingredients	Help hydrate and soften the skin\nVanilla	Provides a pleasant, soothing fragrance\n🧴 How to Use\nApply to wet skin, massage gently, and rinse thoroughly. Use daily for best results.\n\n✨ Key Benefits\n✨ Lightening: Glutathione-enriched for all-over brightening\n\n💧 Mild & Gentle: Suitable for all skin types\n\n🧴 Nourishing: Leaves skin feeling soft and smooth\n\n🌿 Glow-Boosting: Promotes a radiant, even complexion\n\n⚠️ Caution\nFor external use only\n\nAvoid contact with eyes\n\n🏷️ Product Details\nDetail	Information\nSize	100ml\nSkin Type	All skin types\nScent	Vanilla\nKey Benefit	Lightening, Brightening, Glow-boosting\n🌿 SKIN1004 Madagascar Centella Asiatica\nCategory: Skincare Ingredient\nBrand: SKIN1004\n\n🌸 Description\nPure Centella Asiatica from Madagascar.\n\nSourced from the pristine island of Madagascar, this powerful skincare ingredient is known for its soothing, healing, and skin-repairing properties. Centella Asiatica is a cornerstone of Korean skincare, celebrated for its ability to calm irritated skin, promote wound healing, and support a healthy skin barrier.\n\n✨ Key Benefits\n🌿 Soothes Irritation: Calms and comforts sensitive or reactive skin\n\n🔄 Promotes Healing: Supports skin repair and regeneration\n\n🧴 Strengthens Skin Barrier: Helps maintain a healthy, resilient skin barrier\n\n💧 Hydrates and Nourishes: Provides deep hydration and nourishment\n\n🌸 Dr. Althea 345 Relief Cream\nCategory: Moisturizer / Cream\nBrand: Dr. Althea\n\n🌸 Description\nA soothing, lightweight moisturizer designed to calm blemishes and restore skin health. \n\nThis vegan, fragrance-free cream is formulated with Niacinamide (10,000ppm), Panthenol (10,000ppm), and Opuntia Ficus-Indica (Prickly Pear) Stem Extract. It provides deep hydration, helps fade dark spots, and calms redness. Its multi-layered gel-cream texture absorbs instantly for a non-greasy finish, making it ideal for all skin types, especially blemish-prone and sensitive skin .\n\nSize: 50ml (1.7 fl oz)\n\nKey Ingredients:\nWater, Propanediol, Glycerin, Niacinamide, Caprylic/Capric Triglyceride, Panthenol, Sodium Hyaluronate, Opuntia Ficus-Indica Stem Extract, Centella Asiatica Leaf Extract, Houttuynia Cordata Extract, Beta-Glucan, Resveratrol, Ceramide NP .\n\n🧴 How to Use\nAfter cleansing and toning, apply a small amount.\n\nGently massage into the skin until fully absorbed.\n\nUse morning and evening as the final step of your routine .\n\n✨ Key Benefits\n🌿 Soothes Irritation: Calms redness and sensitivity .\n\n✨ Targets Blemishes: Niacinamide and plant extracts reduce dark spots and even skin tone .\n\n💧 Deep Hydration: Hyaluronic acid and Panthenol provide long-lasting moisture .\n\n🏷️ Product Details\nDetail	Information\nSize	50ml (1.7 fl oz)\nSkin Type	All, especially sensitive/blemish-prone \nFeatures	Vegan, Fragrance-free, Oil-free, Non-comedogenic\n👁️ Mary & May Glutathione Eye Cream\nCategory: Eye Cream\nBrand: Mary & May\n\n🌸 Description\nAn intensive brightening eye cream to combat dark circles and dull skin around the eyes.\n\nThis functional eye cream combines 1,000ppm of Tranexamic Acid and 1,000ppm of Glutathione to effectively brighten dark circles and prevent blemishes from forming. With added Vitamin C, Niacinamide, and Panthenol, it stimulates collagen production, soothes the skin, and improves uneven skin tone . This formula is dermatologically tested and free from 16 harmful ingredients, making it a gentle yet powerful choice for the delicate eye area. It comes as a special set with a free gift of 24g .\n\nSize: 30g + 24g (Special Set)\n\nKey Ingredients:\nWater, Ethylhexyl Palmitate, Glycerin, Niacinamide, Beeswax, Tranexamic Acid (1,000ppm), Betaine, Glutathione (1,000ppm), Panthenol, Hippophae Rhamnoides (Sea Buckthorn) Fruit Oil, Adenosine, Sodium Hyaluronate, Ascorbic Acid (Vitamin C) .\n\n🧴 How to Use\nTake a small, pearl-sized amount.\n\nGently pat and smooth around the eye area using your ring finger.\n\nUse in the morning and evening as part of your skincare routine .\n\n✨ Key Benefits\n✨ Brightens Dark Circles: Tranexamic Acid and Glutathione target pigmentation .\n\n🧴 Improves Skin Tone: Niacinamide and Vitamin C promote a more even complexion.\n\n💧 Soothes and Hydrates: Panthenol and Sea Buckthorn Oil nourish the skin.\n\n🏷️ Product Details\nDetail	Information\nSize	30g + 24g (Special Set)\nKey Concerns	Dark circles, uneven skin tone, freckles\nFeatures	Dermatologically tested, EWG green grade, free from 16 harmful ingredients\n',NULL,NULL,NULL,200.00,200.00,'',NULL,NULL,'4e5c1f50-c6b4-4738-82f0-58b206e285d0',NULL,0,0,1,0,1,NULL,NULL,NULL,NULL,0,0,0,'2026-07-30 09:55:55.500','2026-07-30 09:55:55.500'),('1565f0ab-b1f4-492e-af65-0cce1d6bd969',' AmLactin Daily Nourish 12% Lactic Acid Lotion','amlactin-daily-nourish-12percent-lactic-acid-lotion','Clinically proven hydration and gentle exfoliation. This moisturizing lotion contains 12% lactic acid that boosts the skin\'s natural renewal process through gentle exfoliation. Use daily to reveal softer, smoother, and more radiant skin. Fragrance-free, paraben-free, and non-greasy. Size: 225g / 7.9 oz.\n',NULL,NULL,NULL,300.00,350.00,'',NULL,NULL,'fbe24419-da5d-4055-9574-bc4b6999a1e3',NULL,0,0,1,0,1,NULL,NULL,NULL,NULL,0,0,0,'2026-07-30 09:55:56.743','2026-07-30 09:55:56.743'),('1694ddf7-adeb-4bae-8bc1-78d9e9340669','Blemish Care Malaysian White Wash (Walnut Scrub)','blemish-care-malaysian-white-wash-walnut-scrub','A natural organic formula for deep cleansing. This walnut scrub shower bath is formulated with natural ingredients to provide gentle exfoliation while cleansing the skin. It helps remove dead skin cells and impurities, leaving your skin feeling refreshed and revitalized. Size: 100ml / 3.3 fl.oz.\n',NULL,NULL,NULL,250.00,279.00,'',NULL,NULL,'bc983437-4e46-4718-ab40-30bc67c218dd',NULL,0,0,1,0,1,NULL,NULL,NULL,NULL,0,0,0,'2026-07-30 09:55:57.934','2026-07-30 09:55:57.934'),('16e34433-a6a2-4627-8b62-0af0af92a1c9',' Morrocan Argan Essential Oils Vitamin C Whitening & Glowing Oil','morrocan-argan-essential-oils-vitamin-c-whitening-and-glowing-oil','A powerful 7x whitening oil for face and body. This lightweight oil is formulated with essential oils and Vitamin C to whiten, brighten, and repair damaged skin. Infused with SPF 45, it helps protect against UV damage while stopping the appearance of aging. Size: 320ml / 11.8 fl.oz.\n',NULL,NULL,NULL,200.00,250.00,'',NULL,NULL,'4e5c1f50-c6b4-4738-82f0-58b206e285d0',NULL,0,0,1,0,1,NULL,NULL,NULL,NULL,0,0,0,'2026-07-30 09:55:58.953','2026-07-30 09:55:58.953'),('1c0bed7c-2f82-4035-9c9e-325b87e98ca1',' Blemish Care Carrot Pure Malaysian Glow Body Lotion','blemish-care-carrot-pure-malaysian-glow-body-lotion','Comprehensive care for a bountiful glow. This body lotion is formulated with carrot extract to provide extra cleansing and UV protection. Infused with SPF 50, it helps protect your skin from harmful UV rays while toning and brightening for a flawless, radiant glow. Size: 30ml.\n',NULL,NULL,NULL,250.00,198.00,'',NULL,NULL,'fbe24419-da5d-4055-9574-bc4b6999a1e3',NULL,0,0,1,0,1,NULL,NULL,NULL,NULL,0,0,0,'2026-07-30 09:55:59.900','2026-07-30 09:55:59.900'),('20f9b75e-e020-43d0-97f9-b1bcc34f49c8','Guanjing Rice Toner','guanjing-rice-toner','The essence of luminous skin. This rice toner is formulated to improve skin elasticity, lift fine lines, and even skin tone. With a pH of 5.5, it\'s a non-alcoholic, mineral oil-free formula that hydrates and refines the skin for a smoother, more youthful appearance.\n',NULL,NULL,NULL,250.00,200.00,'',NULL,NULL,'22ea5e3f-8b49-404c-a87f-8f4ecf7275db',NULL,0,0,1,0,1,NULL,NULL,NULL,NULL,0,0,0,'2026-07-30 09:56:01.599','2026-07-30 09:56:01.599'),('248d96de-9d60-415a-8ca6-6f26ba7ea1f8','Skin By Zaron Vitamin C Body Wash','skin-by-zaron-vitamin-c-body-wash','A soothing, creamy body wash that cleanses, brightens, and moisturizes for visibly healthier-looking skin.\n\nInfused with Vitamin C, Glycolic Acid, and Castor Oil, this formula works to exfoliate and nourish, taking away dullness and leaving your skin smoother, brighter, and more radiant . This rich-lathering body wash is suitable for all skin types and offers a multi-action approach to daily cleansing .\n\nSize: 50g (1.7oz)',NULL,NULL,NULL,250.00,300.00,'',NULL,NULL,'1111137a-3f93-4d3d-ac83-bb41ec8015fb',NULL,0,0,1,0,1,NULL,NULL,NULL,NULL,0,0,0,'2026-07-30 09:56:02.255','2026-07-30 09:56:02.255'),('277f1a08-ac67-4fca-8bb1-dd940d7fd6a0',' Retin-A Treatment Soap','retin-a-treatment-soap','A prescription-strength treatment soap. Formulated with Retinoid 0.5mg, this soap is designed to treat various skin concerns. Dispensed by pharmacies on doctor\'s prescription. Net wt: 100g.\n',NULL,NULL,NULL,250.00,250.00,'',NULL,NULL,'086f2586-4d0e-4d56-8465-da6e55a94f9c',NULL,0,0,1,0,1,NULL,NULL,NULL,NULL,0,0,0,'2026-07-30 09:56:03.021','2026-07-30 09:56:03.021'),('2a215aea-68b0-4bd1-9028-0e5278cfb47b','☕Coffee & Coconut Whitening Scrub','coffee-and-coconut-whitening-scrub','A powerful 100% original coffee and coconut whitening scrub for face and body.\n\nThis invigorating scrub is formulated to target multiple skin concerns including spider veins, wrinkles, green veins, age spots, stretch marks, cellulite, dark spots, and pimples. The natural exfoliating properties of coffee grounds combined with nourishing coconut help smooth and brighten the skin.',NULL,NULL,NULL,240.00,290.00,'',NULL,NULL,'086f2586-4d0e-4d56-8465-da6e55a94f9c',NULL,0,0,1,0,1,NULL,NULL,NULL,NULL,0,0,0,'2026-07-30 09:56:04.667','2026-07-30 09:56:04.667'),('3e64e70d-e100-41cb-a1c7-a5811cf35eb1',' Turmeric Super Whitening Soap','turmeric-super-whitening-soap','Rich in turmeric extracts for fairer, brighter skin. This super whitening soap is formulated to quickly and effectively clean the skin while deeply replenishing and whitening. It solves various skin problems including acne marks, spots, wrinkles, dark knuckles, dark armpits, and dark spots. Net: 250g.\n',NULL,NULL,NULL,250.00,250.00,'',NULL,NULL,'086f2586-4d0e-4d56-8465-da6e55a94f9c',NULL,0,0,1,0,1,NULL,NULL,NULL,NULL,0,0,0,'2026-07-30 09:56:05.732','2026-07-30 09:56:05.732'),('42c54f7f-96bc-496c-bd7b-5b1d079511c6','Beleclat Kenacol','beleclat-kenacol','A premium Belgian skincare solution. This topical solution is designed to be mixed with your daily cleansing milk for enhanced skincare benefits. The 30ml bottle offers a concentrated formula that helps improve skin texture and appearance. Made in Belgium.\n',NULL,NULL,NULL,248.00,250.00,'',NULL,NULL,'086f2586-4d0e-4d56-8465-da6e55a94f9c',NULL,0,0,1,0,1,NULL,NULL,NULL,NULL,0,0,0,'2026-07-30 09:56:06.742','2026-07-30 09:56:06.742'),('48e08366-01e7-40db-8014-0f66c234eba2',' Face Facts Glow + Resurface Lactic Acid AHA Serum','face-facts-glow-resurface-lactic-acid-aha-serum','A gentle exfoliating serum for smoother, brighter skin. \n\nThis lightweight serum is powered by 3% Lactic Acid, a gentle alpha-hydroxy acid (AHA), to gently buff away dead skin cells and retexturise the skin . Formulated with calming Aloe Vera and Peach extract, it helps to refine skin texture, improve uneven skin tone, and promote a radiant, glowing complexion . This vegan formula is suitable for all skin types, especially for those concerned with dullness or uneven skin texture .\n\nSize: 30ml / 1.01 fl. oz.\n\n',NULL,NULL,NULL,250.00,250.00,'',NULL,NULL,'2db14e74-1537-46f7-9ce0-9ef941cb23d0',NULL,0,0,1,0,1,NULL,NULL,NULL,NULL,0,0,0,'2026-07-30 09:56:07.765','2026-07-30 09:56:07.765'),('4f25685f-59a0-4ce9-b093-6ae71187b73c','G Glow Soap','g-glow-soap','Experience hydrated, youthful skin with this glow-enhancing and spot-fading soap.\n\nThis multi-tasking beauty bar is designed to gently cleanse while helping to reveal a smoother, more radiant complexion. Its anti-aging formula works to fade dark spots and blemishes, promoting a more even and youthful skin tone with regular use. Perfect for daily use to maintain a clear, refreshed look.',NULL,NULL,NULL,100.00,100.00,'',NULL,NULL,'086f2586-4d0e-4d56-8465-da6e55a94f9c',NULL,0,0,1,0,1,NULL,NULL,NULL,NULL,0,0,0,'2026-07-30 09:56:08.767','2026-07-30 09:56:08.767'),('56464e50-cbe5-4d73-a1ef-2439310c578b',' LAIT SNAPTCHAT DIAMANT BLEU Body Milk','lait-snaptchat-diamant-bleu-body-milk','Intense nourishment for a luminous glow. This high whitening body milk is formulated with Glutathione, Collagen, and Kouji Carbutin to intensely nourish and brighten the skin. It works to promote a more even and radiant complexion all over the body.\n',NULL,NULL,NULL,250.00,280.00,'',NULL,NULL,'fbe24419-da5d-4055-9574-bc4b6999a1e3',NULL,0,0,1,0,1,NULL,NULL,NULL,NULL,0,0,0,'2026-07-30 09:56:10.534','2026-07-30 09:56:10.534'),('59799ae0-b0de-4f23-9808-6dc6e8c4cb07','Vitamin C Body Scrub','vitamin-c-body-scrub','Reveal fresh, healthy, and younger-looking skin with this antioxidant-rich body scrub.\n\nLoaded with Vitamin C and antioxidants, this deep exfoliating scrub works to stimulate blood flow and promote circulation while gently removing dead skin cells. The luxurious formula helps detoxify the body and improve skin hydration, leaving your skin feeling refreshed, renewed, and radiant.',NULL,NULL,NULL,250.00,290.00,'',NULL,NULL,'086f2586-4d0e-4d56-8465-da6e55a94f9c',NULL,0,0,1,0,1,NULL,NULL,NULL,NULL,0,0,0,'2026-07-30 09:56:11.732','2026-07-30 09:56:11.732'),('663fcea3-7b3f-447f-a5c6-b5cf52db0a8f',' SKIN1004 Madagascar Centella Asiatica','skin1004-madagascar-centella-asiatica','Pure Centella Asiatica from Madagascar.\n\nSourced from the pristine island of Madagascar, this powerful skincare ingredient is known for its soothing, healing, and skin-repairing properties. Centella Asiatica is a cornerstone of Korean skincare, celebrated for its ability to calm irritated skin, promote wound healing, and support a healthy skin barrier.',NULL,NULL,NULL,230.00,250.00,'',NULL,NULL,'98836f15-1be2-43f5-a63a-021bb5970b38',NULL,0,0,1,0,1,NULL,NULL,NULL,NULL,0,0,0,'2026-07-30 09:56:12.977','2026-07-30 09:56:12.977'),('680fe692-0154-49dc-afc5-b2cb83deff0b',' Niu Skin Total Effects Platinum White Face Essence Lotion','niu-skin-total-effects-platinum-white-face-essence-lotion','A complete brightening and whitening solution. This face essence lotion is formulated with Alpha Arbutin, Niacinamide, and Vitamin C to brighten and whiten the skin. Enriched with plant extracts and Hyaluronic Acid, it soothes and hydrates while providing SPF 20 sun protection. Size: 50ml / 1.7 Fl.Oz.\n',NULL,NULL,NULL,250.00,200.00,'',NULL,NULL,'bc983437-4e46-4718-ab40-30bc67c218dd',NULL,0,0,1,0,1,NULL,NULL,NULL,NULL,0,0,0,'2026-07-30 09:56:13.544','2026-07-30 09:56:13.544'),('6bb5222a-1dfc-4a4d-999c-ce6a0d051c13','Good Molecules Discoloration Correcting Serum','good-molecules-discoloration-correcting-serum','Targeted correction for a perfectly balanced complexion. This potent serum is specifically designed to target hyperpigmentation, dark spots, acne scars, and melasma. . It utilizes an advanced form of tranexamic acid (2% TeraCeutic TXVector) and 4% Niacinamide to visibly improve the appearance of uneven skin tone and texture. The lightweight formula is free from fragrance, PEGs, mineral oils, and alcohol ',NULL,NULL,NULL,250.00,280.00,'',NULL,NULL,'2db14e74-1537-46f7-9ce0-9ef941cb23d0',NULL,0,0,1,0,1,NULL,NULL,NULL,NULL,0,0,0,'2026-07-30 09:56:14.644','2026-07-30 09:56:14.644'),('6c0f9788-8d9a-4116-b4db-1cd73175bb5d',' Duchess Glow Gluta Berry Vitamin Collagen Shower Gel','duchess-glow-gluta-berry-vitamin-collagen-shower-gel','Extra whitening shower gel for a radiant, glowing complexion.\n\nThis shower gel is formulated with Glutathione, Berry Extract, and Collagen to provide extra whitening and brightening benefits. The gentle, nourishing formula helps promote an even, luminous skin tone while leaving your skin feeling soft and refreshed.\n\nSize: 1000ml / 33.8 fl.oz.',NULL,NULL,NULL,230.00,230.00,'',NULL,NULL,'1111137a-3f93-4d3d-ac83-bb41ec8015fb',NULL,0,0,1,0,1,NULL,NULL,NULL,NULL,0,0,0,'2026-07-30 09:56:15.556','2026-07-30 09:56:15.556'),('7157acfb-68bc-4660-9740-5bac496e4c76','Face Facts Nourish+ Ceramide Restore Serum','face-facts-nourish-ceramide-restore-serum','Soothe, protect, and hydrate stressed skin. This nourishing serum is formulated with 3 Ceramides to restore and protect the skin barrier. It soothes and hydrates dehydrated skin, promoting a healthier, more resilient complexion. Suitable for AM and PM use. Vegan. Size: 30ml / 1.01 fl.oz.\n',NULL,NULL,NULL,250.00,225.00,'',NULL,NULL,'2db14e74-1537-46f7-9ce0-9ef941cb23d0',NULL,0,0,1,0,1,NULL,NULL,NULL,NULL,0,0,0,'2026-07-30 09:56:16.855','2026-07-30 09:56:16.855'),('754d17fe-4953-41c4-bdba-a13183b80262','SKIN1004 Madagascar Centella Tone Brightening Capsule Ampoule','skin1004-madagascar-centella-tone-brightening-capsule-ampoule','Intensive care for extraordinary results. A potent ampoule made with pure Centella Asiatica from Madagascar. It is designed to deliver a tone-brightening boost while soothing and calming the skin. This concentrated treatment is your go-to for a radiant and healthy glow.\n',NULL,NULL,NULL,250.00,200.00,'',NULL,NULL,'6772f431-077b-43a8-b102-e67d6dc589c2',NULL,0,0,1,0,1,NULL,NULL,NULL,NULL,0,0,0,'2026-07-30 09:56:18.377','2026-07-30 09:56:18.377'),('7a1fdbbb-ee6d-4c20-b598-9f4e0e9489f5',' Dr. Newhar Rose Water Facial Toner','dr-newhar-rose-water-facial-toner','A refreshing and hydrating toner for your skin. This rose water facial toner is enriched with hydrating properties to soothe, refresh, and revitalize your skin. The gentle formula helps balance your skin\'s pH and prepares it for better absorption of subsequent products.\n',NULL,NULL,NULL,250.00,225.00,'',NULL,NULL,'22ea5e3f-8b49-404c-a87f-8f4ecf7275db',NULL,0,0,1,0,1,NULL,NULL,NULL,NULL,0,0,0,'2026-07-30 09:56:20.045','2026-07-30 09:56:20.045'),('819ee790-2ee9-4235-9cd1-2e96a6395b1d','Cos De BAHA AN Serum (Arbutin Niacinamide)','cos-de-baha-an-serum-arbutin-niacinamide','',NULL,NULL,NULL,250.00,280.00,'',NULL,NULL,'2db14e74-1537-46f7-9ce0-9ef941cb23d0',NULL,0,0,1,0,1,NULL,NULL,NULL,NULL,0,0,0,'2026-07-30 09:56:21.292','2026-07-30 09:56:21.292'),('82a8e154-9716-4cb4-b682-0437eeb6d972','FITGUM Extra Strength Apple Cider Vinegar Gummies','fitgum-extra-strength-apple-cider-vinegar-gummies','Extra strength apple cider vinegar gummies. This dietary supplement is a delicious and effective way to enjoy the natural benefits of apple cider vinegar, enhanced with beetroot, pomegranate, and vitamins B9 & B12. It contains 60 organic gummies.',NULL,NULL,NULL,199.00,230.00,'',NULL,NULL,'77566a51-bcd0-4b5c-a2df-01aaaf03938c',NULL,0,0,1,0,1,NULL,NULL,NULL,NULL,0,0,0,'2026-07-30 09:56:22.362','2026-07-30 09:56:22.362'),('85dff5f5-3033-4bf9-87c3-bfd62a03bcca','Estelin Rejuvenate Toner','estelin-rejuvenate-toner','The perfect prelude to radiance. This alkaline hydrating toner is formulated with Salicylic Acid and Lactobionic Acid to gently exfoliate and smooth skin texture. It works to reveal a glowing, more refined complexion, making it the ideal first step in your skincare routine.\n',NULL,NULL,NULL,250.00,300.00,'',NULL,NULL,'22ea5e3f-8b49-404c-a87f-8f4ecf7275db',NULL,0,0,1,0,1,NULL,NULL,NULL,NULL,0,0,0,'2026-07-30 09:56:23.967','2026-07-30 09:56:23.967'),('87c05c9e-2526-4b0c-9f75-1975f3f56938','Blemish Care Exfoliating Korean Full Moon Intense Whitening Mask','blemish-care-exfoliating-korean-full-moon-intense-whitening-mask','Experience natural fairness and anti-aging with this exfoliating intense whitening mask.\n\nInspired by Korean skincare rituals, this full moon mask is formulated with Gold Dust, Turmeric, and Almond to exfoliate, brighten, and nourish the skin. The powerful combination of ingredients works to promote natural fairness while fighting signs of aging for a radiant, glowing complexion.\n\nSize: 1000ml / 33.8 FL. OZ.',NULL,NULL,NULL,230.00,250.00,'',NULL,NULL,'7f925fd9-ba9b-4af6-92ac-131c928b7773',NULL,0,0,1,0,1,NULL,NULL,NULL,NULL,0,0,0,'2026-07-30 09:56:24.556','2026-07-30 09:56:24.556'),('8f113ddc-0a6c-41b9-a98e-3b3b39d04d55',' ESTELIN Rosehip Niacinamide Spots Fading Face Serum','estelin-rosehip-niacinamide-spots-fading-face-serum','A targeted solution for a clearer complexion. This serum is formulated with Rosehip and Niacinamide to help fade dark spots, acne blemishes, and age spots. It\'s designed to promote a more even, radiant skin tone.\n',NULL,NULL,NULL,250.00,200.00,'',NULL,NULL,'2db14e74-1537-46f7-9ce0-9ef941cb23d0',NULL,0,0,1,0,1,NULL,NULL,NULL,NULL,0,0,0,'2026-07-30 09:56:25.747','2026-07-30 09:56:25.747'),('9181e79a-dbef-407d-b11f-c83099b70bcb','Face Facts Firm+ Revitalise Polypeptide Serum','face-facts-firm-revitalise-polypeptide-serum','Target the signs of aging with powerful peptides. This firming serum is formulated with Polypeptides and Rice extract to smooth the appearance of fine lines and wrinkles. It revitalizes and firms the skin, promoting a more youthful and radiant complexion. Suitable for AM and PM use. Vegan. Size: 30ml / 1.01 fl.oz.\n',NULL,NULL,NULL,250.00,225.00,'',NULL,NULL,'2db14e74-1537-46f7-9ce0-9ef941cb23d0',NULL,0,0,1,0,1,NULL,NULL,NULL,NULL,0,0,0,'2026-07-30 09:56:27.445','2026-07-30 09:56:27.445'),('961d7f54-dccc-47a6-b30a-3370beb14d3d','Gana Sachi Plus Evening Primrose Oil','gana-sachi-plus-evening-primrose-oil','A powerful oil blend for overall wellness. This evening primrose oil supplement is enriched with Omega 3, 6, and 9, along with Almond, Walnut, Red Pine, and Aloe Vera extracts. It supports heart health, improves vision, helps stabilize blood pressure, and promotes healthier, more youthful skin.\n',NULL,NULL,NULL,350.00,400.00,'',NULL,NULL,'77566a51-bcd0-4b5c-a2df-01aaaf03938c',NULL,0,0,1,0,1,NULL,NULL,NULL,NULL,0,0,0,'2026-07-30 09:56:28.578','2026-07-30 09:56:28.578'),('962d41d7-33e0-4e76-9750-944a0ff537f4',' COSRX Advanced Snail 92 All in One Cream','cosrx-advanced-snail-92-all-in-one-cream','The final touch of perfection. This cream is formulated with 92% Snail Secretion Filtrate (Mucin) to deeply moisturize and repair the skin barrier. It helps naturally create a healthy, radiant glow while improving skin texture and elasticity. The perfect crowning step to your skincare symphony.\n',NULL,NULL,NULL,250.00,200.00,'',NULL,NULL,'30626755-2744-4244-989a-3b545eea922b',NULL,0,0,1,0,1,NULL,NULL,NULL,NULL,0,0,0,'2026-07-30 09:56:29.588','2026-07-30 09:56:29.588'),('9d503786-a100-4d6e-a6ce-0fd035dca587',' Niu Skin Bright & Clear Face Cream','niu-skin-bright-and-clear-face-cream','For beauty and love — your ultimate brightening cream. This face cream is formulated with Kojic Acid and plant extracts to brighten, fade dark spots, and even skin tone. It helps combat acne while promoting a clear, radiant complexion. Size: 50ml / 1.7 Fl Oz.\n',NULL,NULL,NULL,250.00,300.00,'',NULL,NULL,'30626755-2744-4244-989a-3b545eea922b',NULL,0,0,1,0,1,NULL,NULL,NULL,NULL,0,0,0,'2026-07-30 09:56:30.568','2026-07-30 09:56:30.568'),('a02f9b79-cf7c-4a50-b7aa-e4d1e18f36f6',' Dove Beauty Cream Bar','dove-beauty-cream-bar','Deep moisture for soft, nourished skin. This beauty cream bar is a 3-in-1 formula that cleanses, hydrates, and nourishes your skin. Dermatologically approved, it contains 100% plant-based nourishing actives and is suitable for face and body. Gentle enough for daily use. Net wt: 90g / 3.17 oz.\n',NULL,NULL,NULL,20.00,25.00,'',NULL,NULL,'086f2586-4d0e-4d56-8465-da6e55a94f9c',NULL,0,0,1,0,1,NULL,NULL,NULL,NULL,0,0,0,'2026-07-30 09:56:31.922','2026-07-30 09:56:31.922'),('a37e4c17-bbdc-4732-bf4a-511f130fae56',' Kojie-San Skin Lightening Soap','kojie-san-skin-lightening-soap','A trusted skin lightening soap. Formulated with Kojic Acid, this soap helps lighten dark spots, even skin tone, and promote a brighter complexion. A popular choice for those seeking effective skin lightening.\n',NULL,NULL,NULL,250.00,280.00,'',NULL,NULL,'086f2586-4d0e-4d56-8465-da6e55a94f9c',NULL,0,0,1,0,1,NULL,NULL,NULL,NULL,0,0,0,'2026-07-30 09:56:33.613','2026-07-30 09:56:33.613'),('a8cb6bf2-cab1-4f33-b853-4d78241bd4db',' DR.ALTHEA Gentle Vitamin C Serum','dralthea-gentle-vitamin-c-serum','A gentle daily boost of radiance. This serum is formulated with 20% Hippophae Rhamnoides (Sea Buckthorn) Fruit Water and Vitamin C to brighten and protect the skin. It\'s a gentle, effective formula for daily use, helping to promote a more luminous and even complexion.\n',NULL,NULL,NULL,250.00,280.00,'',NULL,NULL,'2db14e74-1537-46f7-9ce0-9ef941cb23d0',NULL,0,0,1,0,1,NULL,NULL,NULL,NULL,0,0,0,'2026-07-30 09:56:34.245','2026-07-30 09:56:34.245'),('aaeb1611-2a95-4b2f-9713-64c209201022',' Asantee Salt Spa Turmeric & Ginger Soap','asantee-salt-spa-turmeric-and-ginger-soap','Revitalize and rejuvenate your skin with natural herbal and fruit extracts. This unique salt spa soap is developed with Turmeric and Ginger to revitalize your skin, leaving your body looking and feeling fantastic. Use daily for a refreshed and glowing complexion. Net wt: 700ml.\n',NULL,NULL,NULL,250.00,300.00,'',NULL,NULL,'1111137a-3f93-4d3d-ac83-bb41ec8015fb',NULL,0,0,1,0,1,NULL,NULL,NULL,NULL,0,0,0,'2026-07-30 09:56:34.833','2026-07-30 09:56:34.833'),('ab800d6d-ffd3-4983-8de2-383e43c5e4e6','Cos De BAHA TT Serum (Tranexamic Acid)','cos-de-baha-tt-serum-tranexamic-acid','A serum formulated with 10% Tranexamic Acid. Comes in a 30ml / 1.0 fl oz bottle.Intensive care for extraordinary results. This potent serum is formulated with 10% Tranexamic Acid, a powerful ingredient for fading stubborn dark spots and hyperpigmentation. It\'s designed to deliver fast-acting, visible results for a clearer, more even-toned complexion',NULL,NULL,NULL,250.00,280.00,'',NULL,NULL,'2db14e74-1537-46f7-9ce0-9ef941cb23d0',NULL,0,0,1,0,1,NULL,NULL,NULL,NULL,0,0,0,'2026-07-30 09:56:35.655','2026-07-30 09:56:35.655'),('afe9da14-a101-411f-9fd4-50639127167e',' Asantee Carrot with Honey Soap','asantee-carrot-with-honey-soap','A nourishing lightening soap from Thailand. This herbal soap is formulated with Carrot Extract, Glutathione, and Vitamin C to detoxify acne, reduce wrinkles, and combat aging. It provides essential nutrients to the skin, leaving it clean, bright, and rejuvenated.\n',NULL,NULL,NULL,250.00,250.00,'',NULL,NULL,'086f2586-4d0e-4d56-8465-da6e55a94f9c',NULL,0,0,1,0,1,NULL,NULL,NULL,NULL,0,0,0,'2026-07-30 09:56:36.722','2026-07-30 09:56:36.722'),('b1dc0cd1-e11b-4fb2-ba23-57b96e2c99f3',' Clini-tone Mild Lightening Glutathione Enriched Body Wash','clini-tone-mild-lightening-glutathione-enriched-body-wash','A mild, glutathione-enriched body wash for an all-over glow.\n\nThis gentle body wash is formulated with Glutathione to help lighten and brighten the skin. Enriched with a vanilla scent, it nourishes and moisturizes while providing a radiant, all-over glow. Suitable for all skin types.',NULL,NULL,NULL,220.00,240.00,'',NULL,NULL,'1111137a-3f93-4d3d-ac83-bb41ec8015fb',NULL,0,0,1,0,1,NULL,NULL,NULL,NULL,0,0,0,'2026-07-30 09:56:37.690','2026-07-30 09:56:37.690'),('b23e1f60-9fff-4d88-9f13-da6165c7f2c5','Advanced Korean Skin Bright & Clear Body Gel Wash','advanced-korean-skin-bright-and-clear-body-gel-wash','Luxury Korean skincare for your body. This body gel wash is formulated to brighten and clarify your skin, leaving it fresh, clean, and radiant. Enriched with Korean skin-loving ingredients, it provides a gentle yet effective cleanse. Size: 1200ml / 42.3 FL.OZ.\n',NULL,NULL,NULL,250.00,299.00,'',NULL,NULL,'1111137a-3f93-4d3d-ac83-bb41ec8015fb',NULL,0,0,1,0,1,NULL,NULL,NULL,NULL,0,0,0,'2026-07-30 09:56:38.914','2026-07-30 09:56:38.914'),('b2f09fd7-9353-40be-8f2a-8d55afd53edc',' JUMISO Snail Mucin 95 Peptide Facial Essence','jumiso-snail-mucin-95-peptide-facial-essence','The soul of Korean skincare. This essence is formulated with 95% Snail Secretion Filtrate and Peptides to deeply moisturize and improve skin texture. Non-comedogenic and packed with skin-loving ingredients, it\'s a luxurious step to achieving a dewy, plump, and impossibly radiant complexion.\n',NULL,NULL,NULL,250.00,200.00,'',NULL,NULL,'bc983437-4e46-4718-ab40-30bc67c218dd',NULL,0,0,1,0,1,NULL,NULL,NULL,NULL,0,0,0,'2026-07-30 09:56:39.824','2026-07-30 09:56:39.824'),('b3bafd62-961b-4fe6-a70b-3fa28c66516a',' Advanced Korean Skin Bright & Clear Body Gel Wash','advanced-korean-skin-bright-and-clear-body-gel-wash-704vwj','Luxury Korean skincare for your body.\n\nThis body gel wash is formulated to brighten and clarify your skin, leaving it fresh, clean, and radiant. Enriched with Korean skin-loving ingredients, it provides a gentle yet effective cleanse.\n\nSize: 1200ml / 42.3 FL.OZ.',NULL,NULL,NULL,200.00,205.00,'',NULL,NULL,'1111137a-3f93-4d3d-ac83-bb41ec8015fb',NULL,0,0,1,0,1,NULL,NULL,NULL,NULL,0,0,0,'2026-07-30 09:56:40.936','2026-07-30 09:56:40.936'),('b5aa739d-e20c-45bf-99ec-5bfe1def66c9','COSRX Centella Water Alcohol-Free Toner','cosrx-centella-water-alcohol-free-toner','The perfect prelude to radiance. A gentle, refreshing embrace for your skin after every cleanse. This alcohol free, spray type toner is formulated with 10% Centella Asiatica Leaf Water and 84.69% Jeju Mineral Water to calm and soothe irritated, sensitive skin . It restores your skin\'s natural pH balance, preps it for better absorption, and delivers a surge of hydration without any irritation.',NULL,NULL,NULL,250.00,280.00,'',NULL,NULL,'22ea5e3f-8b49-404c-a87f-8f4ecf7275db',NULL,0,0,1,0,1,NULL,NULL,NULL,NULL,0,0,0,'2026-07-30 09:56:41.469','2026-07-30 09:56:41.469'),('b7d29c19-ac79-413f-aca4-293f9ba295e4','The Ordinary Alpha Arbutin 2% + HA','the-ordinary-alpha-arbutin-2percent-ha','Visible brightening with deep hydration. This water-based serum is designed to target uneven skin tone and dark spots . It combines a high concentration of purified Alpha Arbutin, a known skin-brightening ingredient, with Hyaluronic Acid to support effective product absorption . A powerful, yet gentle formula for a more radiant and even complexion.',NULL,NULL,NULL,250.00,200.00,'',NULL,NULL,'2db14e74-1537-46f7-9ce0-9ef941cb23d0',NULL,0,0,1,0,1,NULL,NULL,NULL,NULL,0,0,0,'2026-07-30 09:56:42.556','2026-07-30 09:56:42.556'),('b8120dce-1269-4fa1-9842-334bcb39c261',' Fruiser Premium Double Moisturising Shower Cream (Goat\'s Milk & Papaya)','fruiser-premium-double-moisturising-shower-cream-goats-milk-and-papaya','Nourish and moisturize your skin with premium care. This double moisturising shower cream is formulated with Goat\'s Milk and Papaya to deeply nourish and hydrate your skin. It leaves your body feeling soft, smooth, and pampered with every shower.\n',NULL,NULL,NULL,200.00,219.00,'',NULL,NULL,'1111137a-3f93-4d3d-ac83-bb41ec8015fb',NULL,0,0,1,0,1,NULL,NULL,NULL,NULL,0,0,0,'2026-07-30 09:56:43.137','2026-07-30 09:56:43.137'),('c5cb6097-9eb8-4e82-afdc-042b269d62dc',' Glowing Secret Collagen Powder (Nourish + Glow)','glowing-secret-collagen-powder-nourish-glow','Nourish your beauty from within. This collagen powder is formulated with Hyaluronic Acid to support skin, hair, nails, joints, and gut health. The nourishing vanilla-flavored powder helps promote a healthy, glowing complexion from the inside out. Size: 454g / 1 lb.\n',NULL,NULL,NULL,250.00,280.00,'',NULL,NULL,'77566a51-bcd0-4b5c-a2df-01aaaf03938c',NULL,0,0,1,0,1,NULL,NULL,NULL,NULL,0,0,0,'2026-07-30 09:56:44.013','2026-07-30 09:56:44.013'),('c7d8f401-db84-435e-9a45-3886c6dbba78','Estelin  Repair Toner','estelin-repair-toner','A revitalizing first step to recovery. This toner is certified with Vitamin B5 to repair and enhance skin elasticity. It\'s a soothing formula that helps to restore and revitalize the skin, preparing it for the rest of your skincare routine.\n',NULL,NULL,NULL,280.00,250.00,'',NULL,NULL,'22ea5e3f-8b49-404c-a87f-8f4ecf7275db',NULL,0,0,1,0,1,NULL,NULL,NULL,NULL,0,0,0,'2026-07-30 09:56:45.291','2026-07-30 09:56:45.291'),('ca7c5ba5-d414-4359-ad36-4fec8205a511',' Face Facts Firm + Revitalise Collagen Serum','face-facts-firm-revitalise-collagen-serum','Improve your skin\'s youthful elasticity and firmness with our Collagen Serum. Formulated with restoring Collagen and nourishing Amino Acids, it gets to work on the visible signs of ageing, gently hydrating and renewing the skin\'s surface while helping to smooth fine lines . This revitalising serum is ideal for mature and aging skin, helping to restore a smoother, more radiant complexion . Suitable for daily use as part of a regular skincare routine .\n\nSize: 30ml / 1.01 fl. oz.\n\n',NULL,NULL,NULL,250.00,280.00,'',NULL,NULL,'2db14e74-1537-46f7-9ce0-9ef941cb23d0',NULL,0,0,1,0,1,NULL,NULL,NULL,NULL,0,0,0,'2026-07-30 09:56:45.812','2026-07-30 09:56:45.812'),('cb49dfad-4af0-43a5-94a7-f182017bf8a8',' Dr. Althea 345 Relief Cream','dr-althea-345-relief-cream','A soothing, lightweight moisturizer designed to calm blemishes and restore skin health. \n\nThis vegan, fragrance-free cream is formulated with Niacinamide (10,000ppm), Panthenol (10,000ppm), and Opuntia Ficus-Indica (Prickly Pear) Stem Extract. It provides deep hydration, helps fade dark spots, and calms redness. Its multi-layered gel-cream texture absorbs instantly for a non-greasy finish, making it ideal for all skin types, especially blemish-prone and sensitive skin .\n\nSize: 50ml (1.7 fl oz)',NULL,NULL,NULL,250.00,280.00,'',NULL,NULL,'30626755-2744-4244-989a-3b545eea922b',NULL,0,0,1,0,1,NULL,NULL,NULL,NULL,0,0,0,'2026-07-30 09:56:46.537','2026-07-30 09:56:46.537'),('cee016a1-b979-4823-9d32-8a22e750cd58','Juli Gold Halfcaste Oil','juli-gold-halfcaste-oil','A lightweight oil for radiant, moisturized skin. This moisturizing oil gives intense lightening moisture to your skin without feeling heavy. Apply directly to the skin at night for faster, visible results. Leaves your skin feeling soft, smooth, and luminous.\n',NULL,NULL,NULL,225.00,250.00,'',NULL,NULL,'4e5c1f50-c6b4-4738-82f0-58b206e285d0',NULL,0,0,1,0,1,NULL,NULL,NULL,NULL,0,0,0,'2026-07-30 09:56:47.813','2026-07-30 09:56:47.813'),('cfae249d-1720-4a4a-898a-2c1062a08fbb',' Face Facts Renew+ Radiance Retinol Serum','face-facts-renew-radiance-retinol-serum','Renew your skin\'s radiance with retinol. This serum is formulated with Retinol to target fine lines, uneven skin tone, and dry, thirsty skin. It works to renew the skin\'s surface, promoting a smoother, more radiant complexion. Suitable for AM and PM use. Vegan. Size: 30ml / 1.01 fl.oz.\n',NULL,NULL,NULL,250.00,280.00,'',NULL,NULL,'2db14e74-1537-46f7-9ce0-9ef941cb23d0',NULL,0,0,1,0,1,NULL,NULL,NULL,NULL,0,0,0,'2026-07-30 09:56:49.101','2026-07-30 09:56:49.101'),('d5b3d538-3579-47bb-85f1-b2a407593915',' Olay Vitamin C 24HR Moisturizing Body Wash','olay-vitamin-c-24hr-moisturizing-body-wash','Indulge in a luxurious body wash that hydrates instantly for visibly radiant skin.\n\nThis rich, fast-absorbing formula is enriched with Vitamin C and Niacinamide (Vitamin B3) to cleanse, nourish, and hydrate your skin for 24 hours. The premium formula leaves skin feeling soft, silky, and beautifully radiant with every shower. Backed by 60 years of beauty science.\n\nSize: 591ml (20 FL OZ)',NULL,NULL,NULL,250.00,200.00,'',NULL,NULL,'1111137a-3f93-4d3d-ac83-bb41ec8015fb',NULL,0,0,1,0,1,NULL,NULL,NULL,NULL,0,0,0,'2026-07-30 09:56:50.001','2026-07-30 09:56:50.001'),('d67f8ba1-d0be-4231-86c7-dbe25e4e429b',' Aqua Rich Hydrating Bright Vitamin Body Lotion','aqua-rich-hydrating-bright-vitamin-body-lotion','Luxury that reaches every inch of you. This hydrating and brightening body lotion is formulated with vitamins to drench your skin in lasting hydration while delivering a radiant glow. Silky, sensorial, and irresistibly nourishing—because your glow shouldn\'t stop at your neck.\n',NULL,NULL,NULL,250.00,280.00,'',NULL,NULL,'fbe24419-da5d-4055-9574-bc4b6999a1e3',NULL,0,0,1,0,1,NULL,NULL,NULL,NULL,0,0,0,'2026-07-30 09:56:50.535','2026-07-30 09:56:50.535'),('d89627b2-bb5d-40dc-a9a3-11a0eba72a89',' Extra Cool  Smooth as Silk® Toning Soap','extra-cool-smooth-as-silkr-toning-soap','A cooling toning soap for a refreshing cleanse. This exfoliating soap helps fade dark spots, stretch marks, sunburn, skin infections, and acne blemishes. Leaves your skin feeling smooth and revitalized.\n',NULL,NULL,NULL,250.00,280.00,'',NULL,NULL,'086f2586-4d0e-4d56-8465-da6e55a94f9c',NULL,0,0,1,0,1,NULL,NULL,NULL,NULL,0,0,0,'2026-07-30 09:56:52.013','2026-07-30 09:56:52.013'),('dbd35e09-d70d-4002-b4fc-7feaddc3f0d7','D-Cure Stretch Marks Healing Oil','d-cure-stretch-marks-healing-oil','Target and reduce the appearance of stretch marks with this healing oil.\n\nThis stretch marks eraser oil is formulated with Centella Asiatica and Aloe Vera to help reduce the appearance of stretch marks while soothing and nourishing the skin. The powerful combination of ingredients works to improve skin elasticity and promote a smoother, more even skin texture.\n\n',NULL,NULL,NULL,180.00,200.00,'',NULL,NULL,'4e5c1f50-c6b4-4738-82f0-58b206e285d0',NULL,0,0,1,0,1,NULL,NULL,NULL,NULL,0,0,0,'2026-07-30 09:56:53.412','2026-07-30 09:56:53.412'),('e00420ed-a8bd-446e-8ac0-5281f55eb182','Niu Skin Glowing Body Wash','niu-skin-glowing-body-wash','Energize and refine your skin with every shower. This glowing body wash is formulated with Niacinamide, Vitamin C, and AHA to brighten, exfoliate, and refine your skin. Energizing and refreshing, it leaves your skin feeling clean, smooth, and radiant. Size: 800ml (27 fl oz).\n',NULL,NULL,NULL,200.00,200.00,'',NULL,NULL,'1111137a-3f93-4d3d-ac83-bb41ec8015fb',NULL,0,0,1,0,1,NULL,NULL,NULL,NULL,0,0,0,'2026-07-30 09:56:54.523','2026-07-30 09:56:54.523'),('e132791a-51f3-400a-8a5b-ad267e98a3d7','Face Facts Ceramide Skin Barrier Complex Blemish Gel Moisturiser','face-facts-ceramide-skin-barrier-complex-blemish-gel-moisturiser','Dual-action hydration for blemish-prone skin. This gel moisturizer is formulated with 5 Ceramides, Salicylic Acid, and Niacinamide to minimize the appearance of imperfections and excess sebum. It provides a hydrated, matte finish while strengthening the skin barrier. Fragrance-free and vegan. Size: 50ml / 1.69 fl.oz.\n',NULL,NULL,NULL,250.00,280.00,'',NULL,NULL,'30626755-2744-4244-989a-3b545eea922b',NULL,0,0,1,0,1,NULL,NULL,NULL,NULL,0,0,0,'2026-07-30 09:56:55.445','2026-07-30 09:56:55.445'),('e47df837-f94e-44f4-8efd-677e10bd992a',' White Blinks Premium Pearl Powder Cereal (Collagen + Astaxanthin + Stem Cell)','white-blinks-premium-pearl-powder-cereal-collagen-astaxanthin-stem-cell','The ultimate beauty supplement blend. This premium powder is formulated with Pearl Powder, Collagen, Astaxanthin, Stem Cell, and Bird Nest extracts. It works to support skin health, promote anti-aging, and enhance overall radiance. Gluten-free and packed with skin-loving nutrients.\n',NULL,NULL,NULL,300.00,350.00,'',NULL,NULL,'77566a51-bcd0-4b5c-a2df-01aaaf03938c',NULL,0,0,1,0,1,NULL,NULL,NULL,NULL,0,0,0,'2026-07-30 09:56:56.593','2026-07-30 09:56:56.593'),('ebccfa5b-6b35-4534-af01-d7674c8d823b','Mary & May Glutathione Eye Cream','mary-and-may-glutathione-eye-cream','An intensive brightening eye cream to combat dark circles and dull skin around the eyes.\n\nThis functional eye cream combines 1,000ppm of Tranexamic Acid and 1,000ppm of Glutathione to effectively brighten dark circles and prevent blemishes from forming. With added Vitamin C, Niacinamide, and Panthenol, it stimulates collagen production, soothes the skin, and improves uneven skin tone . This formula is dermatologically tested and free from 16 harmful ingredients, making it a gentle yet powerful choice for the delicate eye area. It comes as a special set with a free gift of 24g .\n\n',NULL,NULL,NULL,50.00,60.00,'',NULL,NULL,'30626755-2744-4244-989a-3b545eea922b',NULL,0,0,1,0,1,NULL,NULL,NULL,NULL,0,0,0,'2026-07-30 09:56:58.764','2026-07-30 09:56:58.764'),('f7e4b880-19cf-4080-bfeb-4c2dcc1f47c5','Blemish Care Full Moisturising White Milk Lotion','blemish-care-full-moisturising-white-milk-lotion','Extra strength whitening and UV lightening formula for a radiant, even complexion.\n\nThis full moisturising white milk lotion is formulated with an extra strength whitening and UV lightening formula. It works to strengthen marks and provides a clearing specialist solution for a brighter, more even skin tone. The lightweight, fast-absorbing formula delivers deep hydration while targeting dark spots and uneven skin.\n\nSize: 350ml',NULL,NULL,NULL,280.00,250.00,'',NULL,NULL,'fbe24419-da5d-4055-9574-bc4b6999a1e3',NULL,0,0,1,0,1,NULL,NULL,NULL,NULL,0,0,0,'2026-07-30 09:56:59.479','2026-07-30 09:56:59.479'),('fb2e2936-11a4-4e3b-8b37-c052e24c57b7',' Niu Skin Amino Acid Gentle Face Wash','niu-skin-amino-acid-gentle-face-wash','A gentle yet effective cleanser for all skin types. This amino acid face wash is formulated to provide a deep pore clean while mild exfoliating. It helps reduce acne and brighten the skin, leaving it feeling fresh and revitalized. Size: 100ml / 3.4 FL OZ.\n',NULL,NULL,NULL,250.00,280.00,'',NULL,NULL,'7f925fd9-ba9b-4af6-92ac-131c928b7773',NULL,0,0,1,0,1,NULL,NULL,NULL,NULL,0,0,0,'2026-07-30 09:57:00.268','2026-07-30 09:57:00.268');
/*!40000 ALTER TABLE `products` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `recently_viewed`
--

DROP TABLE IF EXISTS `recently_viewed`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `recently_viewed` (
  `id` varchar(191) COLLATE utf8mb4_unicode_ci NOT NULL,
  `userId` varchar(191) COLLATE utf8mb4_unicode_ci NOT NULL,
  `productId` varchar(191) COLLATE utf8mb4_unicode_ci NOT NULL,
  `viewedAt` datetime(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
  PRIMARY KEY (`id`),
  UNIQUE KEY `recently_viewed_userId_productId_key` (`userId`,`productId`),
  KEY `recently_viewed_productId_fkey` (`productId`),
  CONSTRAINT `recently_viewed_productId_fkey` FOREIGN KEY (`productId`) REFERENCES `products` (`id`) ON DELETE RESTRICT ON UPDATE CASCADE,
  CONSTRAINT `recently_viewed_userId_fkey` FOREIGN KEY (`userId`) REFERENCES `users` (`id`) ON DELETE CASCADE ON UPDATE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `recently_viewed`
--

LOCK TABLES `recently_viewed` WRITE;
/*!40000 ALTER TABLE `recently_viewed` DISABLE KEYS */;
/*!40000 ALTER TABLE `recently_viewed` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `referrals`
--

DROP TABLE IF EXISTS `referrals`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `referrals` (
  `id` varchar(191) COLLATE utf8mb4_unicode_ci NOT NULL,
  `referrerId` varchar(191) COLLATE utf8mb4_unicode_ci NOT NULL,
  `referredId` varchar(191) COLLATE utf8mb4_unicode_ci NOT NULL,
  `pointsAwarded` int NOT NULL DEFAULT '0',
  `createdAt` datetime(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
  PRIMARY KEY (`id`),
  KEY `referrals_referrerId_fkey` (`referrerId`),
  CONSTRAINT `referrals_referrerId_fkey` FOREIGN KEY (`referrerId`) REFERENCES `users` (`id`) ON DELETE RESTRICT ON UPDATE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `referrals`
--

LOCK TABLES `referrals` WRITE;
/*!40000 ALTER TABLE `referrals` DISABLE KEYS */;
/*!40000 ALTER TABLE `referrals` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `refresh_tokens`
--

DROP TABLE IF EXISTS `refresh_tokens`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `refresh_tokens` (
  `id` varchar(191) COLLATE utf8mb4_unicode_ci NOT NULL,
  `userId` varchar(191) COLLATE utf8mb4_unicode_ci NOT NULL,
  `token` varchar(512) COLLATE utf8mb4_unicode_ci NOT NULL,
  `expiresAt` datetime(3) NOT NULL,
  `createdAt` datetime(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
  PRIMARY KEY (`id`),
  UNIQUE KEY `refresh_tokens_token_key` (`token`),
  KEY `refresh_tokens_token_idx` (`token`),
  KEY `refresh_tokens_userId_fkey` (`userId`),
  CONSTRAINT `refresh_tokens_userId_fkey` FOREIGN KEY (`userId`) REFERENCES `users` (`id`) ON DELETE CASCADE ON UPDATE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `refresh_tokens`
--

LOCK TABLES `refresh_tokens` WRITE;
/*!40000 ALTER TABLE `refresh_tokens` DISABLE KEYS */;
/*!40000 ALTER TABLE `refresh_tokens` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `reviews`
--

DROP TABLE IF EXISTS `reviews`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `reviews` (
  `id` varchar(191) COLLATE utf8mb4_unicode_ci NOT NULL,
  `productId` varchar(191) COLLATE utf8mb4_unicode_ci NOT NULL,
  `userId` varchar(191) COLLATE utf8mb4_unicode_ci NOT NULL,
  `rating` int NOT NULL,
  `title` varchar(191) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `body` text COLLATE utf8mb4_unicode_ci,
  `images` text COLLATE utf8mb4_unicode_ci,
  `status` enum('PENDING','APPROVED','REJECTED') COLLATE utf8mb4_unicode_ci NOT NULL DEFAULT 'PENDING',
  `isVerified` tinyint(1) NOT NULL DEFAULT '0',
  `helpfulCount` int NOT NULL DEFAULT '0',
  `createdAt` datetime(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
  `updatedAt` datetime(3) NOT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `reviews_productId_userId_key` (`productId`,`userId`),
  KEY `reviews_userId_fkey` (`userId`),
  CONSTRAINT `reviews_productId_fkey` FOREIGN KEY (`productId`) REFERENCES `products` (`id`) ON DELETE RESTRICT ON UPDATE CASCADE,
  CONSTRAINT `reviews_userId_fkey` FOREIGN KEY (`userId`) REFERENCES `users` (`id`) ON DELETE RESTRICT ON UPDATE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `reviews`
--

LOCK TABLES `reviews` WRITE;
/*!40000 ALTER TABLE `reviews` DISABLE KEYS */;
/*!40000 ALTER TABLE `reviews` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `site_settings`
--

DROP TABLE IF EXISTS `site_settings`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `site_settings` (
  `id` varchar(191) COLLATE utf8mb4_unicode_ci NOT NULL,
  `key` varchar(191) COLLATE utf8mb4_unicode_ci NOT NULL,
  `value` longtext COLLATE utf8mb4_unicode_ci NOT NULL,
  `group` varchar(191) COLLATE utf8mb4_unicode_ci NOT NULL DEFAULT 'general',
  `updatedAt` datetime(3) NOT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `site_settings_key_key` (`key`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `site_settings`
--

LOCK TABLES `site_settings` WRITE;
/*!40000 ALTER TABLE `site_settings` DISABLE KEYS */;
/*!40000 ALTER TABLE `site_settings` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `testimonials`
--

DROP TABLE IF EXISTS `testimonials`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `testimonials` (
  `id` varchar(191) COLLATE utf8mb4_unicode_ci NOT NULL,
  `name` varchar(191) COLLATE utf8mb4_unicode_ci NOT NULL,
  `location` varchar(191) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `avatar` varchar(191) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `body` text COLLATE utf8mb4_unicode_ci NOT NULL,
  `rating` int NOT NULL DEFAULT '5',
  `isActive` tinyint(1) NOT NULL DEFAULT '1',
  `sortOrder` int NOT NULL DEFAULT '0',
  `createdAt` datetime(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
  `updatedAt` datetime(3) NOT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `testimonials`
--

LOCK TABLES `testimonials` WRITE;
/*!40000 ALTER TABLE `testimonials` DISABLE KEYS */;
/*!40000 ALTER TABLE `testimonials` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `users`
--

DROP TABLE IF EXISTS `users`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `users` (
  `id` varchar(191) COLLATE utf8mb4_unicode_ci NOT NULL,
  `phone` varchar(191) COLLATE utf8mb4_unicode_ci NOT NULL,
  `email` varchar(191) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `passwordHash` varchar(191) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `firstName` varchar(191) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `lastName` varchar(191) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `avatar` varchar(191) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `role` enum('CUSTOMER','ADMIN','SUPER_ADMIN') COLLATE utf8mb4_unicode_ci NOT NULL DEFAULT 'CUSTOMER',
  `isVerified` tinyint(1) NOT NULL DEFAULT '0',
  `isActive` tinyint(1) NOT NULL DEFAULT '1',
  `loyaltyPoints` int NOT NULL DEFAULT '0',
  `referralCode` varchar(191) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `referredBy` varchar(191) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `createdAt` datetime(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
  `updatedAt` datetime(3) NOT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `users_phone_key` (`phone`),
  UNIQUE KEY `users_email_key` (`email`),
  UNIQUE KEY `users_referralCode_key` (`referralCode`),
  KEY `users_phone_idx` (`phone`),
  KEY `users_email_idx` (`email`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `users`
--

LOCK TABLES `users` WRITE;
/*!40000 ALTER TABLE `users` DISABLE KEYS */;
/*!40000 ALTER TABLE `users` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `wishlist_items`
--

DROP TABLE IF EXISTS `wishlist_items`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `wishlist_items` (
  `id` varchar(191) COLLATE utf8mb4_unicode_ci NOT NULL,
  `userId` varchar(191) COLLATE utf8mb4_unicode_ci NOT NULL,
  `productId` varchar(191) COLLATE utf8mb4_unicode_ci NOT NULL,
  `createdAt` datetime(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
  PRIMARY KEY (`id`),
  UNIQUE KEY `wishlist_items_userId_productId_key` (`userId`,`productId`),
  KEY `wishlist_items_productId_fkey` (`productId`),
  CONSTRAINT `wishlist_items_productId_fkey` FOREIGN KEY (`productId`) REFERENCES `products` (`id`) ON DELETE RESTRICT ON UPDATE CASCADE,
  CONSTRAINT `wishlist_items_userId_fkey` FOREIGN KEY (`userId`) REFERENCES `users` (`id`) ON DELETE CASCADE ON UPDATE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `wishlist_items`
--

LOCK TABLES `wishlist_items` WRITE;
/*!40000 ALTER TABLE `wishlist_items` DISABLE KEYS */;
/*!40000 ALTER TABLE `wishlist_items` ENABLE KEYS */;
UNLOCK TABLES;
/*!40103 SET TIME_ZONE=@OLD_TIME_ZONE */;

/*!40101 SET SQL_MODE=@OLD_SQL_MODE */;
/*!40014 SET FOREIGN_KEY_CHECKS=@OLD_FOREIGN_KEY_CHECKS */;
/*!40014 SET UNIQUE_CHECKS=@OLD_UNIQUE_CHECKS */;
/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
/*!40111 SET SQL_NOTES=@OLD_SQL_NOTES */;

-- Dump completed on 2026-08-19 20:12:59
