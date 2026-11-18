// ============================================================
// MONGODB 7.0 - INITIALIZATION SCRIPT
// Database: yabiso_documents, yabiso_analytics
// ============================================================

// Switch to admin database
db = db.getSiblingDB('admin');

// Create yabiso_documents database
db = db.getSiblingDB('yabiso_documents');

// ============================================================
// PRODUCT DETAILS COLLECTION (Semi-structured)
// ============================================================

db.createCollection("product_details", {
  validator: {
    $jsonSchema: {
      bsonType: "object",
      required: ["product_id", "supplier_id", "title"],
      properties: {
        _id: { bsonType: "objectId" },
        product_id: { bsonType: "string", description: "Reference to MySQL products.product_id" },
        supplier_id: { bsonType: "string", description: "Reference to MySQL suppliers.supplier_id" },
        title: { bsonType: "string" },
        full_description: { bsonType: "string" },
        specifications: { 
          bsonType: "object",
          properties: {
            weight: { bsonType: "string" },
            dimensions: { bsonType: "object" },
            material: { bsonType: "string" },
            color_variants: { bsonType: "array" },
            certifications: { bsonType: "array" }
          }
        },
        images: {
          bsonType: "array",
          items: {
            bsonType: "object",
            properties: {
              url: { bsonType: "string" },
              caption: { bsonType: "string" },
              uploaded_at: { bsonType: "date" },
              size_bytes: { bsonType: "int" }
            }
          }
        },
        reviews: {
          bsonType: "array",
          items: {
            bsonType: "object",
            properties: {
              reviewer_id: { bsonType: "objectId" },
              rating: { bsonType: "int", minimum: 1, maximum: 5 },
              comment: { bsonType: "string" },
              helpful_count: { bsonType: "int" },
              created_at: { bsonType: "date" },
              verified_purchase: { bsonType: "bool" }
            }
          }
        },
        seller_profile: {
          bsonType: "object",
          properties: {
            bio: { bsonType: "string" },
            certifications: { bsonType: "array" },
            response_time_hours: { bsonType: "int" },
            return_policy: { bsonType: "string" }
          }
        },
        seo_metadata: {
          bsonType: "object",
          properties: {
            slug: { bsonType: "string" },
            keywords: { bsonType: "array" },
            description: { bsonType: "string" }
          }
        },
        tags: { bsonType: "array" },
        trending_score: { bsonType: "double" },
        last_modified: { bsonType: "date" },
        created_at: { bsonType: "date" }
      }
    }
  }
});

// Create indexes
db.product_details.createIndex({ product_id: 1 }, { unique: true });
db.product_details.createIndex({ supplier_id: 1 });
db.product_details.createIndex({ "seo_metadata.slug": 1 }, { unique: true });
db.product_details.createIndex({ tags: 1 });
db.product_details.createIndex({ trending_score: -1 });
db.product_details.createIndex({ created_at: -1 });

// ============================================================
// BUYER PREFERENCES COLLECTION
// ============================================================

db.createCollection("buyer_preferences");

db.buyer_preferences.createIndex({ buyer_id: 1 }, { unique: true });
db.buyer_preferences.createIndex({ created_at: -1 });

// ============================================================
// ANALYTICS EVENTS COLLECTION
// ============================================================

db.createCollection("analytics_events", {
  timeseries: {
    timeField: "timestamp",
    metaField: "metadata",
    granularity: "hours"
  }
});

db.analytics_events.createIndex({ user_id: 1, timestamp: -1 });
db.analytics_events.createIndex({ event_type: 1, timestamp: -1 });
db.analytics_events.createIndex({ "metadata.product_id": 1 });
db.analytics_events.createIndex({ "metadata.supplier_id": 1 });

// ============================================================
// KPI DAILY AGGREGATION
// ============================================================

db.createCollection("kpis_daily");

db.kpis_daily.createIndex({ date: -1 }, { unique: true });
db.kpis_daily.createIndex({ created_at: -1 });

// ============================================================
// SELLER PROFILES EXTENDED
// ============================================================

db.createCollection("seller_profiles");

db.seller_profiles.createIndex({ supplier_id: 1 }, { unique: true });
db.seller_profiles.createIndex({ verified: 1 });
db.seller_profiles.createIndex({ rating: -1 });

// ============================================================
// SWITCH TO ANALYTICS DATABASE
// ============================================================

db = db.getSiblingDB('yabiso_analytics');

// ============================================================
// ANALYTICS LOGS COLLECTION
// ============================================================

db.createCollection("analytics_logs");

db.analytics_logs.createIndex({ timestamp: -1 });
db.analytics_logs.createIndex({ user_id: 1, timestamp: -1 });
db.analytics_logs.createIndex({ event_type: 1 });
db.analytics_logs.createIndex({ "device.platform": 1 });

// Set TTL index (keep logs for 90 days)
db.analytics_logs.createIndex({ timestamp: 1 }, { expireAfterSeconds: 7776000 });

// ============================================================
// SEED DATA (FOR TESTING)
// ============================================================

// Insert sample product details
db.product_details.insertOne({
  product_id: "product-1",
  supplier_id: "supplier-1",
  title: "Maïs Bio Premium",
  full_description: "Maïs biologique cultivé sans pesticides. Excellent pour la consommation directe ou la transformation.",
  specifications: {
    weight: "50kg",
    dimensions: { length: "30cm", width: "20cm", height: "25cm" },
    material: "Grains de maïs naturel",
    color_variants: ["Jaune", "Blanc"],
    certifications: ["Bio Certifié", "Sans OGM"]
  },
  images: [
    {
      url: "https://example.com/products/mais-bio-1.jpg",
      caption: "Maïs bio en sacs",
      uploaded_at: new Date(),
      size_bytes: 2048576
    }
  ],
  reviews: [],
  seller_profile: {
    bio: "Producteur agricole certifié depuis 2015",
    certifications: ["Agriculture Bio"],
    response_time_hours: 24,
    return_policy: "Retour gratuit sous 7 jours"
  },
  seo_metadata: {
    slug: "mais-bio-premium",
    keywords: ["maïs", "bio", "agriculture", "grains"],
    description: "Maïs biologique premium cultivé en RDC"
  },
  tags: ["Agriculture", "Bio", "Aliments", "Grains"],
  trending_score: 0.85,
  created_at: new Date(),
  last_modified: new Date()
});

// Insert sample buyer preferences
db.buyer_preferences.insertOne({
  buyer_id: "buyer-1",
  saved_suppliers: [
    { id: "supplier-1", name: "Compagnie Agricole RDC", date_added: new Date() }
  ],
  purchase_history: [
    { product_id: "product-1", date: new Date(), amount: 500 }
  ],
  search_history: [
    { query: "maïs bio", date: new Date(), count: 5 }
  ],
  wishlist: [
    { product_id: "product-1", added_at: new Date(), priority: 1 }
  ],
  notifications_settings: {
    email_frequency: "daily",
    push_enabled: true,
    sms_enabled: false
  },
  created_at: new Date(),
  last_updated: new Date()
});

print("MongoDB initialization completed successfully!");
print("Databases created: yabiso_documents, yabiso_analytics");
print("Collections: product_details, buyer_preferences, analytics_events, seller_profiles, analytics_logs");
