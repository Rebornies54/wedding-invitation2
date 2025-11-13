# Hệ Thống RSVP với Google Sheets

## Tổng Quan

Hệ thống RSVP đã được tích hợp với Google Sheets thông qua Google Apps Script. Khi khách mời submit form, dữ liệu sẽ được lưu vào Google Sheets thay vì chỉ lưu trong localStorage.

## Tính Năng

✅ **Lưu vào Google Sheets** - Dữ liệu được lưu trực tiếp vào Google Sheet  
✅ **Backup localStorage** - Vẫn lưu vào localStorage như backup  
✅ **Tự động tạo Sheet** - Script tự động tạo sheet nếu chưa có  
✅ **Format đẹp** - Header được format với màu sắc đẹp mắt  
✅ **Error handling** - Xử lý lỗi và fallback tự động  

## Setup Nhanh (5 phút)

### Bước 1: Tạo Google Sheet
1. Tạo Google Sheet mới tại [sheets.google.com](https://sheets.google.com)
2. Đặt tên sheet (ví dụ: "Wedding RSVP")

### Bước 2: Tạo Apps Script
1. Trong Google Sheet: **Extensions** > **Apps Script**
2. Copy toàn bộ code từ file `google-apps-script.gs`
3. Paste vào editor
4. Thay đổi `SHEET_NAME` nếu cần (mặc định: "RSVP")
5. **Save** (Ctrl+S)

### Bước 3: Deploy
1. Click **Deploy** > **New deployment**
2. Chọn **Web app**
3. Cấu hình:
   - Execute as: **Me**
   - Who has access: **Anyone** ⚠️ (quan trọng!)
4. Click **Deploy**
5. **Authorize** khi được yêu cầu
6. **Copy Web App URL**

### Bước 4: Cập nhật Code
1. Mở `script.js`
2. Tìm dòng: `const GOOGLE_SCRIPT_URL = 'YOUR_GOOGLE_SCRIPT_URL_HERE';`
3. Thay bằng Web App URL bạn vừa copy
4. Lưu file

### Bước 5: Test
1. Mở website
2. Điền form RSVP
3. Submit
4. Kiểm tra Google Sheet - dữ liệu sẽ xuất hiện!

## Cấu Trúc Dữ Liệu

Google Sheet sẽ có các cột:
- **Thời gian**: dd/MM/yyyy HH:mm:ss
- **Tên**: Tên khách mời
- **Số khách**: Số lượng người
- **Tham dự**: "Có" hoặc "Không"
- **Lời nhắn**: Lời nhắn từ khách
- **Timestamp**: Để sắp xếp

## Troubleshooting

**Lỗi "Chưa cấu hình Google Apps Script URL"**
→ Cập nhật `GOOGLE_SCRIPT_URL` trong `script.js`

**Dữ liệu không xuất hiện trong Sheet**
→ Kiểm tra tên sheet có đúng không
→ Kiểm tra "Who has access" phải là "Anyone"
→ Xem execution log trong Apps Script

**CORS Error**
→ Google Apps Script tự xử lý CORS, không cần cấu hình thêm

## Chi Tiết

Xem file `GOOGLE_APPS_SCRIPT_SETUP.md` để biết hướng dẫn chi tiết và các tính năng nâng cao.

