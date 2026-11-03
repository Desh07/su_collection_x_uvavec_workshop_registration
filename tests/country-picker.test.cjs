const {readFileSync}=require('node:fs');
const vm=require('node:vm'), assert=require('node:assert/strict');
const source=readFileSync(require('node:path').join(__dirname,'../app.js'),'utf8');
const start=source.indexOf('  // ---- WhatsApp country code picker');
const end=source.indexOf('  function closeCountryPicker(');
assert.ok(start>0 && end>start,'picker block not found');
const normal=source.slice(source.indexOf('  function normalPhone() {'),source.indexOf('  function validateDetails() {'));
const state={details:{dial:'+94',phone:''}};
const ctx={state,window:{},escape:v=>String(v),$:()=>null};
vm.createContext(ctx);vm.runInContext(source.slice(start,end)+normal+';this.api={countries,countryByIso,POPULAR_COUNTRIES,countryListHtml,selectedCountry,formatDial,countryFlag,normalPhone};',ctx);
const {countries,countryByIso,POPULAR_COUNTRIES,countryListHtml,selectedCountry,formatDial,countryFlag,normalPhone}=ctx.api;

// Data integrity: every row complete, unique ISO, numeric code, the old 10 dropdown codes still present.
assert.ok(countries.length>=230,`only ${countries.length} countries`);
assert.equal(new Set(countries.map(c=>c.iso)).size,countries.length,'duplicate ISO');
for(const c of countries){assert.match(c.iso,/^[A-Z]{2}$/);assert.match(c.dial,/^\+[1-9]\d{0,3}$/,c.iso);assert.ok(c.en,c.iso);}
for(const iso of POPULAR_COUNTRIES) assert.ok(countryByIso[iso],`popular ${iso} missing`);
for(const code of ['+94','+91','+971','+974','+966','+965','+968','+44','+61','+1']) assert.ok(countries.some(c=>c.dial===code),`old code ${code} lost`);
assert.equal(countryByIso.LK.dial,'+94');assert.equal(countryByIso.IT.dial,'+39');assert.equal(countryByIso.JM.dial,'+1876');
assert.equal(formatDial('+1876'),'+1 876');assert.equal(formatDial('+94'),'+94');assert.equal(countryFlag('LK'),'🇱🇰');

// Default and shared codes resolve to sensible countries.
assert.equal(selectedCountry().iso,'LK');
state.details.dial='+1';state.dialCountry=undefined;assert.equal(selectedCountry().iso,'US');
state.dialCountry='CA';assert.equal(selectedCountry().iso,'CA');
state.details.dial='+44';state.dialCountry='GB';assert.equal(selectedCountry().iso,'GB');

// Search: English name (with/without accents), Sinhala name, ISO, dial code with or without "+".
const isos=html=>[...html.matchAll(/data-iso="([A-Z]{2})"/g)].map(m=>m[1]);
assert.deepEqual(isos(countryListHtml('ita')).slice(0,1),['IT']);
assert.ok(isos(countryListHtml('curacao')).includes('CW'),'accent-insensitive search');
assert.ok(isos(countryListHtml('ඉතාලිය')).includes('IT'),'Sinhala search');
assert.ok(isos(countryListHtml('+971')).includes('AE'));assert.ok(isos(countryListHtml('94')).includes('LK'));
assert.ok(isos(countryListHtml('lk')).includes('LK'),'ISO search');
assert.match(countryListHtml('zzzz'),/cc-empty/);
const empty=isos(countryListHtml(''));assert.equal(empty.length,POPULAR_COUNTRIES.length+countries.length,'popular + all rows');
assert.equal(empty[0],'LK');

// The saved number uses the chosen code; a local leading 0 is dropped; a typed +code wins.
state.details.dial='+39';state.details.phone='0312 345 678';assert.equal(normalPhone(),'+39312345678');
state.details.dial='+94';state.details.phone='077 123 4567';assert.equal(normalPhone(),'+94771234567');
state.details.phone='+971501234567';assert.equal(normalPhone(),'+971501234567');
console.log(`PASS: ${countries.length} countries with flags, popular list, shared-code resolution, search (EN/SI/ISO/code) and phone normalisation.`);
