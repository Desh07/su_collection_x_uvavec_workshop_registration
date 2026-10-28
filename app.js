/* Four-question workshop registration. No personal data is persisted in this browser. */
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
  const state = { screen: 'details', step: 0, answers: {}, details: { name: '', phone: '', email: '', dial: '+94', workshop_contact_acknowledgement: false, marketing_opt_in: false }, registration_id: null, session_token: null, custom_attending: null, enquiry_text: '', enquiry_consent: false, requests: [], membership: 'unknown', pending: false, error: '', errors: {}, saved: false, video: null };
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
  const dateText = () => event.dateLabel || config.dateLabel || '2026 නොවැම්බර් 14';
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
    const data = { action, event_id: eventId, ...(state.registration_id && action !== 'start' ? { registration_id: state.registration_id, session_token: state.session_token } : {}), ...extra };
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
  function generalError(error) {
    return error.message === 'ENDPOINT_NOT_CONFIGURED' ? 'ලියාපදිංචි සේවාව තවම සකසා නැත. ඔබේ තොරතුරු යවා නැත. කරුණාකර පසුව නැවත උත්සාහ කරන්න.' : 'සුරැකීමට නොහැකි විය. ඔබ ඇතුළත් කළ තොරතුරු මෙහි තවමත් ඇත. කරුණාකර නැවත උත්සාහ කරන්න.';
  }
  async function save(work) {
    if (state.pending) return;
    state.pending = true; state.error = ''; setPending(true);
    try { await work(); } catch (error) { state.error = generalError(error); }
    finally { state.pending = false; render(); }
  }
  function setPending(value) {
    $('quiz-content-area')?.querySelectorAll('button,input,select,textarea').forEach(el => el.disabled = value);
    $('quiz-content-area')?.setAttribute('aria-busy', String(value));
    const status = $('flow-status'); if (status) status.textContent = value ? 'සුරකිමින් පවතී…' : '';
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
    if (d.name.trim().length < 2 || !/\p{L}/u.test(d.name)) errors.name = 'කරුණාකර ඔබේ සම්පූර්ණ නම ඇතුළත් කරන්න.';
    if (!/^\+[1-9]\d{7,14}$/.test(normalPhone())) errors.phone = 'කරුණාකර නිවැරදි WhatsApp අංකයක් ඇතුළත් කර රටේ කේතය පරීක්ෂා කරන්න.';
    if (d.email.trim() && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(d.email.trim())) errors.email = 'කරුණාකර නිවැරදි විද්‍යුත් තැපැල් ලිපිනයක් ඇතුළත් කරන්න.';
    if (!d.workshop_contact_acknowledgement) errors.workshop_contact_acknowledgement = 'ඉදිරියට යාමට වැඩමුළුව පිළිබඳ පණිවිඩ සඳහා එකඟතාව තහවුරු කරන්න.';
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
  const routeLabels = { V1: 'ආරම්භයට මඟපෙන්වීමක්', V2: 'මැහුම් හැකියාවෙන් ව්‍යාපාරයකට', V3: 'දැනට කරන ඇණවුම් දියුණු කරගනිමු', V4: 'මැහුම් ඉගෙනීමට කැමති ඔබට', V5: 'ඔබට ගැලපෙන ආරම්භයක් සොයමු' };
  function detailsView() {
    const privacy = safeUrl(config.privacyUrl || config.privacy_url || '');
    return `<h2 class="quiz-q-title" tabindex="-1">මුලින්ම ඔබේ මූලික තොරතුරු ලබා දෙන්න.</h2>
      <p class="flow-note">කෙටි ප්‍රශ්න හතරකින් ඔබ ඉගෙනගැනීමට කැමති දේ හඳුනාගනිමු. මෙහි හරි හෝ වැරදි පිළිතුරු නැත.</p>
      <form id="flow-details" class="flow-form" novalidate>
      <label class="flow-field" for="flow-name">සම්පූර්ණ නම<input class="quiz-text-input" id="flow-name" name="name" autocomplete="name" maxlength="120" value="${escape(state.details.name)}"${attrs('name')}>${errorFor('name')}</label>
      <label class="flow-field" for="flow-phone">WhatsApp දුරකථන අංකය</label><div class="flow-phone-row"><label for="flow-dial">රටේ කේතය</label><select id="flow-dial" class="quiz-text-input" aria-label="රටේ දුරකථන කේතය">${[['+94','ශ්‍රී ලංකාව +94'],['+91','ඉන්දියාව +91'],['+971','එක්සත් අරාබි එමීර් +971'],['+974','කටාර් +974'],['+966','සවුදි අරාබිය +966'],['+965','කුවේට් +965'],['+968','ඕමාන් +968'],['+44','එක්සත් රාජධානිය +44'],['+61','ඕස්ට්‍රේලියාව +61'],['+1','ඇමෙරිකාව / කැනඩාව +1']].map(([v,l])=>`<option value="${v}"${state.details.dial===v?' selected':''}>${l}</option>`).join('')}</select><input class="quiz-text-input" id="flow-phone" name="phone" type="tel" inputmode="tel" autocomplete="tel" maxlength="24" value="${escape(state.details.phone)}"${attrs('phone')}></div>${errorFor('phone')}<p class="flow-note">වෙනත් රටක අංකයක් නම් + සහ රටේ කේතය සමඟ සම්පූර්ණ අංකය ඇතුළත් කරන්න.</p>
      <label class="flow-field" for="flow-email">විද්‍යුත් තැපැල් ලිපිනය — අත්‍යවශ්‍ය නොවේ<input class="quiz-text-input" id="flow-email" name="email" type="email" autocomplete="email" maxlength="254" value="${escape(state.details.email)}"${attrs('email')}>${errorFor('email')}</label>
      <p class="flow-note">මෙම වැඩමුළුව කළමනාකරණය කිරීමට සහ ඔබේ ඉගෙනුම් අවශ්‍යතා හඳුනාගැනීමට ඔබේ තොරතුරු සහ පිළිතුරු භාවිත කරමු.</p>${resource('flow-privacy','පෞද්ගලිකත්ව නිවේදනය කියවන්න',privacy,true)}
      ${check('workshop_contact_acknowledgement','මෙම වැඩමුළුවේ ලියාපදිංචිය කළමනාකරණය කිරීමට සහ ලියාපදිංචිය, සහභාගී වීම හා මතක් කිරීම් පිළිබඳ අදාළ පණිවිඩ යැවීමට මගේ තොරතුරු භාවිත කිරීමට මම එකඟ වෙමි.',state.details.workshop_contact_acknowledgement)}
      ${check('marketing_opt_in','ඉදිරියේදී Su Collection වෙතින් ඉගෙනුම් අවස්ථා සහ නිෂ්පාදන පිළිබඳ දැනුවත් කිරීම් ලබාගැනීමටත් මම කැමතියි. (අත්‍යවශ්‍ය නොවේ)',state.details.marketing_opt_in)}
      <button class="quiz-ok-btn" type="submit">ප්‍රශ්න වෙත යන්න</button></form>`;
  }
  function questionView() {
    const q = questions[state.step];
    return `<h2 class="quiz-q-title" tabindex="-1">${q.title}</h2><p class="flow-note">එක පිළිතුරක් තෝරා ඉදිරියට යන්න.</p><div class="quiz-choices" role="group" aria-label="${q.title}">${Object.entries(q.choices).map(([code,label])=>`<button class="quiz-choice${state.answers[q.id]===code?' selected':''}" type="button" data-answer="${code}" aria-pressed="${state.answers[q.id]===code}"><span class="quiz-choice-label"><span class="sin">${label}</span></span></button>`).join('')}</div><div class="flow-actions">${action('flow-back','ආපසු',true)}${action('flow-next',state.step===3?'මගේ නොමිලේ ලියාපදිංචිය සම්පූර්ණ කරන්න':'ඉදිරියට')}</div>`;
  }
  function customView() {
    return `<h2 class="quiz-q-title" tabindex="-1">මෙම වැඩමුළුවේ අවධානය මැහුම් ව්‍යාපාරයක මූලික කරුණු පිළිබඳවයි. ඔබ වැඩමුළුවටත් සහභාගී වීමට කැමතිද?</h2><div class="quiz-choices"><button class="quiz-choice" id="flow-attend">ඔව්, වැඩමුළු ලියාපදිංචිය ඉදිරියට ගෙන යන්න.</button><button class="quiz-choice" id="flow-enquiry-only">මට අවශ්‍ය මැහුම් සේවාවක් හෝ නිෂ්පාදනයක් ගැන විමසීමට පමණයි.</button></div>${action('flow-back','ආපසු',true)}`;
  }
  function enquiryView() {
    return `<h2 class="quiz-q-title" tabindex="-1">ඔබ විමසීමට කැමති දේ කෙටියෙන් සඳහන් කරන්න.</h2><p class="flow-note">මෙය වැඩමුළු ලියාපදිංචියෙන් වෙනම විමසීමකි.</p><label for="flow-enquiry">ඔබේ විමසීම</label><textarea id="flow-enquiry" class="quiz-text-input" rows="4" maxlength="2000">${escape(state.enquiry_text)}</textarea>${check('enquiry_consent','මෙම විමසීමට පිළිතුරු ලබාදීම සඳහා මගේ තොරතුරු භාවිත කිරීමට මම එකඟ වෙමි.',state.enquiry_consent)}<div class="flow-actions">${action('flow-back','ආපසු',true)}${action('flow-send-enquiry','මගේ විමසීම යවන්න')}</div>`;
  }
  function resultView() {
    const id = state.video, asset = config.videos?.[id] || {};
    const src = safeUrl(asset.src || '');
    const captions = safeUrl(asset.captions || '');
    const focus = state.answers.Q3 === 'NOT_SURE' ? 'ප්‍රයෝජනවත් ආරම්භක තැනක් සොයාගැනීම.' : questions[2].choices[state.answers.Q3];
    const transcript = asset.transcript || transcripts[id];
    const body = timeConfirmed() ? transcript.replace(/WhatsApp ප්‍රජාවට එක්වී[^.]*ඡන්දය දෙන්න\./g, 'අවසන් විස්තර සහ සම්බන්ධ වන උපදෙස් සඳහා WhatsApp ප්‍රජාවට එක්වන්න.') : transcript;
    return `<h2 class="quiz-q-title" tabindex="-1">${preview ? 'පෙරදසුන් ලියාපදිංචිය සම්පූර්ණයි.' : 'නොමිලේ වැඩමුළුව සඳහා ඔබේ ලියාපදිංචිය සම්පූර්ණයි.'}</h2><p class="flow-date">${escape(dateText())}<br>${escape(timeText())}</p>
      <section class="flow-result-section"><h3>වැඩමුළු ප්‍රජාවට එක්වන්න</h3><p>ලියාපදිංචිය සම්පූර්ණයි. WhatsApp ප්‍රජාවට එක්වීම වෙනම පියවරකි. එයට එක්වීමට පෙර වීඩියෝව නැරඹීම අනිවාර්ය නැත.</p>${resource('flow-community',timeConfirmed()?'WhatsApp ප්‍රජාවට එක්වන්න':'WhatsApp ප්‍රජාවට එක්වී පහසු වේලාවට ඡන්දය දෙන්න',community())}</section>
      <section class="flow-result-section"><h3>ඔබ තෝරාගත් අවධානය</h3><p>${escape(focus)}</p><p class="flow-note">වැඩමුළුවේ සඳහන් මාතෘකා පහ සාකච්ඡා කෙරේ. ඔබේ පිළිතුර ඔබේ අවශ්‍යතා හඳුනාගැනීමට උපකාරී වේ. මෙය පුද්ගලික හෝ ඔබ වෙනුවෙන් පමණක් සකස් කළ පාඩමක් නොවේ.</p>${src ? `<video class="flow-video" id="flow-video" controls playsinline preload="none"${safeUrl(asset.poster)?` poster="${escape(safeUrl(asset.poster))}"`:''}><source src="${escape(src)}">${captions?`<track kind="captions" src="${escape(captions)}" srclang="si" label="සිංහල" default>`:''}</video><p id="flow-video-error" class="flow-note" hidden>වීඩියෝව පූරණය කළ නොහැකි විය. පහත පෙළ කියවන්න හෝ WhatsApp බොත්තම භාවිත කරන්න.</p>` : `<button class="flow-video-placeholder" id="flow-video-placeholder" type="button" data-resource="flow-video-placeholder" aria-label="වීඩියෝව පසුව එක් කෙරේ"><span class="flow-video-play" aria-hidden="true">▶</span><span class="flow-video-label">${routeLabels[id]}</span><span>වීඩියෝව පසුව එක් කෙරේ</span></button><span class="flow-resource-status" id="flow-video-placeholder-status" role="status"></span>`}<details id="flow-transcript" open><summary>පණිවිඩය කියවන්න</summary><p>${escape(body)}</p></details></section>
      <section class="flow-result-section"><h3>ප්‍රජාවට එක්වීම</h3><p class="flow-note">බොත්තම එබීමෙන් පමණක් සාමාජිකත්වය තහවුරු නොවේ. පහත ප්‍රකාශය ඔබ විසින් ලබාදෙන තොරතුරක් ලෙස පමණක් සුරැකේ.</p>${action('flow-membership',state.membership==='self_reported'?'මගේ ප්‍රකාශය සුරැකී ඇත':'මම දැනටමත් ප්‍රජාවේ සිටිමි',true)}${resource('flow-help','ප්‍රජාවට එක්වීමට මට උදව් අවශ්‍යයි',help(),true)}<p class="flow-note">${timeConfirmed()?'සජීවී සහභාගීත්වය පිළිබඳ වැඩි විස්තර ප්‍රජාවේ දැනුම් දෙනු ලැබේ.':'සජීවීව සහභාගී වීමේ කැමැත්ත වේලාව තහවුරු කළ පසු විමසනු ලැබේ.'}</p></section>
      <section class="flow-result-section"><h3>ඔබට අමතර තොරතුරු අවශ්‍යද?</h3><p class="flow-note">මෙය අත්‍යවශ්‍ය නොවන අතර වැඩමුළුවට සහභාගී වීමට බලපාන්නේ නැත. ඔබ කලින් තෝරාගත් ඉගෙනුම් කැමැත්තෙන් මෙම ඉල්ලීම් ස්වයංක්‍රීයව සක්‍රිය නොවේ.</p>${check('ebook','කරුණාකර ඊ-පොතේ අන්තර්ගතය සහ මිලදී ගැනීමේ තොරතුරු මට එවන්න.',state.requests.includes('ebook'))}${check('mentorship','පුද්ගලික ව්‍යාපාර මඟපෙන්වීමේ වැඩසටහන පිළිබඳ තොරතුරු ලබාදීමට කරුණාකර මා අමතන්න.',state.requests.includes('mentorship'))}${check('none','දැනට නිෂ්පාදන පිළිබඳ තොරතුරු අවශ්‍ය නැහැ.',state.requests.includes('none'))}${action('flow-preferences','මගේ කැමැත්ත සුරකින්න')}<p class="flow-note">මෙය කිසිවක් මිලදී ගැනීමක් හෝ ගාස්තු අය කරන වැඩසටහනකට ඇතුළත් වීමක් නොවේ.</p><p id="flow-pref-status" role="status"></p></section>`;
  }
  function render() {
    const container = $('quiz-content-area'); if (!container) return;
    $('quiz-intro-text').style.display = 'none';
    $('quiz-nav').style.display = 'none';
    const result = state.screen === 'result';
    const labels = { details: 'ඔබේ තොරතුරු', custom: 'වැඩමුළුවට සහභාගී වීම', enquiry: 'ඔබේ විමසීම', enquiry_done: 'විමසීම ලැබී ඇත', result: 'ලියාපදිංචිය සම්පූර්ණයි' };
    $('quiz-phase-label').textContent = state.screen === 'question' ? `ප්‍රශ්න 4න් ${state.step + 1}` : labels[state.screen] || '';
    $('quiz-progress-fill').style.width = result ? '100%' : state.screen === 'question' ? `${state.step * 25}%` : '0%';
    let view;
    switch (state.screen) {
      case 'question': view = questionView(); break;
      case 'custom': view = customView(); break;
      case 'enquiry': view = enquiryView(); break;
      case 'enquiry_done': view = `<h2 class="quiz-q-title" tabindex="-1">${preview?'පෙරදසුන් විමසීම සුරැකී ඇත.':'ඔබේ විමසීම ලැබී ඇත.'}</h2><p>ඔබ ලබාදුන් සම්බන්ධතා තොරතුරු හරහා කණ්ඩායම පිළිතුරු ලබාදෙනු ඇත. මෙය තහවුරු කළ ඇණවුමක් හෝ වැඩමුළු ලියාපදිංචියක් නොවේ.</p>`; break;
      case 'result': view = resultView(); break;
      default: view = detailsView();
    }
    container.innerHTML = `<div class="quiz-question${result?' quiz-result':''}">${preview?'<p class="flow-banner" role="note">පෙරදසුන පමණයි — දත්ත මෙම පිටුව තුළ පමණක් අනුකරණය කෙරේ. සැබෑ ලියාපදිංචියක් හෝ විමසීමක් යවා නැත.</p>':''}${view}<div class="flow-errors" id="flow-errors" role="alert" tabindex="-1">${escape(state.error)}</div><div class="flow-status" id="flow-status" role="status" aria-live="polite"></div></div>`;
    const nextKey = `${state.screen}:${state.step}`;
    if (nextKey !== renderedKey) { $('quiz-main-panel').scrollTop = 0; renderedKey = nextKey; }
    bind(); setPending(state.pending);
    if (state.error) $('flow-errors').focus?.();
    else container.querySelector('.quiz-q-title')?.focus({ preventScroll: true });
  }
  function bind() {
    const on = (id, eventName, fn) => $(id)?.addEventListener(eventName, fn);
    on('flow-details','input',captureDetails); on('flow-details','change',captureDetails);
    on('flow-details','submit', e => { e.preventDefault(); captureDetails(); if (!validateDetails()) { render(); $('quiz-content-area').querySelector('[aria-invalid="true"]')?.focus(); return; } save(async()=>{
      const source = new URLSearchParams(location.search).get('source');
      const allow = config.sourceCodes || config.approvedSourceCodes || ['direct'];
      const details = { name: state.details.name.trim(), phone: normalPhone(), email: state.details.email.trim(), workshop_contact_acknowledgement: true, marketing_opt_in: state.details.marketing_opt_in, source_code: allow.includes(source)?source:'direct', test_flag: preview || config.testFlag === true };
      const response = await request('start',{details});
      if (!response.registration_id || !response.session_token || response.status !== 'started') throw new Error('INVALID_START_ACK');
      state.registration_id = response.registration_id; state.session_token = response.session_token; state.saved = true; state.screen = 'question';
      analytics('details_saved');
    }); });
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
        else {
          const response = await request('complete',{answers:{...state.answers},custom_attending:state.custom_attending});
          if (response.status!=='complete') throw new Error('INVALID_COMPLETE_ACK');
          const expected = selectVideo(state.answers,state.custom_attending);
          if (response.video_id && response.video_id!==expected) throw new Error('INVALID_ROUTE_ACK');
          state.video = expected; state.screen='result'; analytics('registration_complete'); analytics('branch_preview_shown',{video_id:expected});
        }
      });
    });
    on('flow-back','click',()=>{
      if (state.pending) return; state.error='';
      if (state.screen==='enquiry') state.screen='custom';
      else if (state.screen==='custom') { state.screen='question'; state.step=0; }
      else if (state.step>0) { state.step--; if(state.step===0 && state.answers.Q1==='CUSTOM') state.screen='custom'; }
      else state.screen='details'; render();
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
    on('flow-preferences','click',()=>save(async()=>{ if(!state.requests.length) state.requests=['none']; await request('preferences',{requests:[...state.requests],explicit_product_request:[...state.requests]}); state.preferenceSaved=true; }));
    if(state.preferenceSaved && $('flow-pref-status')) $('flow-pref-status').textContent='ඔබේ කැමැත්ත සුරැකී ඇත.';
    on('flow-membership','click',()=>save(async()=>{ await request('membership',{membership_state:'self_reported'}); state.membership='self_reported'; }));
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
    const month=new Intl.DateTimeFormat('si-LK',{month:'long',timeZone:'Asia/Colombo'}).format(date);
    for(const prefix of ['home','modal']) { if($(`${prefix}-event-month`)) $(`${prefix}-event-month`).textContent=month; if($(`${prefix}-event-day`)) $(`${prefix}-event-day`).textContent=String(date.getUTCDate()); if($(`${prefix}-event-time`)) $(`${prefix}-event-time`).textContent=timeText(); }
    const days=['ඉරිදා','සඳුදා','අඟහරුවාදා','බදාදා','බ්‍රහස්පතින්දා','සිකුරාදා','සෙනසුරාදා'], short=['ඉරි','සඳු','අඟ','බදා','බ්‍රහ','සිකු','සෙන'];
    if($('home-event-year')) $('home-event-year').textContent=String(date.getUTCFullYear());
    if($('home-event-weekday')) $('home-event-weekday').textContent=days[date.getUTCDay()];
    const week=document.querySelector('.date-week'), monday=new Date(date); monday.setUTCDate(date.getUTCDate()-(date.getUTCDay()+6)%7);
    if(week) week.innerHTML=Array.from({length:7},(_,i)=>{ const d=new Date(monday); d.setUTCDate(monday.getUTCDate()+i); return `<li${i===(date.getUTCDay()+6)%7?' class="is-event"':''}><span>${short[d.getUTCDay()]}</span>${d.getUTCDate()}</li>`; }).join('');
  }
  if(document.readyState==='loading') document.addEventListener('DOMContentLoaded',dates); else dates();
  // Legacy headline font: show the converted string only once the font is available.
  const legacy=document.querySelectorAll('[data-legacy]');
  if(legacy.length && document.fonts) document.fonts.load('1em "Tharu Digital Mahee"').then(faces=>{ if(!faces.length) return; legacy.forEach(el=>{ const text=el.innerHTML; el.innerHTML=`<span class="sr-only">${text}</span><span class="legacy-si" aria-hidden="true"></span>`; el.lastChild.textContent=el.dataset.legacy; el.classList.add('has-legacy'); }); }).catch(()=>{});
})();
