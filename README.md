# test-unii-app

## การรันโปรเจกต์

```bash
npm run start:dev
```

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
