/* Google Apps Script V8. Deploy separately; never serve secrets from config.js.
 * Script properties: SHEET_ID, SHARED_SECRET (same secret as Hostinger private config).
 * This endpoint only accepts signed requests from the PHP proxy.
 */
var WORKSHOP_ID = 'SU-FW-02-2026-11-14';
var QUIZ_VERSION = 'quiz-v1';
var CONSENT_VERSION = 'workshop-consent-v1';
var REGISTRATION_HEADERS = [
  'registration_id','workshop_id','created_at','updated_at','registration_status',
  'full_name','whatsapp_number','workshop_contact_consent','marketing_opt_in',
  'consent_version','consent_recorded_at','marketing_opt_in_updated_at',
  'q1_purpose','custom_attend_workshop','q2_stage','q3_challenge','q4_learning_preference',
  'quiz_version','completed_at','video_id','contact_verification_status',
  'existing_community_member','group_link_clicked_at','group_join_status',
  'group_join_confirmed_at','attendance_status','attendance_minutes',
  'ebook_details_requested','mentorship_details_requested','product_request_updated_at',
  'utm_source','utm_medium','utm_campaign','utm_content','record_flag',
  'duplicate_of_registration_id','follow_up_owner','follow_up_status','admin_notes'
];
var ANSWER_CODES = {
  Q1:['START','IMPROVE','LEARN','CUSTOM','UNSURE'],
  Q2:['NEW','SKILL','OCCASIONAL','REGULAR','PREFER_NOT'],
  Q3:['RESOURCES','PRODUCT','FABRIC','PRICE','ORDERS','NOT_SURE'],
  Q4:['FREE','SELF','GUIDED','EXPLORE']
};
var QUESTION_FIELDS = {Q1:'q1_purpose',Q2:'q2_stage',Q3:'q3_challenge',Q4:'q4_learning_preference'};

function workshopAssert(ok, code) { if (!ok) throw new Error(code); }
function workshopText(value, max) {
  workshopAssert(typeof value === 'string' && value.length <= max, 'INVALID_TEXT');
  return value.trim();
}
function literalText(value) { return /^[=+\-@]/.test(value) ? "'" + value : value; }
function plainText(value) { return String(value || '').replace(/^'(?=[=+\-@])/, ''); }
function workshopPhone(value) {
  var phone = workshopText(value, 30).replace(/[\s().-]/g, '');
  if (/^0[1-9]\d{8}$/.test(phone)) phone = '+94' + phone.slice(1);
  workshopAssert(/^\+[1-9]\d{7,14}$/.test(phone), 'INVALID_PHONE');
  return phone;
}
function workshopHex(bytes) { return bytes.map(function(b) { return ((b+256)%256).toString(16).padStart(2,'0'); }).join(''); }
function workshopHmac(value, secret) { return workshopHex(Utilities.computeHmacSha256Signature(value, secret, Utilities.Charset.UTF_8)); }
function workshopEqual(a,b) {
  a=String(a || ''); b=String(b || ''); var d=a.length^b.length;
  for(var i=0;i<Math.max(a.length,b.length);i++) d|=(a.charCodeAt(i)||0)^(b.charCodeAt(i)||0);
  return d===0;
}
function workshopProperties() {
  var p=PropertiesService.getScriptProperties().getProperties();
  workshopAssert(p.SHEET_ID && p.SHARED_SECRET && p.SHARED_SECRET.length>=32, 'NOT_CONFIGURED');
  return p;
}
function workshopReply(body) { return ContentService.createTextOutput(JSON.stringify(body)).setMimeType(ContentService.MimeType.JSON); }
function doGet() { return workshopReply({ok:false,error:{code:'POST_REQUIRED'}}); }
function doPost(e) {
  var lock;
  try {
    var p=workshopProperties();
    workshopAssert(e && e.postData && e.postData.contents.length<=65000, 'INVALID_REQUEST');
    var env=JSON.parse(e.postData.contents);
    workshopAssert(Number.isInteger(env.timestamp) && Math.abs(Date.now()/1000-env.timestamp)<=300, 'REQUEST_EXPIRED');
    workshopAssert(typeof env.payload==='string' && env.payload.length<=50000, 'INVALID_REQUEST');
    workshopAssert(workshopEqual(env.signature,workshopHmac(env.timestamp+'\n'+env.payload,p.SHARED_SECRET)), 'UNAUTHORIZED');
    var data=JSON.parse(Utilities.newBlob(Utilities.base64Decode(env.payload)).getDataAsString('UTF-8'));
    lock=LockService.getScriptLock(); workshopAssert(lock.tryLock(20000), 'BUSY_RETRY');
    var book=SpreadsheetApp.openById(p.SHEET_ID);
    var result=saveWorkshopRecord(book,data,p.SHARED_SECRET);
    SpreadsheetApp.flush();
    return workshopReply(result);
  } catch(error) {
    var code=String(error.message || 'SAVE_FAILED');
    var known=/^(INVALID_[A-Z_]+|NOT_CONFIGURED|SCHEMA_MISMATCH|POST_REQUIRED|REQUEST_EXPIRED|UNAUTHORIZED|BUSY_RETRY|NOT_FOUND|IDEMPOTENCY_CONFLICT|NOT_COMPLETE)$/;
    return workshopReply({ok:false,error:{code:known.test(code)?code:'SAVE_FAILED'}});
  } finally { if(lock && lock.hasLock()) lock.releaseLock(); }
}
function workshopSheet(book) {
  var sheet=book.getSheetByName('Registrations');
  workshopAssert(sheet, 'NOT_CONFIGURED');
  var actual=sheet.getRange(1,1,1,REGISTRATION_HEADERS.length).getValues()[0];
  workshopAssert(JSON.stringify(actual)===JSON.stringify(REGISTRATION_HEADERS), 'SCHEMA_MISMATCH');
  return sheet;
}
function workshopRow(sheet,id) {
  if(sheet.getLastRow()<2) return 0;
  var matches=sheet.getRange(2,1,sheet.getLastRow()-1,1).createTextFinder(id).matchEntireCell(true).matchCase(true).findAll();
  workshopAssert(matches.length<=1,'SCHEMA_MISMATCH');
  return matches.length?matches[0].getRow():0;
}
function recordFromValues(values) { var row={};REGISTRATION_HEADERS.forEach(function(k,i){row[k]=values[i]===undefined?'':values[i];});return row; }
function recordValues(row) { return REGISTRATION_HEADERS.map(function(k){return row[k]===undefined?'':row[k];}); }
function workshopNameKey(v) { return plainText(v).toLowerCase().replace(/\s+/g,' ').trim(); }
function workshopVideo(answers,attend) {
  if(answers.Q1==='CUSTOM' && attend===false)return null;
  Object.keys(ANSWER_CODES).forEach(function(k){workshopAssert(ANSWER_CODES[k].indexOf(answers[k])!==-1,'INVALID_ANSWER');});
  if(answers.Q1==='CUSTOM')return 'V5';
  if(answers.Q1==='LEARN')return 'V4';
  if(answers.Q1==='UNSURE')return 'V5';
  if(answers.Q1==='IMPROVE'||['OCCASIONAL','REGULAR'].indexOf(answers.Q2)!==-1)return 'V3';
  if(answers.Q1==='START'&&answers.Q2==='SKILL')return 'V2';
  return 'V1';
}
function workshopAnswers(row,data,complete) {
  workshopAssert(data.answers && typeof data.answers==='object' && !Array.isArray(data.answers),'INVALID_ANSWER');
  Object.keys(data.answers).forEach(function(k){
    workshopAssert(ANSWER_CODES[k] && ANSWER_CODES[k].indexOf(data.answers[k])!==-1,'INVALID_ANSWER');
    row[QUESTION_FIELDS[k]]=data.answers[k];
  });
  if(row.q1_purpose==='CUSTOM') {
    if(data.custom_attending!==undefined) {
      workshopAssert(typeof data.custom_attending==='boolean','INVALID_ATTENDANCE');
      row.custom_attend_workshop=data.custom_attending?'YES':'NO';
    }
    if(complete)workshopAssert(row.custom_attend_workshop==='YES','INVALID_ATTENDANCE');
  } else row.custom_attend_workshop='';
  if(complete)Object.keys(QUESTION_FIELDS).forEach(function(k){workshopAssert(ANSWER_CODES[k].indexOf(row[QUESTION_FIELDS[k]])!==-1,'INVALID_ANSWER');});
}
function writeAuxiliary(book,name,headers,id,values) {
  var sh=book.getSheetByName(name);
  if(!sh){sh=book.insertSheet(name);sh.getRange(1,1,1,headers.length).setValues([headers]);sh.setFrozenRows(1);}
  workshopAssert(JSON.stringify(sh.getRange(1,1,1,headers.length).getValues()[0])===JSON.stringify(headers),'SCHEMA_MISMATCH');
  var at=workshopRow(sh,id) || sh.getLastRow()+1;
  sh.getRange(at,1,1,headers.length).setNumberFormat('@').setValues([values]);
}
function saveWorkshopRecord(book,data,secret) {
  workshopAssert(data && ['start','answer','complete','enquiry','preferences','invitation_click','membership'].indexOf(data.action)!==-1,'INVALID_ACTION');
  workshopAssert(data.event_id===WORKSHOP_ID && data.quiz_version===QUIZ_VERSION,'INVALID_EVENT');
  workshopAssert(typeof data.request_id==='string' && /^[a-zA-Z0-9_-]{8,100}$/.test(data.request_id),'INVALID_REQUEST');
  var sheet=workshopSheet(book), now=new Date(), id=data.registration_id, at, row, before, resumed=false;
  if(data.action==='start') {
    var hex=workshopHex(Utilities.computeDigest(Utilities.DigestAlgorithm.SHA_256,WORKSHOP_ID+'|'+data.request_id,Utilities.Charset.UTF_8));
    id=hex.slice(0,8)+'-'+hex.slice(8,12)+'-'+hex.slice(12,16)+'-'+hex.slice(16,20)+'-'+hex.slice(20,32);
    if(data.registration_id){
      workshopAssert(typeof data.registration_id==='string' && /^[a-f0-9-]{36}$/.test(data.registration_id),'INVALID_REGISTRATION');
      workshopAssert(workshopEqual(data.session_token,workshopHmac('registration:'+data.registration_id,secret)),'UNAUTHORIZED');
      id=data.registration_id;
    }
    var details=data.details || {},name=workshopText(details.name,120),phone=workshopPhone(details.phone);
    workshopAssert(name.length>=2 && /\p{L}/u.test(name),'INVALID_NAME');
    workshopAssert(details.workshop_contact_acknowledgement===true && data.consent_version===CONSENT_VERSION,'INVALID_CONSENT');
    workshopAssert(typeof details.marketing_opt_in==='boolean','INVALID_CONSENT');
    var email=details.email===undefined?'':workshopText(details.email,254);
    workshopAssert(!email||/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email),'INVALID_EMAIL');
    at=workshopRow(sheet,id);
    if(data.registration_id)workshopAssert(at,'NOT_FOUND');
    if(at){
      row=recordFromValues(sheet.getRange(at,1,1,REGISTRATION_HEADERS.length).getValues()[0]);
      workshopAssert(row.workshop_id===WORKSHOP_ID,'INVALID_EVENT');
      if(!data.registration_id)workshopAssert(workshopNameKey(row.full_name)===workshopNameKey(name) && plainText(row.whatsapp_number)===phone,'IDEMPOTENCY_CONFLICT');
      {
        before=JSON.stringify(row);
        if(row.marketing_opt_in!==(details.marketing_opt_in?'YES':'NO'))row.marketing_opt_in_updated_at=now;
        row.full_name=literalText(name);row.whatsapp_number=literalText(phone);row.marketing_opt_in=details.marketing_opt_in?'YES':'NO';
        row.workshop_contact_consent='YES';row.consent_version=CONSENT_VERSION;
        if(before!==JSON.stringify(row)){
          row.updated_at=now;row.registration_status='STARTED';row.completed_at='';row.video_id='';
        }
      }
    } else {
      row=recordFromValues([]);
      Object.assign(row,{registration_id:id,workshop_id:WORKSHOP_ID,created_at:now,updated_at:now,registration_status:'STARTED',full_name:literalText(name),whatsapp_number:literalText(phone),workshop_contact_consent:'YES',marketing_opt_in:details.marketing_opt_in?'YES':'NO',consent_version:CONSENT_VERSION,consent_recorded_at:now,marketing_opt_in_updated_at:now,quiz_version:QUIZ_VERSION,contact_verification_status:'UNVERIFIED',existing_community_member:'UNKNOWN',group_join_status:'UNKNOWN',attendance_status:'UNKNOWN',ebook_details_requested:'NO',mentorship_details_requested:'NO',record_flag:details.test_flag===true?'TEST':'NORMAL',follow_up_status:'NOT_REQUIRED'});
      var utm=details.attribution || {};
      ['utm_source','utm_medium','utm_campaign','utm_content'].forEach(function(k){row[k]=utm[k]===undefined?'':literalText(workshopText(utm[k],160));});
      if(sheet.getLastRow()>1 && row.record_flag!=='TEST') {
        var existing=sheet.getRange(2,2,sheet.getLastRow()-1,6).getValues();
        if(existing.some(function(r){return r[0]===WORKSHOP_ID&&plainText(r[5])===phone;}))row.record_flag='DUPLICATE_REVIEW';
      }
      at=sheet.getLastRow()+1;
    }
    resumed=!!data.registration_id;
    if(email)writeAuxiliary(book,'Contact Extras',['registration_id','email','updated_at'],id,[id,literalText(email),now.toISOString()]);
  } else {
    workshopAssert(typeof id==='string' && /^[a-f0-9-]{36}$/.test(id),'INVALID_REGISTRATION');
    workshopAssert(workshopEqual(data.session_token,workshopHmac('registration:'+id,secret)),'UNAUTHORIZED');
    at=workshopRow(sheet,id);workshopAssert(at,'NOT_FOUND');
    row=recordFromValues(sheet.getRange(at,1,1,REGISTRATION_HEADERS.length).getValues()[0]);
    workshopAssert(row.workshop_id===WORKSHOP_ID,'INVALID_EVENT');
    before=JSON.stringify(row);
    if(data.action==='answer'||data.action==='complete') {
      workshopAnswers(row,data,data.action==='complete');
      if(data.action==='complete'){
        workshopAssert(row.workshop_contact_consent==='YES' && row.full_name && row.whatsapp_number,'INVALID_CONSENT');
        var answers={};Object.keys(QUESTION_FIELDS).forEach(function(k){answers[k]=row[QUESTION_FIELDS[k]];});
        row.video_id=workshopVideo(answers,row.custom_attend_workshop!=='NO');
        row.registration_status='COMPLETE';if(!row.completed_at)row.completed_at=now;
      } else if(row.registration_status==='COMPLETE') {
        // A changed answer invalidates the previous completion until reconfirmed.
        if(before!==JSON.stringify(row)){row.registration_status='STARTED';row.completed_at='';row.video_id='';}
      }
    } else if(data.action==='enquiry') {
      workshopAssert(data.answers && data.answers.Q1==='CUSTOM' && data.custom_attending===false && data.enquiry_consent===true,'INVALID_ENQUIRY');
      var message=workshopText(data.enquiry_text,3000);workshopAssert(message.length>=3,'INVALID_ENQUIRY');
      row.q1_purpose='CUSTOM';row.custom_attend_workshop='NO';row.registration_status='ENQUIRY_ONLY';row.completed_at='';row.video_id='';
      ['q2_stage','q3_challenge','q4_learning_preference'].forEach(function(k){row[k]='';});
      writeAuxiliary(book,'Enquiries',['registration_id','workshop_id','updated_at','full_name','whatsapp_number','enquiry_contact_consent','enquiry_text'],id,[id,WORKSHOP_ID,now.toISOString(),row.full_name,row.whatsapp_number,'YES',literalText(message)]);
    } else {
      workshopAssert(row.registration_status==='COMPLETE','NOT_COMPLETE');
      if(data.action==='preferences'){
        workshopAssert(Array.isArray(data.requests)&&data.requests.length>0&&data.requests.every(function(x){return ['ebook','mentorship','none'].indexOf(x)!==-1;}),'INVALID_PREFERENCE');
        workshopAssert(!(data.requests.indexOf('none')!==-1&&data.requests.length>1),'INVALID_PREFERENCE');
        var ebook=data.requests.indexOf('ebook')!==-1?'YES':'NO',mentor=data.requests.indexOf('mentorship')!==-1?'YES':'NO';
        if(row.ebook_details_requested!==ebook||row.mentorship_details_requested!==mentor){row.ebook_details_requested=ebook;row.mentorship_details_requested=mentor;row.product_request_updated_at=now;}
      } else if(data.action==='invitation_click') { if(!row.group_link_clicked_at)row.group_link_clicked_at=now; }
      else {workshopAssert(['YES','NO','UNKNOWN'].indexOf(data.existing_community_member)!==-1,'INVALID_MEMBERSHIP');row.existing_community_member=data.existing_community_member;}
    }
    if(before!==JSON.stringify(row))row.updated_at=now;
  }
  sheet.getRange(at,1,1,REGISTRATION_HEADERS.length).setValues([recordValues(row)]);
  return {ok:true,registration_id:id,session_token:workshopHmac('registration:'+id,secret),status:data.action==='start'?'started':data.action==='complete'?'complete':data.action==='enquiry'?'enquiry_only':'saved',...(resumed?{resumed:true,registration_status:row.registration_status,custom_attend_workshop:row.custom_attend_workshop,answers:Object.keys(QUESTION_FIELDS).reduce(function(o,k){if(row[QUESTION_FIELDS[k]])o[k]=row[QUESTION_FIELDS[k]];return o;},{})}:{}),...(data.action==='complete'?{video_id:row.video_id}:{})};
}
function setupWorkshopSheets() {
  var p=workshopProperties(),book=SpreadsheetApp.openById(p.SHEET_ID),sheet=book.getSheetByName('Registrations');
  if(!sheet){sheet=book.insertSheet('Registrations');sheet.getRange(1,1,1,REGISTRATION_HEADERS.length).setValues([REGISTRATION_HEADERS]);}
  workshopSheet(book);book.setSpreadsheetTimeZone('Asia/Colombo');sheet.setFrozenRows(1);
  // A phone number is literal text, not a number or a formula.
  sheet.getRange('F:G').setNumberFormat('@');
  ['C','D','K','L','S','W','Y','AD'].forEach(function(c){sheet.getRange(c+'2:'+c).setNumberFormat('yyyy-mm-dd hh:mm:ss');});
  ['H','I','N','AB','AC'].forEach(function(c){sheet.getRange(c+'2:'+c).setDataValidation(SpreadsheetApp.newDataValidation().requireValueInList(['YES','NO'],true).setAllowInvalid(false).build());});
  var columns={M:ANSWER_CODES.Q1,O:ANSWER_CODES.Q2,P:ANSWER_CODES.Q3,Q:ANSWER_CODES.Q4,E:['STARTED','COMPLETE','ENQUIRY_ONLY'],T:['V1','V2','V3','V4','V5'],U:['UNVERIFIED','VERIFIED','INVALID'],V:['YES','NO','UNKNOWN'],X:['UNKNOWN','SELF_REPORTED','CONFIRMED','LEFT'],Z:['UNKNOWN','ATTENDED','ABSENT'],AI:['NORMAL','DUPLICATE_REVIEW','DUPLICATE_CONFIRMED','TEST','SPAM','INVALID'],AL:['NOT_REQUIRED','PENDING','IN_PROGRESS','DONE']};
  Object.keys(columns).forEach(function(c){sheet.getRange(c+'2:'+c).setDataValidation(SpreadsheetApp.newDataValidation().requireValueInList(columns[c],true).setAllowInvalid(false).build());});
  console.log('Workbook schema ready. No participant records added.');
}
