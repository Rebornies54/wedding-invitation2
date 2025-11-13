# ⚡ Hướng Dẫn Nhanh - Cấu Hình Google Apps Script

## Vấn Đề: Dữ liệu không lưu vào Google Sheets

Nếu bạn thấy trong console:
```
⚠️ Google Apps Script URL chưa được cấu hình. Dữ liệu chỉ được lưu vào localStorage.
```

Điều này có nghĩa là bạn chưa cấu hình `GOOGLE_SCRIPT_URL` trong `script.js`.

## Giải Pháp (3 bước)

### Bước 1: Deploy Google Apps Script

1. Mở Google Sheet mới
2. **Extensions** > **Apps Script**
3. Copy code từ file `google-apps-script.gs` và paste vào
4. **Save** (Ctrl+S)
5. **Deploy** > **New deployment** > **Web app**
   - Execute as: **Me**
   - Who has access: **Anyone** ⚠️
6. Click **Deploy**
7. **Authorize** nếu được yêu cầu
8. **Copy Web App URL** (sẽ có dạng: `https://script.google.com/macros/s/.../exec`)

### Bước 2: Cập nhật script.js

1. Mở file `script.js`
2. Tìm dòng 3:
   ```javascript
   const GOOGLE_SCRIPT_URL = 'YOUR_GOOGLE_SCRIPT_URL_HERE';
   ```
3. Thay thế bằng URL bạn vừa copy:
   ```javascript
   const GOOGLE_SCRIPT_URL = 'https://script.google.com/macros/s/YOUR_SCRIPT_ID/exec';
   ```

### Bước 3: Test

1. Refresh trang web
2. Mở Console (F12)
3. Submit form RSVP
4. Bạn sẽ thấy:
   ```
   ✅ RSVP submitted to Google Sheets successfully
   ```
5. Kiểm tra Google Sheet - dữ liệu sẽ xuất hiện!

## Kiểm Tra

Sau khi cấu hình, khi submit form, console sẽ hiển thị:

**Nếu thành công:**
```
Attempting to submit RSVP to Google Sheets...
Sending data to Google Apps Script: {...}
Response status: 200 OK
Response from Google Apps Script: {success: true, ...}
✅ RSVP submitted to Google Sheets successfully
RSVP saved to localStorage: {...}
```

**Nếu có lỗi:**
```
❌ Failed to submit to Google Sheets: [error details]
⚠️ Using localStorage as backup
```

## Lưu Ý Quan Trọng

1. **URL phải kết thúc bằng `/exec`** (không phải `/dev`)
2. **"Who has access" phải là "Anyone"** - nếu không sẽ bị CORS error
3. **Sau khi deploy, URL sẽ không thay đổi** - trừ khi bạn tạo deployment mới

## Vẫn Không Hoạt Động?

1. Kiểm tra Console để xem lỗi cụ thể
2. Kiểm tra Google Apps Script execution log:
   - Apps Script > Executions (menu bên trái)
3. Kiểm tra Google Sheet có tên đúng không (mặc định: "RSVP")
4. Xem file `GOOGLE_APPS_SCRIPT_SETUP.md` để biết chi tiết

