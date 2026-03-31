// ================================================================
// 비트라인 웹사이트 DB → 구글 스프레드시트 연동
// ================================================================
// 사용법:
// 1. 구글 스프레드시트 열기
// 2. 확장 프로그램 → Apps Script
// 3. 이 코드 전체 붙여넣기
// 4. 저장 후 → 배포 → 새 배포 → 유형: 웹앱
//    - 다음 사용자로 실행: 나(본인)
//    - 액세스 권한: 모든 사용자
// 5. 배포 URL 복사 → Lead.jsx 상단 APPS_SCRIPT_URL 에 붙여넣기
// ================================================================

const SHEET_NAME = 'Sheet1' // 시트 이름 확인 후 수정

function doPost(e) {
  try {
    const data = JSON.parse(e.postData.contents)
    const ss = SpreadsheetApp.getActiveSpreadsheet()
    const sheet = ss.getSheetByName(SHEET_NAME) || ss.getActiveSheet()

    // 스프레드시트 컬럼 순서에 맞게 행 구성
    // id | created_time | ad_id | ad_name | adset_id | adset_name |
    // campaign_id | campaign_name | form_id | form_name | is_organic | platform |
    // 코인_투자_경험_있으신가요? | 현재_투자_가능한_금액대는? |
    // full_name | phone_number | lead_status | platform | full_name | phone_number | lead_status | 비고

    const row = [
      Date.now(),                    // id
      data.created_time || new Date().toISOString(), // created_time
      '',                            // ad_id
      '',                            // ad_name
      '',                            // adset_id
      '',                            // adset_name
      '',                            // campaign_id
      '',                            // campaign_name
      '',                            // form_id
      '웹사이트 직접신청',            // form_name
      'TRUE',                        // is_organic
      '웹사이트',                    // platform
      data.experience || '',         // 코인_투자_경험_있으신가요?
      data.amount || '',             // 현재_투자_가능한_금액대는?
      data.full_name || '',          // full_name
      data.phone_number || '',       // phone_number
      '신규',                        // lead_status
      '',                            // platform (중복)
      '',                            // full_name (중복)
      '',                            // phone_number (중복)
      '',                            // lead_status (중복)
      '웹사이트 직접 디비',          // 비고
    ]

    sheet.appendRow(row)

    return ContentService
      .createTextOutput(JSON.stringify({ result: 'success' }))
      .setMimeType(ContentService.MimeType.JSON)

  } catch (err) {
    return ContentService
      .createTextOutput(JSON.stringify({ result: 'error', message: err.message }))
      .setMimeType(ContentService.MimeType.JSON)
  }
}

// GET 요청 테스트용 (브라우저에서 URL 열면 확인 가능)
function doGet() {
  return ContentService
    .createTextOutput('비트라인 웹사이트 DB 연동 정상 작동 중')
}
