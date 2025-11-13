// Google Apps Script để lưu và lấy RSVPs từ Google Sheets
// Copy toàn bộ code này vào Google Apps Script editor

const SHEET_NAME = 'Sheet1'; // Tên sheet (mặc định là Sheet1)

function doPost(e) {
  try {
    const data = JSON.parse(e.postData.contents);
    
    if (data.action === 'save') {
      return saveRSVP(data.data);
    }
    
    return ContentService.createTextOutput(JSON.stringify({
      success: false,
      error: 'Invalid action'
    })).setMimeType(ContentService.MimeType.JSON);
    
  } catch (error) {
    Logger.log('doPost error: ' + error.toString());
    return ContentService.createTextOutput(JSON.stringify({
      success: false,
      error: error.toString()
    })).setMimeType(ContentService.MimeType.JSON);
  }
}

function doGet(e) {
  try {
    if (e.parameter.action === 'get') {
      return getAllRSVPs();
    }
    
    return ContentService.createTextOutput(JSON.stringify({
      success: false,
      error: 'Invalid action'
    })).setMimeType(ContentService.MimeType.JSON);
    
  } catch (error) {
    Logger.log('doGet error: ' + error.toString());
    return ContentService.createTextOutput(JSON.stringify({
      success: false,
      error: error.toString()
    })).setMimeType(ContentService.MimeType.JSON);
  }
}

function saveRSVP(data) {
  try {
    // Validate data
    if (!data || !data.name || !data.attending) {
      throw new Error('Missing required fields: name and attending are required');
    }
    
    const spreadsheet = SpreadsheetApp.getActiveSpreadsheet();
    const sheet = spreadsheet.getSheetByName(SHEET_NAME);
    
    if (!sheet) {
      const availableSheets = spreadsheet.getSheets().map(s => s.getName()).join(', ');
      throw new Error('Sheet "' + SHEET_NAME + '" not found. Available sheets: ' + availableSheets);
    }
    
    // Tìm dòng trống tiếp theo
    const lastRow = sheet.getLastRow();
    const newRow = lastRow + 1;
    
    Logger.log('Writing to row: ' + newRow);
    Logger.log('Data: ' + JSON.stringify(data));
    
    // Tạo ID và timestamp
    const id = Date.now();
    const timestamp = new Date().toISOString();
    const date = new Date().toLocaleString('vi-VN');
    
    // Ghi dữ liệu vào sheet
    sheet.getRange(newRow, 1).setValue(id); // ID
    sheet.getRange(newRow, 2).setValue(timestamp); // Timestamp
    sheet.getRange(newRow, 3).setValue(date); // Date
    sheet.getRange(newRow, 4).setValue(String(data.name).trim()); // Name
    sheet.getRange(newRow, 5).setValue(parseInt(data.guests) || 1); // Guests
    sheet.getRange(newRow, 6).setValue(String(data.attending)); // Attending
    sheet.getRange(newRow, 7).setValue(String(data.message || '').trim()); // Message
    
    // Verify data was written
    SpreadsheetApp.flush(); // Force write to sheet
    const writtenData = sheet.getRange(newRow, 1, 1, 7).getValues()[0];
    
    Logger.log('Data written successfully to row ' + newRow);
    Logger.log('Written data: ' + JSON.stringify(writtenData));
    
    return ContentService.createTextOutput(JSON.stringify({
      success: true,
      data: {
        id: id,
        timestamp: timestamp,
        date: date,
        name: data.name,
        guests: parseInt(data.guests) || 1,
        attending: data.attending,
        message: data.message || ''
      },
      debug: {
        row: newRow,
        lastRow: lastRow,
        written: writtenData,
        sheetName: SHEET_NAME
      }
    })).setMimeType(ContentService.MimeType.JSON);
    
  } catch (error) {
    Logger.log('Error in saveRSVP: ' + error.toString());
    Logger.log('Stack: ' + error.stack);
    return ContentService.createTextOutput(JSON.stringify({
      success: false,
      error: error.toString(),
      message: 'Failed to save RSVP to Google Sheets'
    })).setMimeType(ContentService.MimeType.JSON);
  }
}

function getAllRSVPs() {
  try {
    const spreadsheet = SpreadsheetApp.getActiveSpreadsheet();
    const sheet = spreadsheet.getSheetByName(SHEET_NAME);
    
    if (!sheet) {
      throw new Error('Sheet "' + SHEET_NAME + '" not found');
    }
    
    const lastRow = sheet.getLastRow();
    Logger.log('getAllRSVPs - Last row: ' + lastRow);
    
    if (lastRow <= 1) {
      // Chỉ có header, không có data
      Logger.log('No data found, only header row');
      return ContentService.createTextOutput(JSON.stringify({
        success: true,
        data: [],
        debug: {
          lastRow: lastRow,
          sheetName: SHEET_NAME
        }
      })).setMimeType(ContentService.MimeType.JSON);
    }
    
    // Lấy tất cả data (bỏ qua header row)
    const dataRange = sheet.getRange(2, 1, lastRow - 1, 7);
    const values = dataRange.getValues();
    
    Logger.log('Found ' + values.length + ' rows of data');
    
    // Format data
    const rsvps = values.map((row, index) => ({
      id: row[0],
      timestamp: row[1],
      date: row[2],
      name: row[3] || '',
      guests: parseInt(row[4]) || 0,
      attending: row[5] || '',
      message: row[6] || ''
    })).filter(row => row.id && row.name); // Filter out empty rows
    
    Logger.log('Filtered to ' + rsvps.length + ' valid RSVPs');
    
    return ContentService.createTextOutput(JSON.stringify({
      success: true,
      data: rsvps,
      debug: {
        lastRow: lastRow,
        totalRows: values.length,
        filteredRows: rsvps.length,
        sheetName: SHEET_NAME
      }
    })).setMimeType(ContentService.MimeType.JSON);
    
  } catch (error) {
    Logger.log('Error in getAllRSVPs: ' + error.toString());
    Logger.log('Stack: ' + error.stack);
    return ContentService.createTextOutput(JSON.stringify({
      success: false,
      error: error.toString(),
      data: []
    })).setMimeType(ContentService.MimeType.JSON);
  }
}

// Test functions
function testSave() {
  const testData = {
    name: 'Test User',
    guests: 2,
    attending: 'yes',
    message: 'Test from Apps Script'
  };
  
  try {
    const result = saveRSVP(testData);
    const content = result.getContent();
    Logger.log('Test Save Result: ' + content);
    
    const json = JSON.parse(content);
    Logger.log('Success: ' + json.success);
    if (json.debug) {
      Logger.log('Debug: ' + JSON.stringify(json.debug));
    }
    
    // Kiểm tra sheet
    const sheet = SpreadsheetApp.getActiveSpreadsheet().getSheetByName(SHEET_NAME);
    const lastRow = sheet.getLastRow();
    Logger.log('Sheet last row after test: ' + lastRow);
    
    if (lastRow > 1) {
      const lastRowData = sheet.getRange(lastRow, 1, 1, 7).getValues()[0];
      Logger.log('Last row data: ' + JSON.stringify(lastRowData));
    }
    
  } catch (error) {
    Logger.log('Test Save Error: ' + error.toString());
  }
}

function testGet() {
  try {
    const result = getAllRSVPs();
    const content = result.getContent();
    Logger.log('Test Get Result: ' + content);
    
    const json = JSON.parse(content);
    Logger.log('Success: ' + json.success);
    Logger.log('Data count: ' + (json.data ? json.data.length : 0));
    if (json.debug) {
      Logger.log('Debug: ' + JSON.stringify(json.debug));
    }
    
  } catch (error) {
    Logger.log('Test Get Error: ' + error.toString());
  }
}
