const fs=require('node:fs'),vm=require('node:vm'),assert=require('node:assert/strict');
const source=fs.readFileSync(require('node:path').join(__dirname,'../app.js'),'utf8');
const save=source.slice(source.indexOf('  async function save(work) {'),source.indexOf('  function setPending(value) {'));
const handler=source.split('\n').find(l=>l.includes("on('flow-preferences','click'"));
const state={screen:'result',requests:[],pending:false,error:''};let click,resolve,reject;
const ctx={state,on:(id,event,fn)=>click=fn,request:()=>new Promise((a,b)=>{resolve=a;reject=b;}),setPending:()=>{},render:()=>{},generalError:()=> 'Save failed'};
vm.createContext(ctx);vm.runInContext(save+'\n'+handler,ctx);
(async()=>{
 let pending=click();assert.equal(state.screen,'result','no success until acknowledged save');reject(new Error('offline'));await pending;assert.equal(state.screen,'result');assert.equal(state.error,'Save failed');
 pending=click();assert.equal(state.screen,'result');resolve({ok:true,status:'saved'});await pending;assert.equal(state.screen,'success');assert.equal(state.preferenceSaved,true);assert.equal(state.pending,false);
 console.log('PASS: final success appears only after acknowledged save; failed saves retain the form for retry.');
})().catch(e=>{console.error(e);process.exitCode=1;});
