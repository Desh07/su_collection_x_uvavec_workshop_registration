const fs=require('node:fs'),vm=require('node:vm'),assert=require('node:assert/strict'),crypto=require('node:crypto');
class Range {
 constructor(sheet,row,col,nr=1,nc=1){Object.assign(this,{sheet,row,col,nr,nc});}
 getValues(){return Array.from({length:this.nr},(_,r)=>Array.from({length:this.nc},(_,c)=>this.sheet.rows[this.row+r-1]?.[this.col+c-1]??''));}
 setValues(values){values.forEach((v,r)=>{const at=this.row+r-1;this.sheet.rows[at]??=[];v.forEach((x,c)=>this.sheet.rows[at][this.col+c-1]=x);});return this;}
 setNumberFormat(){return this;}
 getRow(){return this.row;}
 createTextFinder(id){const self=this;return {matchEntireCell(){return this;},matchCase(){return this;},findAll(){return self.getValues().flatMap((r,i)=>r[0]===id?[new Range(self.sheet,self.row+i,1)]:[]);}};}
}
class Sheet {constructor(name){this.name=name;this.rows=[];}getLastRow(){return this.rows.length;}getRange(...args){return new Range(this,...args);}setFrozenRows(){}}
class Book{constructor(){this.sheets={};}getSheetByName(n){return this.sheets[n]||null;}insertSheet(n){return this.sheets[n]=new Sheet(n);}}
const secret='test-only-shared-secret-32-bytes-long';
const utilities={Charset:{UTF_8:'utf8'},DigestAlgorithm:{SHA_256:'sha256'},computeHmacSha256Signature:(s,k)=>[...crypto.createHmac('sha256',k).update(s).digest()],computeDigest:(a,s)=>[...crypto.createHash('sha256').update(s).digest()],base64Decode:s=>Buffer.from(s,'base64'),newBlob:b=>({getDataAsString:()=>Buffer.from(b).toString('utf8')})};
const context=vm.createContext({console,Utilities:utilities,ContentService:{MimeType:{JSON:'json'},createTextOutput:text=>({text,setMimeType(){return this;}})},PropertiesService:{getScriptProperties:()=>({getProperties:()=>({SHEET_ID:'test',SHARED_SECRET:secret})})}});
vm.runInContext(fs.readFileSync('apps-script.js','utf8'),context);
const book=new Book(),sheet=book.insertSheet('Registrations');sheet.rows.push([...context.REGISTRATION_HEADERS]);
context.SpreadsheetApp={openById:()=>book,flush(){}};
let locked=false;context.LockService={getScriptLock:()=>({tryLock(){locked=true;return true;},hasLock(){return locked;},releaseLock(){locked=false;}})};
let serial=0;
const base=(action,extra={})=>({action,event_id:context.WORKSHOP_ID,quiz_version:context.QUIZ_VERSION,consent_version:context.CONSENT_VERSION,request_id:`request-${++serial}`, ...extra});
const startPayload=base('start',{details:{name:'නදීශා විජේරත්න',phone:'0771234567',email:'sample@example.test',workshop_contact_acknowledgement:true,marketing_opt_in:false,attribution:{utm_source:'whatsapp'},test_flag:true}});
const call=p=>JSON.parse(JSON.stringify(context.saveWorkshopRecord(book,p,secret)));
const begun=call(startPayload),session={registration_id:begun.registration_id,session_token:begun.session_token};
assert.equal(begun.status,'started');assert.equal(sheet.rows.length,2);assert.equal(call(startPayload).registration_id,begun.registration_id);assert.equal(sheet.rows.length,2);
const row=()=>context.recordFromValues(sheet.rows[1]);
assert.equal(row().registration_status,'STARTED');assert.equal(row().contact_verification_status,'UNVERIFIED');assert.equal(row().marketing_opt_in,'NO');assert.equal(row().ebook_details_requested,'NO');assert.equal(row().utm_source,'whatsapp');assert.equal(row().record_flag,'TEST');
assert.equal(row().whatsapp_number,"'+94771234567");assert.equal(row().completed_at,'');assert.equal(book.getSheetByName('Contact Extras').rows.length,2);
const edited=call(base('start',{...session,details:{...startPayload.details,name:'නදීශා සංශෝධිත',marketing_opt_in:true}}));
assert.equal(edited.registration_id,begun.registration_id);assert.equal(sheet.rows.length,2);assert.equal(row().full_name,'නදීශා සංශෝධිත');assert.equal(row().marketing_opt_in,'YES');
assert.throws(()=>call(base('start',{...session,session_token:'bad-token',details:startPayload.details})),/UNAUTHORIZED/);
const answers={Q1:'START',Q2:'SKILL',Q3:'PRICE',Q4:'GUIDED'};
call(base('answer',{...session,answers:{Q1:'START'}}));assert.equal(row().q1_purpose,'START');assert.equal(row().q2_stage,'');
assert.throws(()=>call(base('complete',{...session,answers:{Q1:'START'}})),/INVALID_ANSWER/);assert.equal(row().registration_status,'STARTED');
const complete=base('complete',{...session,answers});assert.equal(call(complete).video_id,'V2');const completedAt=row().completed_at;
call(complete);assert.equal(row().completed_at,completedAt);assert.equal(row().mentorship_details_requested,'NO');assert.equal(row().ebook_details_requested,'NO');
call(base('preferences',{...session,requests:['mentorship']}));assert.equal(row().mentorship_details_requested,'YES');assert.equal(row().ebook_details_requested,'NO');
call(base('preferences',{...session,requests:['none']}));assert.equal(row().mentorship_details_requested,'NO');
call(base('invitation_click',session));const clicked=row().group_link_clicked_at;call(base('invitation_click',session));assert.equal(row().group_link_clicked_at,clicked);assert.equal(row().group_join_status,'UNKNOWN');
assert.throws(()=>call(base('preferences',{...session,session_token:'bad-token',requests:['ebook']})),/UNAUTHORIZED/);
assert.throws(()=>call(base('answer',{...session,answers:{Q1:'WRONG'}})),/INVALID_ANSWER/);
assert.throws(()=>call(base('start',{details:{...startPayload.details,workshop_contact_acknowledgement:false}})),/INVALID_CONSENT/);
assert.throws(()=>call(base('start',{details:{...startPayload.details,marketing_opt_in:'YES'}})),/INVALID_CONSENT/);
assert.throws(()=>call(base('complete',{...session,answers:{...answers,Q1:'CUSTOM'},custom_attending:false})),/INVALID_ATTENDANCE/);
const enquiry=base('enquiry',{...session,answers:{Q1:'CUSTOM'},custom_attending:false,enquiry_consent:true,enquiry_text:'මට ඇඳුමක් ගැන විමසන්න අවශ්‍යයි.'});
assert.equal(call(enquiry).status,'enquiry_only');assert.equal(row().completed_at,'');assert.equal(row().video_id,'');assert.equal(row().q2_stage,'');assert.equal(book.getSheetByName('Enquiries').rows.length,2);
assert.throws(()=>call(base('invitation_click',session)),/NOT_COMPLETE/);
const dup1=call(base('start',{details:{...startPayload.details,test_flag:false,email:''}}));
const duprow=context.recordFromValues(sheet.rows[2]);assert.equal(duprow.record_flag,'DUPLICATE_REVIEW');assert.equal(duprow.duplicate_of_registration_id,'');
assert.equal(context.literalText('=IMPORTXML("x")'),"'=IMPORTXML(\"x\")");
let cases=0;
for(const q1 of context.ANSWER_CODES.Q1)for(const q2 of context.ANSWER_CODES.Q2)for(const q3 of context.ANSWER_CODES.Q3)for(const q4 of context.ANSWER_CODES.Q4){
 const a={Q1:q1,Q2:q2,Q3:q3,Q4:q4};const expected=q1==='CUSTOM'?'V5':q1==='LEARN'?'V4':q1==='UNSURE'?'V5':q1==='IMPROVE'||['OCCASIONAL','REGULAR'].includes(q2)?'V3':q1==='START'&&q2==='SKILL'?'V2':'V1';
 assert.equal(context.workshopVideo(a,true),expected);cases++;
}
assert.equal(cases,600);assert.equal(context.workshopVideo({Q1:'CUSTOM'},false),null);
const forged=context.doPost({postData:{contents:JSON.stringify({timestamp:Math.floor(Date.now()/1000),payload:Buffer.from(JSON.stringify(complete)).toString('base64'),signature:'forged'})}});assert.equal(JSON.parse(forged.text).error.code,'UNAUTHORIZED');assert.equal(locked,false);
const validPayload=Buffer.from(JSON.stringify(base('start',{details:{...startPayload.details,phone:'+94771234568',email:''}}))).toString('base64');const timestamp=Math.floor(Date.now()/1000);
const signed=context.doPost({postData:{contents:JSON.stringify({timestamp,payload:validPayload,signature:crypto.createHmac('sha256',secret).update(timestamp+'\n'+validPayload).digest('hex')})}});assert.equal(JSON.parse(signed.text).ok,true);assert.equal(locked,false);
console.log(`PASS: ${cases} routes, signed requests, field mapping, durable retries, incomplete/invalid gates, optional requests, enquiries and membership semantics (mock Sheets).`);
