# test-unii-app

## การรันโปรเจกต์

```bash
npm run start:dev
```

---

## API: GET /buy-transactions/search

Query parameters ทั้งหมดเป็น optional และใช้ร่วมกันได้

/**
 * GET /buy-transactions/search
 *
 * Query parameters (all optional, combinable):
 *  - startDate        YYYY-MM-DD   (inclusive)
 *  - endDate          YYYY-MM-DD   (inclusive)
 *  - categoryId       exact match on requestList[].categoryID
 *  - subCategoryId    exact match on requestList[].subCategoryID
 *                     (scope is automatically limited to the given categoryId)
 *  - orderId          contains / partial search (case-insensitive)
 *  - minPrice         inclusive lower bound on grade-item price
 *  - maxPrice         inclusive upper bound on grade-item price
 *  - grade            A | B | C | D  – filters items and adds gradeSummary
 */

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
