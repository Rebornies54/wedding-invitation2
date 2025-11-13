# Hướng Dẫn Cấu Hình Biến Môi Trường trên Vercel

## Tại Sao Cần Biến Môi Trường?

Sử dụng biến môi trường trên Vercel giúp:
- ✅ Bảo mật URL Google Apps Script
- ✅ Dễ dàng thay đổi URL mà không cần sửa code
- ✅ Quản lý cấu hình tập trung

## Cách Tạo Biến Môi Trường trên Vercel

### Bước 1: Vào Vercel Dashboard

1. Truy cập [vercel.com](https://vercel.com)
2. Đăng nhập và chọn project **wedding-invitation2**

### Bước 2: Vào Settings > Environment Variables

1. Click vào project
2. Vào tab **Settings**
3. Click **Environment Variables** (bên trái)

### Bước 3: Thêm Biến Môi Trường

1. Click **Add New**
2. Điền thông tin:
   - **Name**: `GOOGLE_SCRIPT_URL`
   - **Value**: `https://script.google.com/macros/s/AKfycbyAtSOEKKoCxOBa2IE3SBnQ0HtA7vNEarmJE1gf8uQT2od-CacPRBS1I_wyqY35i5is-Q/exec`
   - **Environment**: Chọn tất cả (Production, Preview, Development)
3. Click **Save**

### Bước 4: Redeploy

1. Vào tab **Deployments**
2. Click **...** (3 chấm) trên deployment mới nhất
3. Click **Redeploy**
4. Hoặc Vercel sẽ tự động redeploy khi bạn push code mới

## Cách Sử Dụng trong Code

Code đã được cập nhật để tự động sử dụng biến môi trường:

```javascript
const GOOGLE_SCRIPT_URL = typeof process !== 'undefined' && process.env?.GOOGLE_SCRIPT_URL 
    ? process.env.GOOGLE_SCRIPT_URL 
    : 'URL_MẶC_ĐỊNH'; // Fallback nếu không có biến môi trường
```

## Kiểm Tra

Sau khi redeploy:

1. Mở website trên Vercel
2. Mở Console (F12)
3. Submit form RSVP
4. Kiểm tra log:
   ```
   Sending data to Google Apps Script: {
     url: 'https://script.google.com/...',
     requestData: { action: 'save', data: {...} }
   }
   ```

## Lưu Ý

- ⚠️ **Không commit URL vào code** - Sử dụng biến môi trường
- ✅ **Kiểm tra Environment** - Đảm bảo chọn đúng môi trường (Production/Preview/Development)
- ✅ **Redeploy sau khi thêm biến** - Vercel cần redeploy để nhận biến mới

## Troubleshooting

**Biến môi trường không hoạt động?**
- Kiểm tra tên biến có đúng không: `GOOGLE_SCRIPT_URL`
- Đảm bảo đã chọn đúng Environment (Production/Preview/Development)
- Redeploy lại project

**Vẫn dùng URL mặc định?**
- Code có fallback về URL mặc định nếu không tìm thấy biến môi trường
- Kiểm tra Console để xem URL nào đang được sử dụng

