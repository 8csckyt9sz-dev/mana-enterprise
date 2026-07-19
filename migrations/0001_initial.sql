CREATE TABLE IF NOT EXISTS stock_cars (
 id INTEGER PRIMARY KEY AUTOINCREMENT, name TEXT NOT NULL, category TEXT NOT NULL,
 model_year INTEGER, mileage INTEGER, price INTEGER NOT NULL DEFAULT 0,
 status TEXT NOT NULL DEFAULT '販売中' CHECK(status IN ('販売中','売約済み','販売済み')),
 image_key TEXT, display_order INTEGER NOT NULL DEFAULT 0,
 created_at TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP, updated_at TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP
);
CREATE TABLE IF NOT EXISTS stock_goods (
 id INTEGER PRIMARY KEY AUTOINCREMENT, name TEXT NOT NULL, category TEXT NOT NULL,
 condition TEXT NOT NULL DEFAULT '', description TEXT NOT NULL DEFAULT '', price INTEGER NOT NULL DEFAULT 0,
 status TEXT NOT NULL DEFAULT '販売中' CHECK(status IN ('販売中','取置中','販売済み')),
 image_key TEXT, display_order INTEGER NOT NULL DEFAULT 0,
 created_at TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP, updated_at TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP
);
CREATE INDEX IF NOT EXISTS idx_cars_order ON stock_cars(display_order, id);
CREATE INDEX IF NOT EXISTS idx_goods_order ON stock_goods(display_order, id);
