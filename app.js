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
    const status = $('flow-status'); if (status) status.textContent = value ? (state.screen === 'question' && state.step === 3 ? 'ඔබේ ලියාපදිංචිය සම්පූර්ණ කරමින් පවතී…' : 'ඔබේ තොරතුරු සුරකිමින් පවතී…') : '';
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
    if (!d.workshop_contact_acknowledgement) errors.workshop_contact_acknowledgement = 'ඉදිරියට යාමට වැඩමුළුව පිළිබඳ පණිවිඩ ලබාගැනීම සඳහා ඇති එකඟතාව තහවුරු කරන්න.';
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
  // Basic details are asked one field per screen; the details are saved (status=started) after the last one.
  const detailKeys = [['name'], ['phone'], ['email'], ['workshop_contact_acknowledgement']];
  function detailsView() {
    const privacy = safeUrl(config.privacyUrl || config.privacy_url || '');
    const dialOptions = [['+94','+94 ලංකාව'],['+91','+91 ඉන්දියාව'],['+971','+971 UAE'],['+974','+974 කටාර්'],['+966','+966 සවුදි'],['+965','+965 කුවේට්'],['+968','+968 ඕමාන්'],['+44','+44 UK'],['+61','+61 ඕස්ට්‍රේලියා'],['+1','+1 USA / කැනඩා']].map(([v,l])=>`<option value="${v}"${state.details.dial===v?' selected':''}>${l}</option>`).join('');
    const steps = [
      `<p class="flow-kicker">මුලින්ම ඔබේ මූලික තොරතුරු ලබා දෙන්න.</p><h2 class="quiz-q-title" tabindex="-1"><label for="flow-name">සම්පූර්ණ නම</label></h2>
      <span class="pill-field">${pillIcon('name')}<input class="quiz-text-input" id="flow-name" name="name" autocomplete="name" maxlength="120" placeholder="උදා: නදීශා විජේරත්න" value="${escape(state.details.name)}"${attrs('name')}></span>${errorFor('name')}`,
      `<h2 class="quiz-q-title" tabindex="-1"><label for="flow-phone">WhatsApp දුරකථන අංකය</label></h2>
      <p class="flow-note">ඔබ WhatsApp භාවිත කරන දුරකථන අංකය ඇතුළත් කරන්න.</p>
      <span class="pill-field">${pillIcon('phone')}<select id="flow-dial" class="pill-select" aria-label="රටේ දුරකථන කේතය">${dialOptions}</select><input class="quiz-text-input" id="flow-phone" name="phone" type="tel" inputmode="tel" autocomplete="tel" maxlength="24" placeholder="77 123 4567" value="${escape(state.details.phone)}"${attrs('phone')}></span>${errorFor('phone')}`,
      `<h2 class="quiz-q-title" tabindex="-1"><label for="flow-email">විද්‍යුත් තැපැල් ලිපිනය — අත්‍යවශ්‍ය නොවේ</label></h2>
      <span class="pill-field">${pillIcon('email')}<input class="quiz-text-input" id="flow-email" name="email" type="email" autocomplete="email" maxlength="254" placeholder="name@example.com" value="${escape(state.details.email)}"${attrs('email')}></span>${errorFor('email')}`,
      `${check('workshop_contact_acknowledgement','මෙම වැඩමුළුව සඳහා මගේ ලියාපදිංචිය කළමනාකරණය කිරීමට සහ ලියාපදිංචිය, සහභාගී වීම හා මතක් කිරීම් පිළිබඳ අදාළ පණිවිඩ යැවීමට මගේ තොරතුරු භාවිත කිරීමට මම එකඟ වෙමි. පෞද්ගලිකත්ව නිවේදනය කියවා ඇත.',state.details.workshop_contact_acknowledgement)}
      ${check('marketing_opt_in','ඉදිරියේදී Su Collection වෙතින් ඉගෙනුම් අවස්ථා සහ නිෂ්පාදන පිළිබඳ දැනුවත් කිරීම් ලබාගැනීමටත් මම කැමතියි.',state.details.marketing_opt_in)}
      <p class="flow-fineprint">මෙම වැඩමුළුව කළමනාකරණය කිරීමට සහ ඔබේ ඉගෙනුම් අවශ්‍යතා හඳුනාගැනීමට ඔබේ තොරතුරු සහ පිළිතුරු භාවිත කරමු. තොරතුරු වෙත ප්‍රවේශය, ඒවා රඳවාගැනීම සහ සම්බන්ධ විය යුතු ආකාරය පෞද්ගලිකත්ව නිවේදනයේ දැක්වේ.${help() ? ` අමතර දැනුවත් කිරීම් නතර කිරීමට <a href="${escape(help())}" target="_blank" rel="noopener">උපකාරක සම්බන්ධතාවය</a> අමතන්න.` : ''}</p>${resource('flow-privacy','පෞද්ගලිකත්ව නිවේදනය කියවන්න',privacy,true)}`
    ];
    return `<form id="flow-details" class="flow-form" novalidate>${steps[state.detailStep]}</form>`;
  }
  function questionView() {
    const q = questions[state.step];
    return `${state.step===0 && state.saved ? '<p class="flow-saved">✓ ඔබේ මූලික තොරතුරු සුරැකී ඇත. ලියාපදිංචිය සම්පූර්ණ කිරීමට ඊළඟ කෙටි ප්‍රශ්න හතරට පිළිතුරු දෙන්න.</p>' : ''}${state.step===0 ? '<p class="flow-kicker">ඔබ ඉගෙනගැනීමට කැමති දේ අපට හඳුනාගැනීමට උදව් කරන්න. මෙහි හරි හෝ වැරදි පිළිතුරු නැත. අද ඔබට වඩාත් ගැලපෙන පිළිතුර තෝරන්න.</p>' : ''}<h2 class="quiz-q-title" tabindex="-1">${q.title}</h2><div class="quiz-choices" role="group" aria-label="${q.title}">${Object.entries(q.choices).map(([code,label],i)=>`<button class="quiz-choice${state.answers[q.id]===code?' selected':''}" type="button" data-answer="${code}" aria-pressed="${state.answers[q.id]===code}">${choiceKey(i)}<span class="quiz-choice-label"><span class="sin">${label}</span></span></button>`).join('')}</div>`;
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
      case 'details': return (state.detailStep > 0 ? back : '') + `<button class="quiz-ok-btn" type="submit" form="flow-details">${state.detailStep === 3 ? 'ප්‍රශ්න වෙත යන්න' : 'ඉදිරියට'}</button>`;
      case 'question': return back + action('flow-next', state.step===3 ? 'මගේ නොමිලේ ලියාපදිංචිය සම්පූර්ණ කරන්න' : 'ඉදිරියට');
      case 'custom': return back;
      case 'enquiry': return back + action('flow-send-enquiry','මගේ විමසීම යවන්න');
      default: return '';
    }
  }
  function resultView() {
    const id = state.video, asset = config.videos?.[id] || {};
    const src = safeUrl(asset.src || '');
    const captions = safeUrl(asset.captions || '');
    // PDF gives the NOT_SURE focus only in English ("finding a useful starting point").
    const focus = (state.answers.Q3 === 'NOT_SURE' ? 'ප්‍රයෝජනවත් ආරම්භක තැනක් සොයාගැනීම' : questions[2].choices[state.answers.Q3]).replace(/\.$/, '');
    const transcript = asset.transcript || transcripts[id];
    const body = timeConfirmed() ? transcript.replace(/WhatsApp ප්‍රජාවට එක්වී[^.]*ඡන්දය දෙන්න\./g, 'වැඩමුළුවේ වේලාව දැන් තහවුරු කර ඇත. අවසන් විස්තර සහ වැඩමුළුවට සම්බන්ධ වන සබැඳිය ලබාගැනීමට අපේ WhatsApp ප්‍රජාවට එක්වන්න.') : transcript;
    return `<h2 class="quiz-q-title" tabindex="-1">නොමිලේ වැඩමුළුව සඳහා ඔබේ ලියාපදිංචිය සම්පූර්ණයි.</h2><p class="flow-date">${escape(dateText())}<br>${escape(timeText())}</p>
      <section class="flow-result-section">${resource('flow-community',timeConfirmed()?'WhatsApp ප්‍රජාවට එක්වන්න':'WhatsApp ප්‍රජාවට එක්වී පහසු වේලාවට ඡන්දය දෙන්න',community())}<p>ලියාපදිංචිය සම්පූර්ණයි. WhatsApp ප්‍රජාවට එක්වීම වෙනම පියවරකි. එයට එක්වීමට පෙර වීඩියෝව නැරඹීම අනිවාර්ය නැත.</p><p class="flow-note">දැනටමත් ප්‍රජාවේ සිටිනවාද? එය විවෘත කර ඉහළින් රඳවා ඇති වේලාව පිළිබඳ ඡන්ද විමසීම බලන්න.</p>${resource('flow-help','ප්‍රජාවට එක්වීමට මට උදව් අවශ්‍යයි',help(),true)}</section>
      <section class="flow-result-section"><p>ඔබ තෝරාගත් අවධානය: ${escape(focus)}. වැඩමුළුවේ සඳහන් මාතෘකා පහ සාකච්ඡා කෙරේ. ඔබේ පිළිතුර ඔබේ අවශ්‍යතා හඳුනාගැනීමට අපට උපකාරී වේ.</p><p class="flow-note">ඔබේ තත්ත්වයට අදාළ මෙම කෙටි වීඩියෝව නරඹන්න. නැතිනම් පහත පෙළ කියවන්න.</p>${src ? `<video class="flow-video" id="flow-video" controls playsinline preload="none"${safeUrl(asset.poster)?` poster="${escape(safeUrl(asset.poster))}"`:''}><source src="${escape(src)}">${captions?`<track kind="captions" src="${escape(captions)}" srclang="si" label="සිංහල" default>`:''}</video><p id="flow-video-error" class="flow-note" hidden>වීඩියෝව පූරණය කළ නොහැකි විය. පෙළ කියවන්න හෝ පහත WhatsApp බොත්තම භාවිත කරන්න.</p>` : `<button class="flow-video-placeholder" id="flow-video-placeholder" type="button" data-resource="flow-video-placeholder" aria-label="වීඩියෝව පසුව එක් කෙරේ"><span class="flow-video-play" aria-hidden="true">▶</span><span>වීඩියෝව පසුව එක් කෙරේ</span></button><span class="flow-resource-status" id="flow-video-placeholder-status" role="status"></span>`}<details id="flow-transcript" open><summary>පණිවිඩය කියවන්න</summary><p>${escape(body)}</p></details></section>
      <section class="flow-result-section"><h3>ඔබට අමතර තොරතුරු අවශ්‍යද?</h3><p class="flow-note">මෙය අත්‍යවශ්‍ය නොවන අතර වැඩමුළුවට සහභාගී වීමට බලපාන්නේ නැත.</p>${check('ebook','කරුණාකර ඊ-පොතේ අන්තර්ගතය සහ මිලදී ගැනීමේ තොරතුරු මට එවන්න.',state.requests.includes('ebook'))}${check('mentorship','පුද්ගලික ව්‍යාපාර මඟපෙන්වීමේ වැඩසටහන පිළිබඳ තොරතුරු ලබාදීමට කරුණාකර මා අමතන්න.',state.requests.includes('mentorship'))}${check('none','දැනට නිෂ්පාදන පිළිබඳ තොරතුරු අවශ්‍ය නැහැ.',state.requests.includes('none'))}${action('flow-preferences','මගේ කැමැත්ත සුරකින්න')}<p class="flow-note">මෙය කිසිවක් මිලදී ගැනීමක් හෝ ගාස්තු අය කරන වැඩසටහනකට ඇතුළත් වීමක් නොවේ.</p><p id="flow-pref-status" role="status"></p></section>`;
  }
  function render() {
    const container = $('quiz-content-area'); if (!container) return;
    const result = state.screen === 'result';
    const labels = { details: 'ඔබේ තොරතුරු', custom: 'ප්‍රශ්න 4න් 1', result: 'ලියාපදිංචිය සම්පූර්ණයි' };
    const total = 8, index = state.screen === 'details' ? state.detailStep : state.screen === 'question' ? 4 + state.step : null;
    $('quiz-phase-label').textContent = state.screen === 'question' ? `ප්‍රශ්න 4න් ${state.step + 1}` : labels[state.screen] || '';
    $('quiz-progress-fill').style.width = `${(result || state.screen === 'enquiry_done' ? 1 : index === null ? 5 / total : (index + 1) / total) * 100}%`;
    let view;
    switch (state.screen) {
      case 'question': view = questionView(); break;
      case 'custom': view = customView(); break;
      case 'enquiry': view = enquiryView(); break;
      case 'enquiry_done': view = `<h2 class="quiz-q-title" tabindex="-1">ඔබේ විමසීම ලැබී ඇත.</h2><p>ඔබ ලබාදුන් සම්බන්ධතා තොරතුරු හරහා කණ්ඩායම පිළිතුරු ලබාදෙනු ඇත. මෙය තහවුරු කළ ඇණවුමක් හෝ වැඩමුළු ලියාපදිංචියක් නොවේ.</p>`; break;
      case 'result': view = resultView(); break;
      default: view = detailsView();
    }
    container.innerHTML = `<div class="quiz-question${result?' quiz-result':''}">${view}<div class="flow-errors" id="flow-errors" role="alert" tabindex="-1">${escape(state.error)}</div><div class="flow-status" id="flow-status" role="status" aria-live="polite"></div></div>`;
    $('quiz-nav').innerHTML = actionsView();
    const nextKey = `${state.screen}:${state.step}`;
    if (nextKey !== renderedKey) { $('quiz-main-panel').scrollTop = 0; renderedKey = nextKey; }
    bind(); setPending(state.pending); window.WorkshopI18n?.apply();
    if (state.error) $('flow-errors').focus?.();
    else (state.screen === 'details' && container.querySelector('.pill-field input, .flow-check input') || container.querySelector('.quiz-q-title'))?.focus({ preventScroll: true });
  }
  function bind() {
    const on = (id, eventName, fn) => $(id)?.addEventListener(eventName, fn);
    const clearError = e => { const key = e.target.id?.replace('flow-',''); captureDetails(); if (!state.errors[key]) return; delete state.errors[key]; $(`error-${key}`)?.remove(); e.target.removeAttribute('aria-invalid'); e.target.removeAttribute('aria-describedby'); };
    on('flow-details','input',clearError); on('flow-details','change',clearError);
    on('flow-details','submit', e => { e.preventDefault(); captureDetails();
      const invalid = () => { render(); $('quiz-content-area').querySelector('[aria-invalid="true"]')?.focus(); };
      validateDetails(); state.errors = Object.fromEntries(Object.entries(state.errors).filter(([key]) => detailKeys[state.detailStep].includes(key)));
      if (Object.keys(state.errors).length) return invalid();
      if (state.detailStep < 3) { state.detailStep++; render(); return; }
      if (!validateDetails()) { state.detailStep = detailKeys.findIndex(keys => keys.some(key => state.errors[key])); return invalid(); }
      save(async()=>{
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
      if (state.pending) return; state.error=''; state.errors={};
      if (state.screen==='details') { state.detailStep=Math.max(0,state.detailStep-1); render(); return; }
      if (state.screen==='enquiry') state.screen='custom';
      else if (state.screen==='custom') { state.screen='question'; state.step=0; }
      else if (state.step>0) { state.step--; if(state.step===0 && state.answers.Q1==='CUSTOM') state.screen='custom'; }
      else { state.screen='details'; state.detailStep=3; } render();
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
    const english=window.WorkshopI18n?.getLanguage()==='en';
    const months=english?['January','February','March','April','May','June','July','August','September','October','November','December']:['ජනවාරි','පෙබරවාරි','මාර්තු','අප්‍රේල්','මැයි','ජූනි','ජූලි','අගෝස්තු','සැප්තැම්බර්','ඔක්තෝබර්','නොවැම්බර්','දෙසැම්බර්'];
    const month=months[date.getUTCMonth()];
    for(const prefix of ['home','modal']) { if($(`${prefix}-event-month`)) $(`${prefix}-event-month`).textContent=month; if($(`${prefix}-event-day`)) $(`${prefix}-event-day`).textContent=String(date.getUTCDate()); if($(`${prefix}-event-time`)) $(`${prefix}-event-time`).textContent=timeText(); }
    const days=english?['Sunday','Monday','Tuesday','Wednesday','Thursday','Friday','Saturday']:['ඉරිදා','සඳුදා','අඟහරුවාදා','බදාදා','බ්‍රහස්පතින්දා','සිකුරාදා','සෙනසුරාදා'], short=english?['Sun','Mon','Tue','Wed','Thu','Fri','Sat']:['ඉරි','සඳු','අඟ','බදා','බ්‍රහ','සිකු','සෙන'];
    const shortMonth=english?months[date.getUTCMonth()].slice(0,3):month;
    for(const prefix of ['home','modal']) { if($(`${prefix}-event-year`)) $(`${prefix}-event-year`).textContent=String(date.getUTCFullYear()); if($(`${prefix}-event-weekday`)) $(`${prefix}-event-weekday`).textContent=days[date.getUTCDay()]; }
    if($('modal-event-month-short')) $('modal-event-month-short').textContent=shortMonth;
    if($('home-event-time') && !timeConfirmed()) $('home-event-time').textContent=`${timeText()} ඔබට පහසු වේලාව සඳහා ඡන්දය දීමට ලියාපදිංචි වී ප්‍රජාවට එක්වන්න.`;
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
