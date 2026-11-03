/* Four-question workshop registration. Only a private resume token and contact fingerprint are persisted; no contact details or answers are stored. */
(() => {
  'use strict';
  const config = window.WORKSHOP_CONFIG || { mode: 'preview' };
  const preview = config.mode !== 'production';
  const event = config.event || {};
  const eventId = config.event_id || config.eventId || event.id || 'su-workshop-2026-11-14';
  const questions = [
    { id: 'Q1', title: 'ඔබ මෙම වැඩමුළුවට එක්වීමට ප්‍රධාන හේතුව කුමක්ද?', choices: {
      START: 'කුඩා මැහුම් ව්‍යාපාරයක් ආරම්භ කිරීමට අවශ්‍යයි.', IMPROVE: 'දැනට මැහුම් ඇණවුම් භාරගන්නවා. ව්‍යාපාරය දියුණු කරගැනීමට අවශ්‍යයි.', LEARN: 'මට ප්‍රධාන වශයෙන් මැහුම් කුසලතා ඉගෙනගැනීමට අවශ්‍යයි.', CUSTOM: 'ඇඳුමක් මස්සවා ගැනීම හෝ නිෂ්පාදනයක් මිලදී ගැනීම ගැන විමසීමට අවශ්‍යයි.', UNSURE: 'තවමත් සොයා බලනවා. ආරම්භ කළ යුත්තේ කොතැනින්ද කියා දැනගැනීමට අවශ්‍යයි.' } },
    { id: 'Q2', title: 'දැනට ඔබ සිටින තත්ත්වයට වඩාත් ගැලපෙන්නේ කුමක්ද?', choices: {
      NEW: 'මම මැහුම් ඉගෙනගැනීම ආරම්භ කරන කෙනෙක්.', SKILL: 'මට මහන්න පුළුවන්. නමුත් මුදල් අය කර ඇණවුම් භාරගෙන නැහැ.', OCCASIONAL: 'මම ඉඳහිට මුදල් අය කර මැහුම් ඇණවුම් භාරගන්නවා.', REGULAR: 'මම මැහුම් ව්‍යාපාරයක් කරගෙන යනවා හෝ නිතිපතා ඇණවුම් භාරගන්නවා.', PREFER_NOT: 'මේ ගැන සඳහන් කිරීමට කැමති නැහැ.' } },
    { id: 'Q3', title: 'ඔබට වැඩිපුරම සහාය අවශ්‍ය කුමන කරුණටද? එකක් තෝරන්න.', choices: {
      RESOURCES: 'දැනට තිබෙන මුදල්, උපකරණ සහ දක්ෂතා භාවිතයෙන් ආරම්භ කිරීම.', PRODUCT: 'සුදුසු නිෂ්පාදනයක් තෝරාගෙන පාරිභෝගික ඉල්ලුම හඳුනාගැනීම.', FABRIC: 'රෙදි නාස්තිය අවම කර අමුද්‍රව්‍ය වියදම් පාලනය කිරීම.', PRICE: 'වියදම් ගණනය කර විකුණුම් මිලක් තීරණය කිරීම.', ORDERS: 'ඇණවුම් හොඳින් භාරදී නැවත ඇණවුම් ලැබෙන පාරිභෝගික සබඳතා ගොඩනැඟීම.', NOT_SURE: 'මට තවමත් පැහැදිලි නැහැ.' } },
    { id: 'Q4', title: 'මේ අවස්ථාවේ ඔබ ඉගෙනගැනීමට කැමති කුමන ආකාරයෙන්ද?', choices: {
      FREE: 'දැනට නොමිලේ වැඩමුළු සහ ප්‍රායෝගික පාඩම් හරහා.', SELF: 'තනිවම අනුගමනය කළ හැකි ක්‍රමානුකූල මාර්ගෝපදේශයක් හරහා.', GUIDED: 'පුද්ගලික මඟපෙන්වීම සහ මගේ වැඩ පිළිබඳ ප්‍රතිචාර සමඟ.', EXPLORE: 'මම තවමත් තීරණය කරමින් සිටිනවා.' } }
  ];
  function selectVideo(answers, customAttending = true) {
    if (answers?.Q1 === 'CUSTOM' && customAttending === false) return null;
    for (const q of questions) if (!Object.hasOwn(q.choices, answers[q.id])) throw new Error('INVALID_ANSWER');
    if (answers.Q1 === 'CUSTOM') return customAttending === false ? null : 'V5';
    if (answers.Q1 === 'LEARN') return 'V4';
    if (answers.Q1 === 'UNSURE') return 'V5';
    if (answers.Q1 === 'IMPROVE' || ['OCCASIONAL', 'REGULAR'].includes(answers.Q2)) return 'V3';
    if (answers.Q1 === 'START' && answers.Q2 === 'SKILL') return 'V2';
    return 'V1';
  }
  const transcripts = {
    V1: 'ඔබට අවශ්‍ය ආරම්භ කරන්න හොඳ තැනක් හඳුනාගන්නයි. අලුත් උපකරණ හෝ අමුද්‍රව්‍ය සඳහා මුදල් වැය කරන්න කලින්, දැනට ඔබ සතුව තිබෙන දේ සහ තව ඉගෙනගත යුතු දේ හඳුනාගැනීම වැදගත්. මේ වැඩමුළුවේදී සම්පත්, නිෂ්පාදන, වියදම් සහ පාරිභෝගිකයන් ගැන මුල් ව්‍යාපාරික තීරණ සාකච්ඡා කරනවා. මෙය මූලික මැහුම් පුහුණුවක් වෙනුවට පැවැත්වෙන පාඨමාලාවක් නොවේ. ඔබේ ලියාපදිංචිය සම්පූර්ණයි. පහත බොත්තමෙන් WhatsApp ප්‍රජාවට එක්වී ඔබට පහසු වේලාවට ඡන්දය දෙන්න. වැඩමුළුවට සම්බන්ධ වන තොරතුරුත් එහි ලැබෙනවා.',
    V2: 'ඔබට දැනටමත් මැහුම් හැකියාව තිබෙනවා. දැන් ඒ හැකියාවෙන් කුඩා ව්‍යාපාරයක් ආරම්භ කරන්න ඔබ කැමතියි. ඊළඟට වැදගත් වෙන්නේ සුදුසු එක නිෂ්පාදනයක් තෝරාගෙන, එය අවශ්‍ය කාටද සහ එය නිපදවීමට කොපමණ වියදමක් යනවාද කියා හඳුනාගැනීමයි. වැඩමුළුවේදී ඒ තීරණ රෙදි භාවිතය, මිල තීරණය කිරීම සහ මුල් ඇණවුම් භාරගැනීම සමඟ සම්බන්ධ කර බලනවා. ඔබේ ලියාපදිංචිය සම්පූර්ණයි. WhatsApp ප්‍රජාවට එක්වී ඔබට පහසු වේලාවට ඡන්දය දෙන්න. ඔබ ආරම්භ කිරීමට කැමති නිෂ්පාදනයක් ගැනත් සිතාගෙන එන්න.',
    V3: 'ඔබ දැනටමත් මැහුම් ඇණවුම් භාරගන්න කෙනෙක්. අමුද්‍රව්‍ය වියදම් පාලනය කරන්න, මිල තීරණය කරන්න සහ ඇණවුම් හොඳින් භාරදෙන්න වඩා පැහැදිලි ක්‍රමයක් ඔබට අවශ්‍ය වෙන්න පුළුවන්. මේ වැඩමුළුවේදී ඒ ව්‍යාපාරික තීරණ සහ හොඳ සේවාවක් තුළින් පාරිභෝගික විශ්වාසය ගොඩනඟාගන්නා ආකාරය ගැන කතා කරනවා. මෑතකදී කළ ඇණවුමක් සහ එහිදී මුහුණ දුන් අපහසුතාවක් මතක් කරගෙන එන්න. පාඩම අතරතුර එය ඔබේම උදාහරණයක් ලෙස භාවිත කරන්න පුළුවන්. ඔබේ ලියාපදිංචිය සම්පූර්ණයි. WhatsApp ප්‍රජාවට එක්වී පහසු වේලාවට ඡන්දය දෙන්න.',
    V4: 'ඔබට ප්‍රධාන වශයෙන් අවශ්‍ය මැහුම් ඉගෙනගැනීමට බව අපි තේරුම් ගත්තා. මේ වැඩමුළුවේ අවධානය යොමුවෙන්නේ නිෂ්පාදන තෝරාගැනීම, රෙදි හොඳින් භාවිත කිරීම, වියදම් ගණනය කිරීම සහ පාරිභෝගිකයන්ට සේවය කිරීම වැනි ව්‍යාපාරික කරුණු වෙතයි. මෙය පියවරෙන් පියවර මැහුම් ක්‍රම උගන්වන පන්තියක් නොවේ. මැහුම් හැකියාව කුඩා ව්‍යාපාරයකට සම්බන්ධ කරගන්නේ කොහොමද කියා දැනගන්න කැමති නම් ඔබට සහභාගී වෙන්න පුළුවන්. ඔබේ ලියාපදිංචිය සම්පූර්ණයි. WhatsApp ප්‍රජාවට එක්වී ඔබට පහසු වේලාවට ඡන්දය දෙන්න.',
    V5: 'ඔබට අවශ්‍ය දේ ගැන තවමත් සොයා බලමින් සිටිනවා නම් ඒක ගැටලුවක් නැහැ. මේ නොමිලේ වැඩමුළුවෙන් කුඩා මැහුම් ව්‍යාපාරයක ප්‍රායෝගික තීරණ ගැන හඳුන්වා දෙනවා. ගාස්තු අය කරන වැඩසටහනකට බැඳෙන්නේ නැතිව ඔබට මේ අදහස් ගැන ඉගෙනගන්න පුළුවන්. ඇඳුමක් මස්සවා ගැනීම හෝ නිෂ්පාදනයක් ගැන විමසීමක් තිබෙනවා නම් එය වෙනම සලකා බලන්න පුළුවන්. ඔබේ වැඩමුළු ලියාපදිංචිය සම්පූර්ණයි. WhatsApp ප්‍රජාවට එක්වී ඔබට පහසු වේලාවට ඡන්දය දෙන්න. සම්බන්ධ වීමේ තොරතුරුත් එහි ලැබෙනවා.'
  };
  const state = { screen: 'details', detailStep: 0, step: 0, answers: {}, details: { name: '', phone: '', email: '', dial: '+94', workshop_contact_acknowledgement: false, marketing_opt_in: false }, registration_id: null, session_token: null, custom_attending: null, enquiry_text: '', enquiry_consent: false, requests: [], membership: 'unknown', pending: false, error: '', errors: {}, saved: false, video: null };
  const operations = new Map();
  const emitted = new Set();
  let returnFocus, oldOverflow, opened = false, renderedKey = '';
  const $ = id => document.getElementById(id);
  const escape = v => String(v ?? '').replace(/[&<>"']/g, c => ({ '&':'&amp;', '<':'&lt;', '>':'&gt;', '"':'&quot;', "'":'&#39;' }[c]));
  const uid = () => window.crypto?.randomUUID?.() || `r${Date.now()}${Math.random().toString(36).slice(2)}`;
  const safeUrl = v => { if (typeof v !== 'string' || !v.trim()) return ''; try { const u = new URL(v, location.href); return ['https:', 'http:'].includes(u.protocol) ? u.href : ''; } catch { return ''; } };
  const community = () => safeUrl(config.communityUrl || config.community_url || '');
  const help = () => safeUrl(config.helpUrl || config.help_url || '');
  const timeConfirmed = () => (event.timeStatus || config.time_status) === 'confirmed';
  const dateText = () => window.WorkshopI18n?.getLanguage() === 'en' ? new Date(`${event.date || '2026-11-14'}T12:00:00+05:30`).toLocaleDateString('en-GB',{day:'numeric',month:'long',year:'numeric',timeZone:'Asia/Colombo'}) : event.dateLabel || config.dateLabel || '2026 නොවැම්බර් 14';
  const timeText = () => timeConfirmed() ? (event.timeLabel || config.timeLabel || 'තහවුරු කළ වේලාව ලබාදී නැත') : 'වේලාව WhatsApp ප්‍රජාවේ ඡන්ද විමසීමෙන් පසු තහවුරු කෙරේ.';
  function analytics(name, data = {}, once = true) {
    const key = `${name}:${data.step || ''}:${name === 'registration_start' ? 'session' : state.registration_id || 'open'}`;
    if (once && emitted.has(key)) return;
    emitted.add(key);
    window.dispatchEvent(new CustomEvent('workshop:analytics', { detail: { event: name, event_id: eventId, preview, ...data } }));
  }
  async function previewTransport(payload) {
    // This local adapter deliberately makes no network requests.
    return { ok: true, registration_id: state.registration_id || `preview-${uid()}`, session_token: state.session_token || uid(), status: ({ start: 'started', answer: 'quiz_in_progress', complete: 'complete', enquiry: 'enquiry_only' })[payload.action] || 'saved', video_id: payload.action === 'complete' ? selectVideo(payload.answers, payload.custom_attending) : undefined };
  }
  async function request(action, extra = {}) {
    const data = { action, event_id: eventId, quiz_version: config.quizVersion, consent_version: config.consentVersion, ...(state.registration_id ? { registration_id: state.registration_id, session_token: state.session_token } : {}), ...extra };
    if (data.custom_attending === null || data.custom_attending === undefined) delete data.custom_attending;
    const signature = JSON.stringify(data);
    let op = operations.get(signature);
    if (!op) { op = { ...data, request_id: uid() }; operations.set(signature, op); }
    let last;
    for (let attempt = 0; attempt < 2; attempt++) {
      const controller = new AbortController();
      const timer = setTimeout(() => controller.abort(), config.requestTimeoutMs || 15000);
      try {
        let result;
        if (typeof window.WORKSHOP_TRANSPORT === 'function') result = await Promise.race([window.WORKSHOP_TRANSPORT(op, { signal: controller.signal, preview }), new Promise((_, reject) => controller.signal.addEventListener('abort', () => reject(new Error('TIMEOUT')), { once: true }))]);
        else if (preview) result = await previewTransport(op);
        else {
          const endpoint = safeUrl(config.endpoint || config.apiEndpoint || '');
          if (!endpoint) throw new Error('ENDPOINT_NOT_CONFIGURED');
          const response = await fetch(endpoint, { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(op), signal: controller.signal, credentials: 'omit' });
          if (!response.ok) throw new Error(`HTTP_${response.status}`);
          result = await response.json();
        }
        if (!result || result.ok !== true) {
          const error = new Error(result?.error?.code || 'SAVE_FAILED'); error.backend = true; throw error;
        }
        return result;
      } catch (error) { last = error; if (error.backend || error.message === 'ENDPOINT_NOT_CONFIGURED') break; }
      finally { clearTimeout(timer); }
    }
    throw last || new Error('SAVE_FAILED');
  }
  function generalError() {
    return 'ඔබේ පිළිතුරු සුරැකීමට නොහැකි විය. ඔබ ඇතුළත් කළ තොරතුරු මෙහි තවමත් ඇත. කරුණාකර නැවත උත්සාහ කරන්න.';
  }

  async function save(work) {
    if (state.pending) return;
    state.pending = true; state.error = ''; setPending(true);
    try { await work(); } catch (error) { state.error = generalError(error); }
    finally { state.pending = false; render(); }
  }
  function setPending(value) {
    for (const id of ['quiz-content-area', 'quiz-nav']) $(id)?.querySelectorAll('button,input,select,textarea').forEach(el => el.disabled = value);
    $('quiz-content-area')?.setAttribute('aria-busy', String(value));
    const status = $('flow-status'); if (status) status.textContent = value ? (state.screen === 'review' ? 'ඔබේ ලියාපදිංචිය සම්පූර්ණ කරමින් පවතී…' : 'ඔබේ තොරතුරු සුරකිමින් පවතී…') : '';
  }
  function captureDetails() {
    for (const key of ['name', 'phone', 'email', 'dial']) if ($(`flow-${key}`)) state.details[key] = $(`flow-${key}`).value;
    for (const key of ['workshop_contact_acknowledgement', 'marketing_opt_in']) if ($(`flow-${key}`)) state.details[key] = $(`flow-${key}`).checked;
  }
  function normalPhone() {
    const raw = state.details.phone.trim().replace(/[\s().-]/g, '');
    if (raw.startsWith('+')) return raw;
    return state.details.dial + raw.replace(/^0/, '');
  }
  function validateDetails() {
    const d = state.details, errors = {};
    if (d.name.trim().length < 2 || !/\p{L}/u.test(d.name)) errors.name = 'කරුණාකර ඔබේ නම ඇතුළත් කරන්න.';
    if (!/^\+[1-9]\d{7,14}$/.test(normalPhone())) errors.phone = 'කරුණාකර නිවැරදි WhatsApp අංකයක් ඇතුළත් කර රටේ දුරකථන කේතය පරීක්ෂා කරන්න.';
    if (d.email.trim() && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(d.email.trim())) errors.email = 'කරුණාකර නිවැරදි විද්‍යුත් තැපැල් ලිපිනයක් ඇතුළත් කරන්න.';
    if (false) errors.workshop_contact_acknowledgement = 'ඉදිරියට යාමට වැඩමුළුව පිළිබඳ පණිවිඩ ලබාගැනීම සඳහා ඇති එකඟතාව තහවුරු කරන්න.';
    state.errors = errors; return Object.keys(errors).length === 0;
  }
  const checked = yes => yes ? ' checked' : '';
  const errorFor = key => state.errors[key] ? `<span class="cf-err" id="error-${key}">${escape(state.errors[key])}</span>` : '';
  const attrs = key => state.errors[key] ? ` aria-invalid="true" aria-describedby="error-${key}"` : '';
  const check = (id, label, value) => `<label class="flow-check"><input id="flow-${id}" type="checkbox"${checked(value)}${attrs(id)}><span>${label}</span></label>${errorFor(id)}`;
  const action = (id, text, secondary = false) => `<button id="${id}" type="button" class="${secondary ? 'btn-back' : 'quiz-ok-btn'}">${text}</button>`;
  function resource(id, label, url, secondary = false) {
    const classes = secondary ? 'btn-back flow-resource-button' : 'btn btn-primary flow-resource-button';
    return url ? `<a id="${id}" class="${classes}" href="${escape(url)}" target="_blank" rel="noopener">${label}</a>` : `<button id="${id}" class="${classes}" type="button" data-resource="${id}">${label}</button><span class="flow-resource-status" id="${id}-status" role="status" aria-live="polite"></span>`;
  }
  const icons = {
    name: '<svg viewBox="0 0 24 24"><circle cx="12" cy="8" r="4"/><path d="M4 21c1.5-4 4.5-6 8-6s6.5 2 8 6"/></svg>',
    phone: '<svg viewBox="0 0 24 24"><path d="M6.6 3.5 9 4.2l1.1 3.9-2 1.6a13 13 0 0 0 6.2 6.2l1.6-2 3.9 1.1.7 2.4c-.3 1.8-1.8 3.1-3.6 3.1C9.9 20.5 3.5 14.1 3.5 7.1c0-1.8 1.3-3.3 3.1-3.6Z"/></svg>',
    email: '<svg viewBox="0 0 24 24"><circle cx="12" cy="12" r="4"/><path d="M16 12v1.5a2.5 2.5 0 0 0 5 0V12a9 9 0 1 0-3.5 7.1"/></svg>'
  };
  const pillIcon = key => `<span class="pill-icon" aria-hidden="true">${icons[key]}</span>`;
  const choiceKey = i => `<span class="quiz-choice-key" aria-hidden="true">${'ABCDEF'[i]}</span>`;
  // ---- WhatsApp country code picker: popup with search, flags and every country ----
  // ISO | calling code | English name | Sinhala name (common countries only)
  const COUNTRY_DATA = `AF|93|Afghanistan
AX|358|Åland Islands
AL|355|Albania
DZ|213|Algeria
AS|1684|American Samoa
AD|376|Andorra
AO|244|Angola
AI|1264|Anguilla
AG|1268|Antigua and Barbuda
AR|54|Argentina
AM|374|Armenia
AW|297|Aruba
AU|61|Australia|ඕස්ට්‍රේලියාව
AT|43|Austria|ඔස්ට්‍රියාව
AZ|994|Azerbaijan
BS|1242|Bahamas
BH|973|Bahrain|බහරේන්
BD|880|Bangladesh|බංග්ලාදේශය
BB|1246|Barbados
BY|375|Belarus
BE|32|Belgium|බෙල්ජියම
BZ|501|Belize
BJ|229|Benin
BM|1441|Bermuda
BT|975|Bhutan|භූතානය
BO|591|Bolivia
BA|387|Bosnia and Herzegovina
BW|267|Botswana
BR|55|Brazil|බ්‍රසීලය
IO|246|British Indian Ocean Territory
VG|1284|British Virgin Islands
BN|673|Brunei
BG|359|Bulgaria
BF|226|Burkina Faso
BI|257|Burundi
KH|855|Cambodia
CM|237|Cameroon
CA|1|Canada|කැනඩාව
CV|238|Cape Verde
BQ|599|Caribbean Netherlands
KY|1345|Cayman Islands
CF|236|Central African Republic
TD|235|Chad
CL|56|Chile
CN|86|China|චීනය
CO|57|Colombia
KM|269|Comoros
CG|242|Congo
CD|243|Congo (DRC)
CK|682|Cook Islands
CR|506|Costa Rica
CI|225|Côte d'Ivoire
HR|385|Croatia
CU|53|Cuba
CW|599|Curaçao
CY|357|Cyprus|සයිප්‍රසය
CZ|420|Czechia
DK|45|Denmark|ඩෙන්මාර්කය
DJ|253|Djibouti
DM|1767|Dominica
DO|1809|Dominican Republic
EC|593|Ecuador
EG|20|Egypt|ඊජිප්තුව
SV|503|El Salvador
GQ|240|Equatorial Guinea
ER|291|Eritrea
EE|372|Estonia
SZ|268|Eswatini
ET|251|Ethiopia
FK|500|Falkland Islands
FO|298|Faroe Islands
FJ|679|Fiji
FI|358|Finland|ෆින්ලන්තය
FR|33|France|ප්‍රංශය
GF|594|French Guiana
PF|689|French Polynesia
GA|241|Gabon
GM|220|Gambia
GE|995|Georgia
DE|49|Germany|ජර්මනිය
GH|233|Ghana
GI|350|Gibraltar
GR|30|Greece|ග්‍රීසිය
GL|299|Greenland
GD|1473|Grenada
GP|590|Guadeloupe
GU|1671|Guam
GT|502|Guatemala
GG|44|Guernsey
GN|224|Guinea
GW|245|Guinea-Bissau
GY|592|Guyana
HT|509|Haiti
HN|504|Honduras
HK|852|Hong Kong|හොංකොං
HU|36|Hungary
IS|354|Iceland
IN|91|India|ඉන්දියාව
ID|62|Indonesia|ඉන්දුනීසියාව
IR|98|Iran
IQ|964|Iraq
IE|353|Ireland|අයර්ලන්තය
IM|44|Isle of Man
IL|972|Israel|ඊශ්‍රායලය
IT|39|Italy|ඉතාලිය
JM|1876|Jamaica
JP|81|Japan|ජපානය
JE|44|Jersey
JO|962|Jordan|ජෝර්දානය
KZ|7|Kazakhstan
KE|254|Kenya
KI|686|Kiribati
XK|383|Kosovo
KW|965|Kuwait|කුවේට්
KG|996|Kyrgyzstan
LA|856|Laos
LV|371|Latvia
LB|961|Lebanon|ලෙබනනය
LS|266|Lesotho
LR|231|Liberia
LY|218|Libya
LI|423|Liechtenstein
LT|370|Lithuania
LU|352|Luxembourg
MO|853|Macau
MG|261|Madagascar
MW|265|Malawi
MY|60|Malaysia|මැලේසියාව
MV|960|Maldives|මාලදිවයින
ML|223|Mali
MT|356|Malta|මෝල්ටාව
MH|692|Marshall Islands
MQ|596|Martinique
MR|222|Mauritania
MU|230|Mauritius
YT|262|Mayotte
MX|52|Mexico
FM|691|Micronesia
MD|373|Moldova
MC|377|Monaco
MN|976|Mongolia
ME|382|Montenegro
MS|1664|Montserrat
MA|212|Morocco
MZ|258|Mozambique
MM|95|Myanmar|මියන්මාරය
NA|264|Namibia
NR|674|Nauru
NP|977|Nepal|නේපාලය
NL|31|Netherlands|නෙදර්ලන්තය
NC|687|New Caledonia
NZ|64|New Zealand|නවසීලන්තය
NI|505|Nicaragua
NE|227|Niger
NG|234|Nigeria
NU|683|Niue
KP|850|North Korea
MK|389|North Macedonia
MP|1670|Northern Mariana Islands
NO|47|Norway|නෝර්වේ
OM|968|Oman|ඕමානය
PK|92|Pakistan|පකිස්තානය
PW|680|Palau
PS|970|Palestine
PA|507|Panama
PG|675|Papua New Guinea
PY|595|Paraguay
PE|51|Peru
PH|63|Philippines|පිලිපීනය
PL|48|Poland|පෝලන්තය
PT|351|Portugal|පෘතුගාලය
PR|1787|Puerto Rico
QA|974|Qatar|කටාර්
RE|262|Réunion
RO|40|Romania|රුමේනියාව
RU|7|Russia|රුසියාව
RW|250|Rwanda
BL|590|Saint Barthélemy
SH|290|Saint Helena
KN|1869|Saint Kitts and Nevis
LC|1758|Saint Lucia
MF|590|Saint Martin
PM|508|Saint Pierre and Miquelon
VC|1784|Saint Vincent and the Grenadines
WS|685|Samoa
SM|378|San Marino
ST|239|São Tomé and Príncipe
SA|966|Saudi Arabia|සෞදි අරාබිය
SN|221|Senegal
RS|381|Serbia
SC|248|Seychelles|සීෂෙල්ස්
SL|232|Sierra Leone
SG|65|Singapore|සිංගප්පූරුව
SX|1721|Sint Maarten
SK|421|Slovakia
SI|386|Slovenia
SB|677|Solomon Islands
SO|252|Somalia
ZA|27|South Africa|දකුණු අප්‍රිකාව
KR|82|South Korea|දකුණු කොරියාව
SS|211|South Sudan
ES|34|Spain|ස්පාඤ්ඤය
LK|94|Sri Lanka|ශ්‍රී ලංකාව
SD|249|Sudan
SR|597|Suriname
SE|46|Sweden|ස්වීඩනය
CH|41|Switzerland|ස්විට්සර්ලන්තය
SY|963|Syria
TW|886|Taiwan
TJ|992|Tajikistan
TZ|255|Tanzania
TH|66|Thailand|තායිලන්තය
TL|670|Timor-Leste
TG|228|Togo
TK|690|Tokelau
TO|676|Tonga
TT|1868|Trinidad and Tobago
TN|216|Tunisia
TR|90|Türkiye|තුර්කිය
TM|993|Turkmenistan
TC|1649|Turks and Caicos Islands
TV|688|Tuvalu
VI|1340|U.S. Virgin Islands
UG|256|Uganda
UA|380|Ukraine|යුක්රේනය
AE|971|United Arab Emirates|එක්සත් අරාබි එමීර් රාජ්‍යය
GB|44|United Kingdom|එක්සත් රාජධානිය
US|1|United States|ඇමරිකා එක්සත් ජනපදය
UY|598|Uruguay
UZ|998|Uzbekistan
VU|678|Vanuatu
VA|39|Vatican City
VE|58|Venezuela
VN|84|Vietnam|වියට්නාමය
WF|681|Wallis and Futuna
YE|967|Yemen
ZM|260|Zambia
ZW|263|Zimbabwe`;
  const countries = COUNTRY_DATA.split('\n').map(line => { const [iso, code, en, si = ''] = line.split('|'); return { iso, dial: `+${code}`, en, si }; });
  const countryByIso = Object.fromEntries(countries.map(c => [c.iso, c]));
  // Shown first: the countries the old dropdown had, plus common countries for Sri Lankans abroad.
  const POPULAR_COUNTRIES = ['LK','AE','QA','SA','KW','OM','BH','IT','IL','KR','JP','IN','MV','CY','GB','AU','NZ','US','CA'];
  const countryFlag = iso => [...iso].map(ch => String.fromCodePoint(127397 + ch.charCodeAt(0))).join('');
  const formatDial = dial => dial.startsWith('+1') && dial.length > 2 ? `+1 ${dial.slice(2)}` : dial;
  const englishUi = () => window.WorkshopI18n?.getLanguage?.() === 'en';
  function selectedCountry() {
    const chosen = countryByIso[state.dialCountry];
    if (chosen && chosen.dial === state.details.dial) return chosen;
    return [...POPULAR_COUNTRIES.map(iso => countryByIso[iso]), ...countries].find(c => c.dial === state.details.dial) || countryByIso.LK;
  }
  const dialButtonInner = c => `<span class="cc-flag" aria-hidden="true">${countryFlag(c.iso)}</span><span class="dial-code">${formatDial(c.dial)}</span><span class="sr-only">රටේ දුරකථන කේතය</span>`;
  const foldText = text => text.normalize('NFD').replace(/[̀-ͯ]/g, '').toLowerCase();
  function countryRow(c, selectedIso) {
    const english = englishUi();
    const name = !english && c.si ? `${escape(c.si)}<small>${escape(c.en)}</small>` : escape(c.en);
    return `<button type="button" class="cc-row" data-iso="${c.iso}"${c.iso === selectedIso ? ' aria-current="true"' : ''}><span class="cc-flag" aria-hidden="true">${countryFlag(c.iso)}</span><span class="cc-name">${name}</span><span class="cc-code">${formatDial(c.dial)}</span></button>`;
  }
  function countryListHtml(query) {
    const selectedIso = selectedCountry().iso;
    const q = foldText(query.trim());
    if (!q) {
      const all = [...countries].sort((a, b) => a.en.localeCompare(b.en));
      return `<p class="cc-group">ජනප්‍රිය රටවල්</p>${POPULAR_COUNTRIES.map(iso => countryRow(countryByIso[iso], selectedIso)).join('')}<p class="cc-group">සියලු රටවල්</p>${all.map(c => countryRow(c, selectedIso)).join('')}`;
    }
    const digits = q.replace(/[^\d]/g, '');
    const matches = countries.filter(c => (digits && digits === q.replace(/[+\s]/g, '') ? c.dial.slice(1).startsWith(digits) : false) || foldText(c.en).includes(q) || c.si.includes(query.trim()) || c.iso.toLowerCase() === q);
    matches.sort((a, b) => (foldText(a.en).startsWith(q) ? 0 : 1) - (foldText(b.en).startsWith(q) ? 0 : 1) || a.en.localeCompare(b.en));
    return matches.length ? matches.map(c => countryRow(c, selectedIso)).join('') : '<p class="cc-empty">ගැළපෙන රටක් හමු නොවීය.</p>';
  }
  function closeCountryPicker(focusTarget) {
    const picker = $('cc-picker'); if (!picker) return;
    picker.remove();
    (focusTarget || $('flow-dial-btn'))?.focus();
  }
  function chooseCountry(iso) {
    const c = countryByIso[iso]; if (!c) return;
    state.details.dial = c.dial; state.dialCountry = c.iso;
    if ($('flow-dial')) $('flow-dial').value = c.dial;
    if ($('flow-dial-btn')) $('flow-dial-btn').innerHTML = dialButtonInner(c);
    closeCountryPicker($('flow-phone'));
  }
  function openCountryPicker() {
    if ($('cc-picker')) return;
    const picker = document.createElement('div');
    picker.id = 'cc-picker'; picker.className = 'cc-picker';
    picker.innerHTML = `<div class="cc-backdrop" data-cc-close></div><div class="cc-sheet" role="dialog" aria-modal="true" aria-labelledby="cc-title"><div class="cc-head"><h2 id="cc-title" tabindex="-1">රට තෝරන්න</h2><button type="button" class="cc-close" data-cc-close aria-label="වසන්න">×</button></div><label class="cc-search"><svg viewBox="0 0 24 24" aria-hidden="true"><circle cx="11" cy="11" r="7"/><path d="m20 20-3.5-3.5"/></svg><input id="cc-search" type="search" autocomplete="off" autocapitalize="off" spellcheck="false" enterkeyhint="search" placeholder="රට හෝ කේතය සොයන්න" aria-label="රට හෝ කේතය සොයන්න" aria-controls="cc-list"></label><div class="cc-list" id="cc-list">${countryListHtml('')}</div></div>`;
    document.body.appendChild(picker);
    const search = $('cc-search'), list = $('cc-list');
    search.addEventListener('input', () => { list.innerHTML = countryListHtml(search.value); list.scrollTop = 0; });
    picker.addEventListener('click', e => {
      if (e.target.closest('[data-cc-close]')) return closeCountryPicker();
      const row = e.target.closest('.cc-row'); if (row) chooseCountry(row.dataset.iso);
    });
    picker.addEventListener('keydown', e => {
      if (e.key === 'Escape') { e.preventDefault(); e.stopPropagation(); return closeCountryPicker(); }
      if (e.key === 'Enter' && e.target === search) { e.preventDefault(); list.querySelector('.cc-row')?.click(); return; }
      if (e.key === 'ArrowDown' || e.key === 'ArrowUp') {
        const rows = [...list.querySelectorAll('.cc-row')]; if (!rows.length) return;
        e.preventDefault();
        const i = rows.indexOf(document.activeElement);
        if (e.key === 'ArrowDown') (i < 0 ? rows[0] : rows[Math.min(i + 1, rows.length - 1)]).focus();
        else if (i <= 0) search.focus(); else rows[i - 1].focus();
        return;
      }
      if (e.key === 'Tab') {
        e.stopPropagation();
        const nodes = [picker.querySelector('.cc-close'), search, ...list.querySelectorAll('.cc-row')];
        const first = nodes[0], last = nodes[nodes.length - 1];
        if (!nodes.includes(document.activeElement)) { e.preventDefault(); (e.shiftKey ? last : first).focus(); }
        else if (e.shiftKey && document.activeElement === first) { e.preventDefault(); last.focus(); }
        else if (!e.shiftKey && document.activeElement === last) { e.preventDefault(); first.focus(); }
      }
    });
    list.querySelector('[aria-current="true"]')?.scrollIntoView({ block: 'center' });
    // Phones: don't pop the keyboard over the list straight away; desktop: type to search at once.
    if (window.matchMedia?.('(pointer: coarse)').matches) $('cc-title').focus(); else search.focus();
  }
  // Name and WhatsApp share the first screen; optional email is the second.
  const detailKeys = [['name', 'phone'], ['email']];
  function detailsView() {
    const privacy = safeUrl(config.privacyUrl || config.privacy_url || '');
    const steps = [
      `<p class="flow-kicker">මුලින්ම ඔබේ මූලික තොරතුරු ලබා දෙන්න.</p><h2 class="quiz-q-title" tabindex="-1"><label for="flow-name">සම්පූර්ණ නම</label></h2>
      <span class="pill-field">${pillIcon('name')}<input class="quiz-text-input" id="flow-name" name="name" autocomplete="name" maxlength="120" placeholder="උදා: නදීශා විජේරත්න" value="${escape(state.details.name)}"${attrs('name')}></span>${errorFor('name')}`,
      `<h2 class="quiz-q-title" tabindex="-1"><label for="flow-phone">WhatsApp දුරකථන අංකය</label></h2>
      <p class="flow-note">ඔබ WhatsApp භාවිත කරන දුරකථන අංකය ඇතුළත් කරන්න.</p>
      <span class="pill-field">${pillIcon('phone')}<button type="button" id="flow-dial-btn" class="pill-select dial-btn" aria-haspopup="dialog">${dialButtonInner(selectedCountry())}</button><input type="hidden" id="flow-dial" value="${escape(state.details.dial)}"><input class="quiz-text-input" id="flow-phone" name="phone" type="tel" inputmode="tel" autocomplete="tel" maxlength="24" placeholder="77 123 4567" value="${escape(state.details.phone)}"${attrs('phone')}></span>${errorFor('phone')}`,
      `<h2 class="quiz-q-title" tabindex="-1"><label for="flow-email">විද්‍යුත් තැපැල් ලිපිනය — අත්‍යවශ්‍ය නොවේ</label></h2>
      <span class="pill-field">${pillIcon('email')}<input class="quiz-text-input" id="flow-email" name="email" type="email" autocomplete="email" maxlength="254" placeholder="name@example.com" value="${escape(state.details.email)}"${attrs('email')}></span>${errorFor('email')}<p class="flow-fineprint">ඉදිරියට යාමෙන්, වැඩමුළුව පිළිබඳ පණිවිඩ WhatsApp හරහා ලබාගැනීමට ඔබ එකඟ වේ.${privacy?` <a href="${escape(privacy)}" target="_blank" rel="noopener">පෞද්ගලිකත්ව නිවේදනය</a>`:''}</p>`
    ];
    return `<form id="flow-details" class="flow-form" novalidate>${state.detailStep === 0 ? `<div class="contact-fields"><div>${steps[0]}</div><div>${steps[1]}</div></div>` : steps[2]}</form>`;
  }
  function questionView() {
    const q = questions[state.step];
    return `${state.step===0 ? '<p class="flow-kicker">ඔබ ඉගෙනගැනීමට කැමති දේ අපට හඳුනාගැනීමට උදව් කරන්න. මෙහි හරි හෝ වැරදි පිළිතුරු නැත. අද ඔබට වඩාත් ගැලපෙන පිළිතුර තෝරන්න.</p>' : ''}<h2 class="quiz-q-title" tabindex="-1">${q.title}</h2><div class="quiz-choices" role="group" aria-label="${q.title}">${Object.entries(q.choices).map(([code,label],i)=>`<button class="quiz-choice${state.answers[q.id]===code?' selected':''}" type="button" data-answer="${code}" aria-pressed="${state.answers[q.id]===code}">${choiceKey(i)}<span class="quiz-choice-label"><span class="sin">${label}</span></span></button>`).join('')}</div>`;
  }
  function customView() {
    return `<h2 class="quiz-q-title" tabindex="-1">මෙම වැඩමුළුවේ අවධානය මැහුම් ව්‍යාපාරයක මූලික කරුණු පිළිබඳවයි. ඔබ වැඩමුළුවටත් සහභාගී වීමට කැමතිද?</h2><div class="quiz-choices"><button class="quiz-choice" type="button" id="flow-attend">${choiceKey(0)}<span class="quiz-choice-label">ඔව්, වැඩමුළු ලියාපදිංචිය ඉදිරියට ගෙන යන්න.</span></button><button class="quiz-choice" type="button" id="flow-enquiry-only">${choiceKey(1)}<span class="quiz-choice-label">මට අවශ්‍ය මැහුම් සේවාවක් හෝ නිෂ්පාදනයක් ගැන විමසීමට පමණයි.</span></button></div>`;
  }
  function enquiryView() {
    return `<h2 class="quiz-q-title" id="flow-enquiry-title" tabindex="-1">ඔබ විමසීමට කැමති දේ කෙටියෙන් සඳහන් කරන්න.</h2><textarea id="flow-enquiry" aria-labelledby="flow-enquiry-title" class="quiz-text-input" rows="4" maxlength="2000">${escape(state.enquiry_text)}</textarea>${check('enquiry_consent','මෙම විමසීමට පිළිතුරු ලබාදීම සඳහා මගේ තොරතුරු භාවිත කිරීමට මම එකඟ වෙමි.',state.enquiry_consent)}`;
  }
  // Back / Continue live in the dark navigation card (sticky bar on mobile).
  function actionsView() {
    const back = action('flow-back','ආපසු',true);
    switch (state.screen) {
      case 'details': return (state.detailStep > 0 ? back : '') + `<button class="quiz-ok-btn" type="submit" form="flow-details">${state.detailStep === detailKeys.length - 1 ? 'ඉදිරියට යන්න' : 'ඉදිරියට'}</button>`;
      case 'question': return back + action('flow-next','ඉදිරියට');
      case 'intro': return back + action('flow-start-questions','ප්‍රශ්න අරඹන්න');
      case 'review': return back + action('flow-complete','අවසන් කරන්න');
      case 'custom': return back;
      case 'enquiry': return back + action('flow-send-enquiry','මගේ විමසීම යවන්න');
      default: return '';
    }
  }
  // Autoplaying (muted) video block used on the intro and review screens.
  function videoBlock(asset) {
    const src = safeUrl(asset?.src || ''), poster = safeUrl(asset?.poster || ''), captions = safeUrl(asset?.captions || '');
    if (!src) return `<div class="flow-video-placeholder is-top" aria-label="වීඩියෝව ළඟදීම එක් කෙරේ"><span class="flow-video-play" aria-hidden="true">▶</span><span>වීඩියෝව ළඟදීම එක් කෙරේ</span></div>`;
    return `<div class="flow-video-wrap"><video class="flow-video" id="flow-video" autoplay muted playsinline controls preload="metadata"${poster?` poster="${escape(poster)}"`:''}><source src="${escape(src)}">${captions?`<track kind="captions" src="${escape(captions)}" srclang="si" label="සිංහල" default>`:''}</video><button type="button" class="flow-unmute" id="flow-unmute">🔊 ශබ්දය සක්‍රිය කරන්න</button></div><p id="flow-video-error" class="flow-note" hidden>වීඩියෝව පූරණය කළ නොහැකි විය.</p>`;
  }
  function introView() {
    return `${videoBlock(config.introVideo)}<p id="flow-save-note" class="${state.saved?'flow-saved':'flow-note'}">${state.saved?(state.resumed && state.resumeStep > 0 ? '✓ ඔබ කලින් ආරම්භ කළ ලියාපදිංචිය සොයාගත්තා. ඔබ නතර වූ තැනින් ඉදිරියට යන්න.' : '✓ ඔබේ තොරතුරු සුරැකී ඇත.'):'ඔබේ තොරතුරු සුරකිමින්…'}</p><h2 class="quiz-q-title" tabindex="-1">ස්වර්ණා මහත්මියගෙන් කෙටි පණිවිඩයක්</h2><p class="flow-note">කැමති නම් වීඩියෝව නරඹන්න. නැතිනම් පහළ බොත්තමෙන් කෙටි ප්‍රශ්න 4ට පිළිතුරු දෙන්න.</p>`;
  }
  function reviewView() {
    const id = state.video, asset = config.videos?.[id] || {};
    const transcript = asset.transcript || transcripts[id] || '';
    return `${videoBlock(asset)}<h2 class="quiz-q-title" tabindex="-1">ඔබේ පිළිතුරුවලට ගැළපෙන පණිවිඩය</h2><p class="flow-note">කැමති නම් වීඩියෝව නරඹන්න. ලියාපදිංචිය අවසන් කිරීමට පහළ බොත්තම ඔබන්න.</p>${transcript?`<details id="flow-transcript"><summary>පණිවිඩය කියවන්න</summary><p>${escape(transcript)}</p></details>`:''}`;
  }
  function successMark() {
    return '<div class="flow-success-mark" aria-hidden="true"><svg viewBox="0 0 48 48" fill="none"><path d="m13 24 8 8 15-17" stroke="currentColor" stroke-width="4" stroke-linecap="round" stroke-linejoin="round"/></svg></div>';
  }
  function successView() {
    return `<section class="flow-success-screen">${successMark()}<h2 class="quiz-q-title" tabindex="-1">ලියාපදිංචිය සාර්ථකයි!</h2><p>ඔබේ තොරතුරු සහ පිළිතුරු සුරැකී ඇත.</p><p class="flow-note">ඔබේ අමතර තොරතුරු කැමැත්තත් සුරැකී ඇත.</p><p class="flow-date">${escape(dateText())}<br>${escape(timeText())}</p>${resource('flow-community','WhatsApp ප්‍රජාවට එක්වන්න',community())}${action('flow-done','මුල් පිටුවට')}</section>`;
  }
  function resultView() {
    const id = state.video, asset = config.videos?.[id] || {};
    const src = safeUrl(asset.src || '');
    const captions = safeUrl(asset.captions || '');
    // PDF gives the NOT_SURE focus only in English ("finding a useful starting point").
    const focus = (state.answers.Q3 === 'NOT_SURE' ? 'ප්‍රයෝජනවත් ආරම්භක තැනක් සොයාගැනීම' : questions[2].choices[state.answers.Q3]).replace(/\.$/, '');
    const transcript = asset.transcript || transcripts[id];
    const body = timeConfirmed() ? transcript.replace(/WhatsApp ප්‍රජාවට එක්වී[^.]*ඡන්දය දෙන්න\./g, 'වැඩමුළුවේ වේලාව දැන් තහවුරු කර ඇත. අවසන් විස්තර සහ වැඩමුළුවට සම්බන්ධ වන සබැඳිය ලබාගැනීමට අපේ WhatsApp ප්‍රජාවට එක්වන්න.') : transcript;
    return `${successMark()}<h2 class="quiz-q-title" tabindex="-1">ලියාපදිංචිය සාර්ථකයි!</h2><p>ඔබේ තොරතුරු සහ පිළිතුරු සුරැකී ඇත.</p><p class="flow-date">${escape(dateText())}<br>${escape(timeText())}</p>
      <section class="flow-result-section">${resource('flow-community',timeConfirmed()?'WhatsApp ප්‍රජාවට එක්වන්න':'WhatsApp ප්‍රජාවට එක්වී පහසු වේලාවට ඡන්දය දෙන්න',community())}<p>ලියාපදිංචිය සම්පූර්ණයි. WhatsApp ප්‍රජාවට එක්වීම වෙනම පියවරකි. එයට එක්වීමට පෙර වීඩියෝව නැරඹීම අනිවාර්ය නැත.</p><p class="flow-note">දැනටමත් ප්‍රජාවේ සිටිනවාද? එය විවෘත කර ඉහළින් රඳවා ඇති වේලාව පිළිබඳ ඡන්ද විමසීම බලන්න.</p>${resource('flow-help','ප්‍රජාවට එක්වීමට මට උදව් අවශ්‍යයි',help(),true)}</section>

      <section class="flow-result-section"><h3>ඔබට අමතර තොරතුරු අවශ්‍යද?</h3><p class="flow-note">මෙය අත්‍යවශ්‍ය නොවන අතර වැඩමුළුවට සහභාගී වීමට බලපාන්නේ නැත.</p>${check('ebook','කරුණාකර ඊ-පොතේ අන්තර්ගතය සහ මිලදී ගැනීමේ තොරතුරු මට එවන්න.',state.requests.includes('ebook'))}${check('mentorship','පුද්ගලික ව්‍යාපාර මඟපෙන්වීමේ වැඩසටහන පිළිබඳ තොරතුරු ලබාදීමට කරුණාකර මා අමතන්න.',state.requests.includes('mentorship'))}${check('none','දැනට නිෂ්පාදන පිළිබඳ තොරතුරු අවශ්‍ය නැහැ.',state.requests.includes('none'))}${action('flow-preferences','සුරකින්න සහ අවසන් කරන්න')}<p class="flow-note">මෙය කිසිවක් මිලදී ගැනීමක් හෝ ගාස්තු අය කරන වැඩසටහනකට ඇතුළත් වීමක් නොවේ.</p><p id="flow-pref-status" role="status"></p></section>`;
  }
  function render() {
    const container = $('quiz-content-area'); if (!container) return;
    const result = ['result','success'].includes(state.screen);
    const labels = { details: 'ඔබේ තොරතුරු', intro: 'ඔබේ වීඩියෝව', review: 'ඔබේ වීඩියෝව', custom: 'ප්‍රශ්න 4න් 1', result: 'ලියාපදිංචිය සම්පූර්ණයි', success: 'ලියාපදිංචිය සම්පූර්ණයි' };
    const total = detailKeys.length + questions.length + 2, index = state.screen === 'details' ? state.detailStep : state.screen === 'intro' ? detailKeys.length : state.screen === 'question' ? detailKeys.length + 1 + state.step : state.screen === 'review' ? total - 1 : null;
    $('quiz-phase-label').textContent = state.screen === 'question' ? `ප්‍රශ්න 4න් ${state.step + 1}` : labels[state.screen] || '';
    $('quiz-progress-fill').style.width = `${(result || state.screen === 'enquiry_done' ? 1 : index === null ? 5 / total : (index + 1) / total) * 100}%`;
    let view;
    switch (state.screen) {
      case 'question': view = questionView(); break;
      case 'intro': view = introView(); break;
      case 'review': view = reviewView(); break;
      case 'custom': view = customView(); break;
      case 'enquiry': view = enquiryView(); break;
      case 'enquiry_done': view = `<h2 class="quiz-q-title" tabindex="-1">ඔබේ විමසීම ලැබී ඇත.</h2><p>ඔබ ලබාදුන් සම්බන්ධතා තොරතුරු හරහා කණ්ඩායම පිළිතුරු ලබාදෙනු ඇත. මෙය තහවුරු කළ ඇණවුමක් හෝ වැඩමුළු ලියාපදිංචියක් නොවේ.</p>`; break;
      case 'result': view = resultView(); break;
      case 'success': view = successView(); break;
      default: view = detailsView();
    }
    // After the details are saved the popup becomes a full page (video, questions, result).
    $('quiz-overlay').classList.toggle('is-fullpage', state.screen !== 'details');
    container.innerHTML = `<div class="quiz-question${result?' quiz-result':''}">${view}<div class="flow-errors" id="flow-errors" role="alert" tabindex="-1">${escape(state.error)}</div><div class="flow-status" id="flow-status" role="status" aria-live="polite"></div></div>`;
    $('quiz-nav').innerHTML = actionsView();
    const nextKey = `${state.screen}:${state.step}`;
    if (nextKey !== renderedKey) { $('quiz-main-panel').scrollTop = 0; renderedKey = nextKey; }
    bind(); setPending(state.pending); window.WorkshopI18n?.apply();
    $('flow-video')?.play?.().catch(()=>{});
    if (state.error) $('flow-errors').focus?.();
    else (state.screen === 'details' && container.querySelector('.pill-field input, .flow-check input') || container.querySelector('.quiz-q-title'))?.focus({ preventScroll: true });
  }
  const resumeKey = `workshop-resume:${eventId}`;
  async function contactFingerprint(details) {
    if (config.resumeEnabled !== true || !window.crypto?.subtle) return '';
    const normalized = `${details.name.toLowerCase().replace(/\s+/g,' ').trim()}|${details.phone}`;
    const bytes = await window.crypto.subtle.digest('SHA-256', new TextEncoder().encode(normalized));
    return Array.from(new Uint8Array(bytes), b => b.toString(16).padStart(2,'0')).join('');
  }
  function readResume(fingerprint) {
    if (preview || !fingerprint) return null;
    try {
      const r = JSON.parse(localStorage.getItem(resumeKey));
      return r && r.fingerprint === fingerprint && r.expires > Date.now() && /^[a-f0-9-]{36}$/.test(r.registration_id) && /^[a-f0-9]{64}$/.test(r.session_token) ? r : null;
    } catch { return null; }
  }
  function startSave(details) {
    const version = state.startVersion = (state.startVersion || 0) + 1;
    const previous = state.startPromise;
    state.startDetails = details; state.startFailed = false; state.saved = false;
    // Serialize details edits so a slower earlier save cannot overwrite newer data.
    let fingerprint;
    state.startPromise = Promise.resolve(previous).catch(() => {}).then(async () => {
      fingerprint = await contactFingerprint(details);
      const resume = state.registration_id ? state : readResume(fingerprint);
      try {
        return await request('start',{details, registration_id: resume?.registration_id, session_token: resume?.session_token});
      } catch (error) {
        if (!state.registration_id && resume && ['UNAUTHORIZED','NOT_FOUND'].includes(error.message)) {
          try { localStorage.removeItem(resumeKey); } catch {}
          return request('start',{details, registration_id: undefined, session_token: undefined});
        }
        throw error;
      }
    }).then(response => {
      if (!response.registration_id || !response.session_token || response.status !== 'started') throw new Error('INVALID_START_ACK');
      state.registration_id = response.registration_id; state.session_token = response.session_token;
      if (!preview && fingerprint) {
        try { localStorage.setItem(resumeKey, JSON.stringify({registration_id: response.registration_id, session_token: response.session_token, fingerprint, expires: Date.now() + 30*86400000})); } catch {}
      }
      if (version !== state.startVersion) return;
      state.saved = true; state.resumed = false; state.resumeStep = 0;
      if (response.resumed) {
        const ids = questions.map(q => q.id), prior = response.answers || {};
        state.answers = {}; ids.forEach(k => { if (Object.hasOwn(questions.find(q => q.id === k).choices, prior[k])) state.answers[k] = prior[k]; });
        state.custom_attending = response.custom_attend_workshop === 'YES' ? true : response.custom_attend_workshop === 'NO' ? false : null;
        const next = ids.findIndex(k => !state.answers[k]);
        state.resumeStep = next === -1 ? ids.length : next; state.resumed = true;
        analytics('registration_resumed', { step: state.resumeStep });
      }
      analytics('details_saved');
      if (state.screen === 'intro') { const n = $('flow-save-note'); if (n) { n.textContent = state.resumed && state.resumeStep > 0 ? '✓ ඔබ කලින් ආරම්භ කළ ලියාපදිංචිය සොයාගත්තා. ඔබ නතර වූ තැනින් ඉදිරියට යන්න.' : '✓ ඔබේ තොරතුරු සුරැකී ඇත.'; n.className = 'flow-saved'; } }
    }).catch(error => { if (version === state.startVersion) state.startFailed = true; throw error; });
    state.startPromise.catch(() => {});
    return state.startPromise;
  }
  function showIntro(details) {
    // Dismiss the keyboard before expanding the bottom sheet. Paint the new
    // screen before starting background work; never wait for the Sheet here.
    if (state.enteringIntro) return;
    state.enteringIntro = true;
    document.activeElement?.blur?.();
    state.startDetails = details; state.startFailed = false;
    state.saved = false; state.screen = 'intro'; state.error = '';
    window.requestAnimationFrame(() => {
      render();
      window.requestAnimationFrame(() => {
        state.enteringIntro = false;
        startSave(details);
      });
    });
  }
  function bind() {
    const on = (id, eventName, fn) => $(id)?.addEventListener(eventName, fn);
    const clearError = e => { const key = e.target.id?.replace('flow-',''); captureDetails(); if (!state.errors[key]) return; delete state.errors[key]; $(`error-${key}`)?.remove(); e.target.removeAttribute('aria-invalid'); e.target.removeAttribute('aria-describedby'); };
    on('flow-details','input',clearError); on('flow-details','change',clearError);
    on('flow-dial-btn','click',openCountryPicker);
    on('flow-details','submit', e => { e.preventDefault(); captureDetails();
      const invalid = () => { render(); $('quiz-content-area').querySelector('[aria-invalid="true"]')?.focus(); };
      validateDetails(); state.errors = Object.fromEntries(Object.entries(state.errors).filter(([key]) => detailKeys[state.detailStep].includes(key)));
      if (Object.keys(state.errors).length) return invalid();
      if (state.detailStep < detailKeys.length - 1) { state.detailStep++; render(); return; }
      state.details.workshop_contact_acknowledgement = true;
      if (!validateDetails()) { state.detailStep = detailKeys.findIndex(keys => keys.some(key => state.errors[key])); return invalid(); }
      const source = new URLSearchParams(location.search).get('source');
      const allow = config.sourceCodes || config.approvedSourceCodes || ['direct'];
      const params = new URLSearchParams(location.search);
      const attribution = Object.fromEntries(['utm_source', 'utm_medium', 'utm_campaign', 'utm_content'].filter(key => params.has(key)).map(key => [key, params.get(key).slice(0,160)]));
      const details = { name: state.details.name.trim(), phone: normalPhone(), email: state.details.email.trim(), workshop_contact_acknowledgement: true, marketing_opt_in: state.details.marketing_opt_in, source_code: allow.includes(source)?source:'direct', attribution, test_flag: preview || config.testFlag === true };
      // Show the video page immediately; the Sheet save runs in the background.
      showIntro(details);
    });
    $('quiz-content-area').querySelectorAll('[data-answer]').forEach(button => button.addEventListener('click',()=>{
      const q = questions[state.step]; state.answers[q.id] = button.dataset.answer; state.error = '';
      if (q.id === 'Q1' && state.answers.Q1 !== 'CUSTOM') state.custom_attending = null;
      $('quiz-content-area').querySelectorAll('[data-answer]').forEach(b=>{ const selected = b===button; b.classList.toggle('selected',selected); b.setAttribute('aria-pressed',String(selected)); });
    }));
    on('flow-next','click',()=>{
      const q = questions[state.step]; if (!state.answers[q.id]) { state.error='ඉදිරියට යාමට කරුණාකර පිළිතුරක් තෝරන්න.'; render(); return; }
      save(async()=>{
        await request('answer',{answers:{...state.answers},custom_attending:state.custom_attending});
        analytics('quiz_step_complete',{step:q.id});
        if (state.step===0 && state.answers.Q1==='CUSTOM') state.screen='custom';
        else if (state.step<3) state.step++;
        else { state.video = selectVideo(state.answers,state.custom_attending); state.screen='review'; analytics('branch_preview_shown',{video_id:state.video}); }
      });
    });
    on('flow-start-questions','click',()=>{
      if (state.enteringIntro) return;
      const go = () => {
        state.error=''; const at = state.resumeStep || 0;
        if (state.answers.Q1 === 'CUSTOM' && state.custom_attending === false) { state.screen='enquiry'; }
        else if (at >= questions.length) { state.video = selectVideo(state.answers,state.custom_attending); state.screen='review'; }
        else if (at > 0 && state.answers.Q1 === 'CUSTOM' && state.custom_attending === null) { state.screen='custom'; }
        else { state.screen='question'; state.step=at; }
      };
      if (state.saved) { go(); render(); return; }
      save(async()=>{ if (state.startFailed || !state.startPromise) await startSave(state.startDetails); else await state.startPromise; go(); });
    });
    on('flow-complete','click',()=>save(async()=>{
      const response = await request('complete',{answers:{...state.answers},custom_attending:state.custom_attending});
      if (response.status!=='complete') throw new Error('INVALID_COMPLETE_ACK');
      const expected = selectVideo(state.answers,state.custom_attending);
      if (response.video_id && response.video_id!==expected) throw new Error('INVALID_ROUTE_ACK');
      state.video = expected; state.screen='result'; analytics('registration_complete');
    }));
    on('flow-unmute','click',()=>{ const v=$('flow-video'); if(!v) return; v.muted=false; v.play().catch(()=>{}); $('flow-unmute').hidden=true; });
    on('flow-back','click',()=>{
      if (state.pending) return; state.error=''; state.errors={};
      if (state.screen==='details') { state.detailStep=Math.max(0,state.detailStep-1); render(); return; }
      if (state.screen==='intro') { state.screen='details'; state.detailStep=detailKeys.length-1; render(); return; }
      if (state.screen==='review') { state.screen='question'; state.step=3; render(); return; }
      if (state.screen==='enquiry') state.screen='custom';
      else if (state.screen==='custom') { state.screen='question'; state.step=0; }
      else if (state.step>0) { state.step--; if(state.step===0 && state.answers.Q1==='CUSTOM') state.screen='custom'; }
      else { state.screen='intro'; } render();
    });
    on('flow-attend','click',()=>save(async()=>{ state.custom_attending=true; await request('answer',{answers:{...state.answers},custom_attending:true}); state.screen='question'; state.step=1; }));
    on('flow-enquiry-only','click',()=>{ state.custom_attending=false; state.screen='enquiry'; render(); });
    on('flow-enquiry','input',()=>state.enquiry_text=$('flow-enquiry').value);
    on('flow-enquiry_consent','change',()=>state.enquiry_consent=$('flow-enquiry_consent').checked);
    on('flow-send-enquiry','click',()=>{
      if (state.enquiry_text.trim().length<3 || !state.enquiry_consent) { state.error='කරුණාකර ඔබේ විමසීම සඳහන් කර එයට පිළිතුරු ලබාදීම සඳහා එකඟතාව තහවුරු කරන්න.'; render(); return; }
      save(async()=>{ const response=await request('enquiry',{answers:{Q1:'CUSTOM'},custom_attending:false,enquiry_consent:true,enquiry_text:state.enquiry_text.trim()}); if(response.status!=='enquiry_only') throw new Error('INVALID_ENQUIRY_ACK'); state.screen='enquiry_done'; analytics('enquiry_saved'); });
    });
    for (const key of ['ebook','mentorship','none']) on(`flow-${key}`,'change',()=>{
      state.preferenceSaved = false; if ($('flow-pref-status')) $('flow-pref-status').textContent = '';
      if (key==='none') state.requests=$('flow-none').checked?['none']:[];
      else { state.requests=state.requests.filter(x=>x!=='none' && x!==key); if($(`flow-${key}`).checked) state.requests.push(key); }
      for (const value of ['ebook','mentorship','none']) $(`flow-${value}`).checked=state.requests.includes(value);
    });
    on('flow-preferences','click',()=>save(async()=>{ if(!state.requests.length) state.requests=['none']; await request('preferences',{requests:[...state.requests],explicit_product_request:[...state.requests]}); state.preferenceSaved=true; state.screen='success'; }));
    if(state.preferenceSaved && $('flow-pref-status')) $('flow-pref-status').textContent='ඔබේ කැමැත්ත සුරැකී ඇත.';
    on('flow-done','click',closeQuiz);
    on('flow-community','click',()=>{
      if (!community()) return;
      // The invitation opens immediately; logging cannot block workshop access.
      request('invitation_click').then(()=>analytics('whatsapp_invitation_click')).catch(()=>{});
    });
    $('quiz-content-area').querySelectorAll('[data-resource]').forEach(button=>button.addEventListener('click',()=>{
      const status=$(`${button.dataset.resource}-status`); if(status) status.textContent='පසුව එක් කෙරේ';
    }));
    $('flow-transcript')?.querySelector('summary')?.addEventListener('click',()=>{ if(!$('flow-transcript').open) analytics('video_skip',{video_id:state.video,method:'read_text'}); });
    const video=$('flow-video');
    if(video) { video.addEventListener('error',()=>{$('flow-video-error').hidden=false;}); video.querySelector('source')?.addEventListener('error',()=>{$('flow-video-error').hidden=false;}); video.addEventListener('play',()=>analytics('video_start',{video_id:state.video})); video.addEventListener('ended',()=>analytics('video_complete',{video_id:state.video})); }
  }
  function openQuiz() {
    if(opened) return; opened=true; returnFocus=document.activeElement; oldOverflow=document.body.style.overflow;
    document.body.style.overflow='hidden'; $('quiz-overlay').style.display='flex';
    const shell=$('quiz-overlay').querySelector('.quiz-shell-wide'); shell.setAttribute('role','dialog'); shell.setAttribute('aria-modal','true'); shell.setAttribute('aria-label','නොමිලේ වැඩමුළුව සඳහා ලියාපදිංචිය');
    analytics('registration_start'); render();
  }
  function closeQuiz() {
    if(state.screen==='details') captureDetails();
    $('cc-picker')?.remove();
    opened=false; $('quiz-overlay').style.display='none'; document.body.style.overflow=oldOverflow || ''; $('flow-video')?.pause(); returnFocus?.focus();
  }
  document.addEventListener('keydown',event=>{
    if(!opened) return;
    if(event.key==='Escape') { event.preventDefault(); closeQuiz(); }
    if(event.key==='Tab') {
      const nodes=[...$('quiz-overlay').querySelectorAll('button:not(:disabled),input:not(:disabled),select:not(:disabled),textarea:not(:disabled),a[href],summary,[tabindex="0"]')].filter(el=>el.getClientRects().length);
      const first=nodes[0],last=nodes[nodes.length-1];
      if(event.shiftKey && (document.activeElement===first || !nodes.includes(document.activeElement))) {event.preventDefault();last?.focus();}
      else if(!event.shiftKey && document.activeElement===last) {event.preventDefault();first?.focus();}
    }
  });
  window.WorkshopFlow = { selectVideo, questions: questions.map(q=>({id:q.id,codes:Object.keys(q.choices)})), open:openQuiz, close:closeQuiz, ...(preview ? { getState:()=>JSON.parse(JSON.stringify(state)), setTransport:fn=>{window.WORKSHOP_TRANSPORT=fn;} } : {}) };
  window.Funnel = { openQuiz, closeQuiz, goPrev:()=>$('flow-back')?.click(), goNext:()=>$('flow-next')?.click() };
  function dates() {
    const date=new Date(`${event.date || '2026-11-14'}T12:00:00+05:30`);
    const english=window.WorkshopI18n?.getLanguage()==='en';
    const months=english?['January','February','March','April','May','June','July','August','September','October','November','December']:['ජනවාරි','පෙබරවාරි','මාර්තු','අප්‍රේල්','මැයි','ජූනි','ජූලි','අගෝස්තු','සැප්තැම්බර්','ඔක්තෝබර්','නොවැම්බර්','දෙසැම්බර්'];
    const month=months[date.getUTCMonth()];
    for(const prefix of ['home','modal']) { if($(`${prefix}-event-month`)) $(`${prefix}-event-month`).textContent=month; if($(`${prefix}-event-day`)) $(`${prefix}-event-day`).textContent=String(date.getUTCDate()); if($(`${prefix}-event-time`)) $(`${prefix}-event-time`).textContent=timeText(); }
    const days=english?['Sunday','Monday','Tuesday','Wednesday','Thursday','Friday','Saturday']:['ඉරිදා','සඳුදා','අඟහරුවාදා','බදාදා','බ්‍රහස්පතින්දා','සිකුරාදා','සෙනසුරාදා'], short=english?['Sun','Mon','Tue','Wed','Thu','Fri','Sat']:['ඉරි','සඳු','අඟ','බදා','බ්‍රහ','සිකු','සෙන'];
    const shortMonth=english?months[date.getUTCMonth()].slice(0,3):month;
    for(const prefix of ['home','modal']) { if($(`${prefix}-event-year`)) $(`${prefix}-event-year`).textContent=String(date.getUTCFullYear()); if($(`${prefix}-event-weekday`)) $(`${prefix}-event-weekday`).textContent=days[date.getUTCDay()]; }
    if($('modal-event-month-short')) $('modal-event-month-short').textContent=shortMonth;
    if($('home-event-time') && !timeConfirmed()) $('home-event-time').textContent='වේලාව WhatsApp ප්‍රජාවේ ඡන්දයෙන් තීරණය වේ.';
    if($('quiz-date-line')) $('quiz-date-line').textContent=`${dateText()} · ${days[date.getUTCDay()]}`;
    const week=document.querySelector('.date-week'), monday=new Date(date); monday.setUTCDate(date.getUTCDate()-(date.getUTCDay()+6)%7);
    if(week) week.innerHTML=Array.from({length:7},(_,i)=>{ const d=new Date(monday); d.setUTCDate(monday.getUTCDate()+i); return `<li${i===(date.getUTCDay()+6)%7?' class="is-event"':''}><span>${short[d.getUTCDay()]}</span>${d.getUTCDate()}</li>`; }).join('');
  }
  window.addEventListener('workshop:languagechange',dates);
  if(document.readyState==='loading') document.addEventListener('DOMContentLoaded',dates); else dates();
  // Legacy headline font: show the converted string only once the font is available.
  const legacy=document.querySelectorAll('[data-legacy]');
  const legacySources=new Map([...legacy].map(el=>[el,el.innerHTML]));
  if(legacy.length && document.fonts) document.fonts.load('1em "Tharu Digital Mahee"').then(faces=>{ if(!faces.length) return; legacy.forEach(el=>{ const text=legacySources.get(el); el.innerHTML=`<span class="sr-only">${text}</span><span class="legacy-si" aria-hidden="true"></span>`; el.lastChild.textContent=el.dataset.legacy; el.classList.add('has-legacy'); }); }).catch(()=>{});
})();
