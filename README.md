# test-unii-app

## การรันโปรเจกต์

```bash
npm run start:dev
```

---

## MongoDB Setup

### 1. สร้าง Database และ Collection

เปิด MongoDB shell หรือ [MongoDB Compass](https://www.mongodb.com/products/compass) แล้วรันคำสั่งต่อไปนี้:

```js
use unii_digital_group

db.createCollection("buy_transactions")
```

---

### 2. นำเข้าข้อมูล Mock

ดึงข้อมูลจาก API แล้ว insert เฉพาะ key `buyTransaction`:

**วิธีที่ 1 — mongosh**

```bash
mongosh unii_digital_group --eval "
  fetch('https://apirecycle.unii.co.th/Stock/query-transaction-demo')
    .then(r => r.json())
    .then(d => db.buy_transactions.insertMany(d.buyTransaction))
    .then(r => print('Inserted:', r.insertedCount))
"
```

**วิธีที่ 2 — MongoDB Compass (Aggregation / mongosh tab)**

```js
const data = await fetch("https://apirecycle.unii.co.th/Stock/query-transaction-demo")
  .then(r => r.json());

db.buy_transactions.insertMany(data.buyTransaction);
```

> แหล่งข้อมูล Mock: `https://apirecycle.unii.co.th/Stock/query-transaction-demo`  
> key ที่ใช้: `buyTransaction`

---

## ตัวอย่าง curl

### ดึงข้อมูลทั้งหมด
```bash
curl --location 'http://localhost:3000/buy-transactions/search'
```

### ค้นหาตามช่วงวันที่
```bash
curl --location 'http://localhost:3000/buy-transactions/search?startDate=2024-04-01&endDate=2024-04-30'
```

### ค้นหาตาม orderId (partial match)
```bash
curl --location 'http://localhost:3000/buy-transactions/search?orderId=CUNII'
```

### ค้นหาตาม category
```bash
curl --location 'http://localhost:3000/buy-transactions/search?categoryId=02'
```

### ค้นหาตาม category + subCategory
```bash
curl --location 'http://localhost:3000/buy-transactions/search?categoryId=02&subCategoryId=0204'
```

### ค้นหาตามช่วงราคา
```bash
curl --location 'http://localhost:3000/buy-transactions/search?minPrice=20&maxPrice=50'
```

### ค้นหาตาม grade (พร้อม gradeSummary)
```bash
curl --location 'http://localhost:3000/buy-transactions/search?grade=A'
```

### รวมหลาย filter พร้อมกัน
```bash
curl --location 'http://localhost:3000/buy-transactions/search?startDate=2024-04-01&endDate=2024-04-30&categoryId=02&grade=A&minPrice=10'
```

### ค้นหา orderId แบบ exact match
```bash
curl --location 'http://localhost:3000/buy-transactions/search?orderId=CUNIIPRO20240422125506'
```
