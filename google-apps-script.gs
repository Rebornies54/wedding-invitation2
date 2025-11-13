/**
 * Google Apps Script để lưu RSVP vào Google Sheets
 * 
 * HƯỚNG DẪN SETUP:
 * 1. Tạo Google Sheet mới
 * 2. Vào Extensions > Apps Script
 * 3. Copy toàn bộ code này vào editor
 * 4. Thay đổi SHEET_NAME thành tên sheet của bạn (mặc định là "RSVP")
 * 5. Deploy > New deployment > Web app
 * 6. Execute as: Me
 * 7. Who has access: Anyone
 * 8. Copy Web App URL và dán vào biến GOOGLE_SCRIPT_URL trong script.js
 */

// Tên sheet để lưu dữ liệu (thay đổi nếu cần)
const SHEET_NAME = 'RSVP';

/**
 * Hàm xử lý POST request từ form
 */
function doPost(e) {
  try {
    // Parse dữ liệu từ request
    const data = JSON.parse(e.postData.contents);
    
    // Lấy hoặc tạo sheet
    const sheet = getOrCreateSheet();
    
    // Kiểm tra xem đã có header chưa
    if (sheet.getLastRow() === 0) {
      // Tạo header nếu sheet trống
      sheet.appendRow([
        'Thời gian',
        'Tên',
        'Số khách',
        'Tham dự',
        'Lời nhắn',
        'Timestamp'
      ]);
    }
    
    // Format thời gian
    const now = new Date();
    const vietnamTime = Utilities.formatDate(
      now,
      Session.getScriptTimeZone(),
      'dd/MM/yyyy HH:mm:ss'
    );
    
    // Chuẩn bị dữ liệu để ghi
    const rowData = [
      vietnamTime,                                    // Thời gian
      data.name || '',                                // Tên
      data.guests || 0,                              // Số khách
      data.attending === 'yes' ? 'Có' : 'Không',    // Tham dự
      data.message || '',                            // Lời nhắn
      now.getTime()                                   // Timestamp (để sort)
    ];
    
    // Ghi dữ liệu vào sheet
    sheet.appendRow(rowData);
    
    // Trả về response thành công
    return ContentService
      .createTextOutput(JSON.stringify({
        success: true,
        message: 'Đã lưu thông tin thành công!',
        timestamp: vietnamTime
      }))
      .setMimeType(ContentService.MimeType.JSON);
      
  } catch (error) {
    // Trả về lỗi nếu có
    return ContentService
      .createTextOutput(JSON.stringify({
        success: false,
        message: 'Có lỗi xảy ra: ' + error.toString()
      }))
      .setMimeType(ContentService.MimeType.JSON);
  }
}

/**
 * Hàm xử lý GET request (để test)
 */
function doGet(e) {
  const sheet = getOrCreateSheet();
  const data = sheet.getDataRange().getValues();
  
  return ContentService
    .createTextOutput(JSON.stringify({
      success: true,
      count: data.length - 1, // Trừ header
      data: data
    }))
    .setMimeType(ContentService.MimeType.JSON);
}

/**
 * Lấy hoặc tạo sheet
 */
function getOrCreateSheet() {
  const spreadsheet = SpreadsheetApp.getActiveSpreadsheet();
  let sheet = spreadsheet.getSheetByName(SHEET_NAME);
  
  if (!sheet) {
    // Tạo sheet mới nếu chưa có
    sheet = spreadsheet.insertSheet(SHEET_NAME);
    
    // Tạo header
    sheet.appendRow([
      'Thời gian',
      'Tên',
      'Số khách',
      'Tham dự',
      'Lời nhắn',
      'Timestamp'
    ]);
    
    // Format header
    const headerRange = sheet.getRange(1, 1, 1, 6);
    headerRange.setFontWeight('bold');
    headerRange.setBackground('#8B2635');
    headerRange.setFontColor('#FFFFFF');
    headerRange.setHorizontalAlignment('center');
    
    // Set column widths
    sheet.setColumnWidth(1, 150); // Thời gian
    sheet.setColumnWidth(2, 200); // Tên
    sheet.setColumnWidth(3, 100); // Số khách
    sheet.setColumnWidth(4, 100); // Tham dự
    sheet.setColumnWidth(5, 300); // Lời nhắn
    sheet.setColumnWidth(6, 150); // Timestamp
  }
  
  return sheet;
}

/**
 * Hàm test để kiểm tra script hoạt động
 */
function testScript() {
  const testData = {
    name: 'Test User',
    guests: '2',
    attending: 'yes',
    message: 'Test message'
  };
  
  const mockEvent = {
    postData: {
      contents: JSON.stringify(testData)
    }
  };
  
  const result = doPost(mockEvent);
  Logger.log(result.getContent());
}

