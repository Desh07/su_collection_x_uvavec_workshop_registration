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
const det={name:'Nadeesha Perera',phone:'0771112223',email:'',workshop_contact_acknowledgement:true,marketing_opt_in:false};
// 1st visit: details + 2 answers, then drop off
const first=call(base('start',{details:det}));
const s1={registration_id:first.registration_id,session_token:first.session_token};
assert.equal(first.resumed,undefined);
call(base('answer',{...s1,answers:{Q1:'START'}}));call(base('answer',{...s1,answers:{Q1:'START',Q2:'SKILL'}}));
const rowsBefore=sheet.rows.length;
// Returning browser supplies its private token; name/number alone never unlock a record.
const again=call(base('start',{...s1,details:{...det,name:'  nadeesha   PERERA '}}));
assert.equal(again.registration_id,first.registration_id);assert.equal(again.resumed,true);
assert.deepEqual(again.answers,{Q1:'START',Q2:'SKILL'});assert.equal(sheet.rows.length,rowsBefore);
// continue and finish on the resumed record
const s2={registration_id:again.registration_id,session_token:again.session_token};
assert.equal(call(base('complete',{...s2,answers:{Q1:'START',Q2:'SKILL',Q3:'PRICE',Q4:'GUIDED'}})).status,'complete');
// Same name and phone without the private token cannot read or edit prior answers.
const other=call(base('start',{details:det}));
assert.notEqual(other.registration_id,first.registration_id);assert.equal(other.resumed,undefined);assert.equal(sheet.rows.length,rowsBefore+1);
assert.equal(other.answers,undefined);
assert.throws(()=>call(base('start',{...s1,session_token:'wrong',details:det})),/UNAUTHORIZED/);
console.log('PASS: token-authenticated resume preserves answers; name and phone alone cannot unlock previous records.');
