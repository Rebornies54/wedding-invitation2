# Hướng Dẫn Setup Google Apps Script cho RSVP Form

## Bước 1: Tạo Google Sheet

1. Truy cập [Google Sheets](https://sheets.google.com)
2. Tạo một Google Sheet mới
3. Đặt tên sheet (ví dụ: "Wedding RSVP")
4. **Lưu ý**: Ghi nhớ tên sheet này để sử dụng sau

## Bước 2: Tạo Google Apps Script

1. Trong Google Sheet, vào **Extensions** > **Apps Script**
2. Xóa code mặc định
3. Copy toàn bộ nội dung từ file `google-apps-script.gs` và paste vào editor
4. Nếu tên sheet của bạn khác "RSVP", thay đổi dòng này:
   ```javascript
   const SHEET_NAME = 'RSVP'; // Thay 'RSVP' bằng tên sheet của bạn
   ```
5. Click **Save** (Ctrl+S) và đặt tên project (ví dụ: "Wedding RSVP Handler")

## Bước 3: Deploy Web App

1. Click **Deploy** > **New deployment**
2. Click biểu tượng bánh răng ⚙️ bên cạnh "Select type" > chọn **Web app**
3. Cấu hình:
   - **Description**: "Wedding RSVP Handler" (tùy chọn)
   - **Execute as**: **Me** (tài khoản của bạn)
   - **Who has access**: **Anyone** (quan trọng!)
4. Click **Deploy**
5. **Lần đầu tiên**: Google sẽ yêu cầu xác thực:
   - Click **Authorize access**
   - Chọn tài khoản Google của bạn
   - Click **Advanced** > **Go to [Project Name] (unsafe)**
   - Click **Allow**
6. Copy **Web App URL** (sẽ có dạng: `https://script.google.com/macros/s/...`)
7. Click **Done**

## Bước 4: Cập nhật script.js

1. Mở file `script.js` trong dự án
2. Tìm dòng:
   ```javascript
   const GOOGLE_SCRIPT_URL = 'YOUR_GOOGLE_SCRIPT_URL_HERE';
   ```
3. Thay `YOUR_GOOGLE_SCRIPT_URL_HERE` bằng Web App URL bạn vừa copy
4. Lưu file

## Bước 5: Test

1. Mở website và điền form RSVP
2. Submit form
3. Kiểm tra Google Sheet - dữ liệu sẽ xuất hiện trong sheet

## Cấu trúc dữ liệu trong Google Sheet

Sheet sẽ có các cột:
- **Thời gian**: Thời gian submit (dd/MM/yyyy HH:mm:ss)
- **Tên**: Tên khách mời
- **Số khách**: Số lượng người tham dự
- **Tham dự**: "Có" hoặc "Không"
- **Lời nhắn**: Lời nhắn từ khách (nếu có)
- **Timestamp**: Timestamp để sắp xếp

## Lưu ý quan trọng

1. **Bảo mật**: Web App URL có thể được truy cập bởi bất kỳ ai, nhưng chỉ có thể ghi dữ liệu vào sheet của bạn
2. **Giới hạn**: Google Apps Script có giới hạn 20,000 requests/ngày (đủ cho hầu hết các trường hợp)
3. **Backup**: Nên backup Google Sheet định kỳ
4. **Permissions**: Đảm bảo "Who has access" là "Anyone" để form có thể gửi dữ liệu

## Troubleshooting

### Lỗi "Script function not found"
- Kiểm tra lại tên hàm `doPost` trong Apps Script
- Đảm bảo đã save và deploy lại

### Lỗi "Access denied"
- Kiểm tra lại "Who has access" phải là "Anyone"
- Deploy lại Web App

### Dữ liệu không xuất hiện trong Sheet
- Kiểm tra tên sheet có đúng không
- Kiểm tra console trong browser để xem lỗi
- Kiểm tra Google Apps Script execution log

### CORS Error
- Google Apps Script tự động xử lý CORS, không cần cấu hình thêm

## Nâng cao (Tùy chọn)

### Thêm email notification
Thêm vào cuối hàm `doPost`:
```javascript
// Gửi email thông báo
MailApp.sendEmail({
  to: 'your-email@gmail.com',
  subject: 'RSVP mới từ ' + data.name,
  body: 'Tên: ' + data.name + '\nSố khách: ' + data.guests + '\nTham dự: ' + data.attending
});
```

### Thêm validation
Thêm vào đầu hàm `doPost`:
```javascript
// Validate dữ liệu
if (!data.name || !data.guests || !data.attending) {
  return ContentService
    .createTextOutput(JSON.stringify({
      success: false,
      message: 'Thiếu thông tin bắt buộc'
    }))
    .setMimeType(ContentService.MimeType.JSON);
}
```

