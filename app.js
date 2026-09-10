// ==========================================
// [RESTORED] SU COLLECTION x UVA VEC - Vanilla JS Funnel
// ==========================================
// SU COLLECTION x UVA VEC - Vanilla JS Funnel
// ==========================================

const WEBHOOK_URL = "https://script.google.com/macros/s/AKfycbwTDfrks1x-dRDNnwsGQLJuP8h6PZgoJn49w6VySphaO_Yp7oZoQ-en9bpKx7EeuBi52g/exec";

// Helper: bilingual label
const bi = (sin, eng) => `<span class="sin">${sin}</span><br><span class="eng">${eng}</span>`;

const QUIZ_QUESTIONS = [
  {
    id: 'CONTACT-NAME', field: 'name', type: 'short-text', phase: 'step1',
    stepLabel: bi('සම්පූර්ණ නම', 'Full Name'),
    title: bi('සම්පූර්ණ නම', 'Full Name'),
    placeholder: 'උදා: නදීශා / e.g. Nadeesha',
    optional: false,
  },
  {
    id: 'CONTACT-PHONE', field: 'phone', type: 'short-text', phase: 'step1',
    stepLabel: bi('දුරකථන අංකය', 'Mobile / WhatsApp Number'),
    title: bi('දුරකථන අංකය', 'Mobile / WhatsApp Number'),
    placeholder: '07XXXXXXXX',
    optional: false,
  },
  {
    id: 'CONTACT-EMAIL', field: 'email', type: 'short-text', phase: 'step1',
    stepLabel: bi('විද්‍යුත් තැපැල් ලිපිනය', 'Email Address'),
    title: bi('විද්‍යුත් තැපැල් ලිපිනය (අනිවාර්ය නොවේ)', 'Email Address (Not Mandatory)'),
    placeholder: 'ඊමේල් (අනිවාර්ය නොවේ) / Email (Optional)',
    optional: true,
  },
  {
    id: 'CONTACT-COUNTRY', field: 'country', type: 'country-select', phase: 'step1',
    stepLabel: bi('රට', 'Country'),
    title: bi('ඔබ පදිංචි රට', 'Country'),
    optional: false,
  },
  {
    id: 'CONTACT-DISTRICT', field: 'district', type: 'district-select', phase: 'step1',
    stepLabel: bi('දිස්ත්‍රික්කය', 'District'),
    title: bi('ඔයා ඉන්නේ ලංකාවේ කොහේද?', 'Which district are you from?'),
    showIf: (a) => a.country === 'Sri Lanka',
    optional: false,
  },
  {
    id: 'DIAG-01', field: 'currentSituation', type: 'single-choice', phase: 'step1',
    stepLabel: bi('ඔයා ගැන', 'About You'),
    title: bi('ඔයා ගැන වැඩියෙන්ම විස්තර කරන්නෙ කොහොමද?', 'Which best describes you?'),
    choices: [
      { key: 'A', value: 'learning', label: bi('මම මැහුම් කටයුතු ඉගෙන ගන්නවා', 'I am learning tailoring') },
      { key: 'B', value: 'job', label: bi('මම මැහුම් කටයුතු රැකියාවක් හෝ සේවාවක් විදිහට කරනවා', 'I do tailoring as a job or service') },
      { key: 'C', value: 'tailoring-biz', label: bi('මම මැහුම් කටයුතු හා සම්බන්ධ ව්‍යාපාරයක් කරනවා', 'I run a tailoring or clothing-related business') },
      { key: 'D', value: 'other-biz', label: bi('මම වෙනත් කුඩා ව්‍යාපාරයක් කරනවා', 'I run another small business') },
      { key: 'E', value: 'planning', label: bi('මම ව්‍යාපාරයක් පටන් ගන්න plan කරනවා', 'I am planning to start a business') },
      { key: 'F', value: 'other', label: bi('වෙනත් / තාම තීරණයක් අරගෙන නෑ', 'Other / not sure yet') },
    ]
  },
  {
    id: 'DIAG-02', field: 'primaryGoal', type: 'multi-select', phase: 'step1',
    stepLabel: bi('අරමුණ', 'Primary Goal'),
    title: bi('ප්‍රධාන වශයෙන්ම ඔයා මේකට සම්බන්ධ වෙලා කරන්න බලාපොරොතු වෙන්නෙ මොකක්ද?', 'Primary goal for joining?'),
    choices: [
      { key: 'A', value: 'improve-skills', label: bi('මැහුම් කුසලතා වැඩිදියුණු කරගන්න', 'Improve my tailoring skills') },
      { key: 'B', value: 'advanced-techniques', label: bi('විධිමත් ක්‍රමයට සංකීර්ණ මැහුම් ක්‍රම පහසුවෙන් ඉගෙනගන්න', 'Learn advanced tailoring techniques') },
      { key: 'C', value: 'start-earning', label: bi('මැහුම් කටයුතු වලින් ආදායමක් ලබා ගන්න', 'Start earning through tailoring') },
      { key: 'D', value: 'grow-tailoring-biz', label: bi('දැනට කරගෙන යන මැහුම් කටයුතු හෝ ව්‍යාපාරය දියුණු කරගන්න', 'Grow my existing tailoring or clothing business') },
      { key: 'E', value: 'grow-business-online', label: bi('අවශ්‍ය digital tools/systems භාවිතයෙන් ව්‍යාපාරයක් online හරහා දියුණු කරගන්න හැටි ඉගෙන ගන්න', 'Learn how to grow a business online using the necessary digital tools and systems.') },
    ]
  },
  {
    id: 'TECH-01', field: 'tailoringSkill', type: 'single-choice', phase: 'step1',
    stepLabel: bi('කුසලතා මට්ටම', 'Skill Level'),
    title: bi('දැනට ඔයාගෙ skill level එක කොහොමද?', 'Current tailoring skill level'),
    choices: [
      { key: 'A', value: 'beginner', label: bi('තාම මම ආධුනිකයි / දැන් පටන් ගන්නවා', 'Beginner / just starting') },
      { key: 'B', value: 'job', label: bi('මම මැහුම් ක්ෂේත්‍රයේ රැකියාවක් කරනවා', 'I work in the tailoring field') },
      { key: 'C', value: 'business', label: bi('මම මැහුම් ආශ්‍රිත ව්‍යාපාරයක් දැනටමත් කරනවා', 'I already run a tailoring-related business') },
      { key: 'D', value: 'planning-tailoring', label: bi('ලඟදීම මැහුම් ආශ්‍රිත ව්‍යාපාරයක් පටන්ගන්න සැලසුම් කරනවා', 'I\'m planning to start a tailoring-related business soon.') },
      { key: 'E', value: 'planning-other', label: bi('මැහුම් නොවන වෙනත් ව්‍යාපාරයක් කරන්න බලාපොරොත්තුවෙන් සිටිනවා', 'I\'m hoping to start a different (non-tailoring) business') },
      { key: 'F', value: 'not-decided', label: bi('තාම තීරණය කරලා නෑ', 'I haven\'t decided yet') },
    ]
  }
];

// ── State ─────────────────────────────────────────────────────────────────────
let state = {
  isOpen: false,
  phase: 'step1',
  qIndex: 0,
  answers: {},
  multiVals: [],
  lastRenderedQ: null
};

// ── App Logic ─────────────────────────────────────────────────────────────────
window.Funnel = {
  openQuiz: () => {
    document.getElementById('quiz-overlay').style.display = 'flex';
    document.body.style.overflow = 'hidden';
    state.isOpen = true;
    window.Funnel.render();
  },

  closeQuiz: () => {
    document.getElementById('quiz-overlay').style.display = 'none';
    document.body.style.overflow = '';
    state.isOpen = false;
  },

  getActiveQuestions: () => {
    return QUIZ_QUESTIONS.filter(q =>
      q.phase === state.phase && (!q.showIf || q.showIf(state.answers))
    );
  },

  render: () => {
    window.Funnel.updateProgressBar();
    if (state.phase === 'result') { window.Funnel.renderResult(); return; }

    const activeQ = window.Funnel.getActiveQuestions();
    const currentQ = activeQ[state.qIndex];
    const contentArea = document.getElementById('quiz-content-area');
    const navBar = document.getElementById('quiz-nav');
    const nextNavBtn = document.getElementById('btn-next-nav');
    const prevBtn = document.getElementById('btn-prev');
    
    if (prevBtn) {
      prevBtn.style.visibility = state.qIndex === 0 ? 'hidden' : 'visible';
    }
    
    const introText = document.getElementById('quiz-intro-text');
    if (introText) {
      const showIntro = ['name', 'phone', 'email', 'country', 'district'].includes(currentQ.field);
      introText.style.display = showIntro ? 'block' : 'none';
    }
    
    // Check if it's the last question to change the "Next" button to "Submit"
    let nextBtnText = "ඉදිරියට / Next";
    let isLastQ = (state.qIndex === activeQ.length - 1);
    if (isLastQ) {
      nextBtnText = "Submit";
    }

    if (nextNavBtn) {
      nextNavBtn.style.display = 'none';
      nextNavBtn.innerHTML = nextBtnText;
      if (isLastQ) {
        nextNavBtn.style.background = '#000';
        nextNavBtn.style.color = '#fff';
      } else {
        nextNavBtn.style.background = '';
        nextNavBtn.style.color = '';
      }
    }

    const isSameQ = state.lastRenderedQ === currentQ.id || !state.lastRenderedQ;
    state.lastRenderedQ = currentQ.id;

    if (!isSameQ) {
      const panel = document.getElementById('quiz-main-panel');
      if (panel) panel.scrollTo({ top: 0, behavior: 'smooth' });
    }

    contentArea.innerHTML = '';

    if (currentQ.type === 'single-choice') {
      navBar.style.display = 'flex';
      const hasAnswer = state.answers[currentQ.field] !== undefined;
      if (hasAnswer && nextNavBtn) nextNavBtn.style.display = 'inline-flex';

      let html = `
        <div class="quiz-question ${isSameQ ? 'no-anim' : ''}">
          <h2 class="quiz-q-title">${currentQ.title}</h2>
          <div class="quiz-choices">
      `;
      currentQ.choices.forEach(c => {
        const isSel = state.answers[currentQ.field] === c.value;
        const vStr = typeof c.value === 'string' ? `'${c.value}'` : c.value;
        html += `
          <button class="quiz-choice ${isSel ? 'selected' : ''}"
            onclick="window.Funnel.selectSingle('${currentQ.field}', ${vStr})">
            <span class="quiz-choice-key">${c.key}</span>
            <span class="quiz-choice-label">${c.label}</span>
          </button>
        `;
      });
      html += `</div></div>`;
      contentArea.innerHTML = html;
    }
    else if (currentQ.type === 'multi-select') {
      navBar.style.display = 'flex';
      if (!state.multiVals.length && state.answers[currentQ.field]) {
        state.multiVals = [...state.answers[currentQ.field]];
      }
      let html = `
        <div class="quiz-question ${isSameQ ? 'no-anim' : ''}">
          <h2 class="quiz-q-title">${currentQ.title}</h2>
          <div class="quiz-choices multi-select-choices">
      `;
      currentQ.choices.forEach(c => {
        const isSel = state.multiVals.includes(c.value);
        html += `
          <button class="quiz-choice ${isSel ? 'selected' : ''}"
            onclick="window.Funnel.toggleMulti('${c.value}', '${currentQ.field}')">
            <span class="quiz-choice-key multi-check">${c.key}</span>
            <span class="quiz-choice-label">${c.label}</span>
          </button>
        `;
      });
      html += `</div>
        <button class="quiz-ok-btn" onclick="window.Funnel.commitMulti('${currentQ.field}')"
          ${state.multiVals.length === 0 ? 'disabled' : ''} style="${isLastQ ? 'background:#000;color:#fff;' : ''}">
          ${isLastQ ? 'Submit' : 'OK'}
        </button>
      </div>`;
      contentArea.innerHTML = html;
    }
    else if (currentQ.type === 'country-select' || currentQ.type === 'district-select') {
      navBar.style.display = 'flex';
      const existing = state.answers[currentQ.field] || '';
      const hasSelection = existing.trim().length > 0;
      
      let optionsHtml = '';
      if (currentQ.type === 'country-select') {
        optionsHtml = `
          <option value="" disabled selected>රට තෝරන්න / Select Country</option>
          <option value="Sri Lanka">ශ්‍රී ලංකාව / Sri Lanka</option>
          <option value="Afghanistan">ඇෆ්ගනිස්ථානය / Afghanistan</option>
          <option value="Albania">ඇල්බේනියාව / Albania</option>
          <option value="Algeria">ඇල්ජීරියාව / Algeria</option>
          <option value="Andorra">ඇන්ඩෝරාව / Andorra</option>
          <option value="Angola">ඇන්ගෝලාව / Angola</option>
          <option value="Antigua and Barbuda">ඇන්ටිගුවා සහ බාබියුඩා / Antigua and Barbuda</option>
          <option value="Argentina">ආර්ජන්ටිනාව / Argentina</option>
          <option value="Armenia">ආර්මේනියාව / Armenia</option>
          <option value="Australia">ඕස්ට්‍රේලියාව / Australia</option>
          <option value="Austria">ඔස්ට්‍රියාව / Austria</option>
          <option value="Azerbaijan">අසර්බයිජානය / Azerbaijan</option>
          <option value="Bahamas">බහමාස් / Bahamas</option>
          <option value="Bahrain">බහරේන් / Bahrain</option>
          <option value="Bangladesh">බංග්ලාදේශය / Bangladesh</option>
          <option value="Barbados">බාබඩෝස් / Barbados</option>
          <option value="Belarus">බෙලරුස් / Belarus</option>
          <option value="Belgium">බෙල්ජියම / Belgium</option>
          <option value="Belize">බෙලීස් / Belize</option>
          <option value="Benin">බෙනින් / Benin</option>
          <option value="Bhutan">භූතානය / Bhutan</option>
          <option value="Bolivia">බොලිවියාව / Bolivia</option>
          <option value="Bosnia and Herzegovina">බොස්නියාව සහ හර්සගොවිනාව / Bosnia and Herzegovina</option>
          <option value="Botswana">බොට්ස්වානා / Botswana</option>
          <option value="Brazil">බ්‍රසීලය / Brazil</option>
          <option value="Brunei">බෲනායි / Brunei</option>
          <option value="Bulgaria">බල්ගේරියාව / Bulgaria</option>
          <option value="Burkina Faso">බුර්කිනා ෆාසෝ / Burkina Faso</option>
          <option value="Burundi">බුරුන්ඩි / Burundi</option>
          <option value="Cabo Verde">කේප් වර්ඩ් / Cabo Verde</option>
          <option value="Cambodia">කාම්බෝජය / Cambodia</option>
          <option value="Cameroon">කැමරූන් / Cameroon</option>
          <option value="Canada">කැනඩාව / Canada</option>
          <option value="Central African Republic">මධ්‍යම අප්‍රිකානු ජනරජය / Central African Republic</option>
          <option value="Chad">චැඩ් / Chad</option>
          <option value="Chile">චිලී / Chile</option>
          <option value="China">චීනය / China</option>
          <option value="Colombia">කොලොම්බියාව / Colombia</option>
          <option value="Comoros">කොමරෝස් / Comoros</option>
          <option value="Congo (Congo-Brazzaville)">කොංගෝව / Congo (Congo-Brazzaville)</option>
          <option value="Costa Rica">කොස්ටාරිකා / Costa Rica</option>
          <option value="Croatia">ක්‍රොඒෂියාව / Croatia</option>
          <option value="Cuba">කියුබාව / Cuba</option>
          <option value="Cyprus">සයිප්‍රසය / Cyprus</option>
          <option value="Czechia (Czech Republic)">චෙක් ජනරජය / Czechia</option>
          <option value="Democratic Republic of the Congo">කොංගෝ ප්‍රජාතන්ත්‍රවාදී ජනරජය / DR Congo</option>
          <option value="Denmark">ඩෙන්මාර්කය / Denmark</option>
          <option value="Djibouti">ජිබුටි / Djibouti</option>
          <option value="Dominica">ඩොමිනිකා / Dominica</option>
          <option value="Dominican Republic">ඩොමිනිකන් ජනරජය / Dominican Republic</option>
          <option value="Ecuador">ඉක්වදෝරය / Ecuador</option>
          <option value="Egypt">ඊජිප්තුව / Egypt</option>
          <option value="El Salvador">එල් සැල්වදෝරය / El Salvador</option>
          <option value="Equatorial Guinea">සමක ගිනියාව / Equatorial Guinea</option>
          <option value="Eritrea">එරිත්‍රියාව / Eritrea</option>
          <option value="Estonia">එස්තෝනියාව / Estonia</option>
          <option value="Eswatini (fmr. Swaziland)">එස්වාටිනි / Eswatini</option>
          <option value="Ethiopia">ඉතියෝපියාව / Ethiopia</option>
          <option value="Fiji">ෆීජි / Fiji</option>
          <option value="Finland">ෆින්ලන්තය / Finland</option>
          <option value="France">ප්‍රංශය / France</option>
          <option value="Gabon">ගැබොන් / Gabon</option>
          <option value="Gambia">ගැම්බියාව / Gambia</option>
          <option value="Georgia">ජෝර්ජියාව / Georgia</option>
          <option value="Germany">ජර්මනිය / Germany</option>
          <option value="Ghana">ඝානාව / Ghana</option>
          <option value="Greece">ග්‍රීසිය / Greece</option>
          <option value="Grenada">ග්‍රෙනේඩා / Grenada</option>
          <option value="Guatemala">ග්වාතමාලාව / Guatemala</option>
          <option value="Guinea">ගිනියාව / Guinea</option>
          <option value="Guinea-Bissau">ගිනියා-බිසව් / Guinea-Bissau</option>
          <option value="Guyana">ගයනාව / Guyana</option>
          <option value="Haiti">හයිටි / Haiti</option>
          <option value="Honduras">හොන්ඩුරාස් / Honduras</option>
          <option value="Hungary">හංගේරියාව / Hungary</option>
          <option value="Iceland">අයිස්ලන්තය / Iceland</option>
          <option value="India">ඉන්දියාව / India</option>
          <option value="Indonesia">ඉන්දුනීසියාව / Indonesia</option>
          <option value="Iran">ඉරානය / Iran</option>
          <option value="Iraq">ඉරාකය / Iraq</option>
          <option value="Ireland">අයර්ලන්තය / Ireland</option>
          <option value="Israel">ඊශ්‍රායලය / Israel</option>
          <option value="Italy">ඉතාලිය / Italy</option>
          <option value="Jamaica">ජැමෙයිකාව / Jamaica</option>
          <option value="Japan">ජපානය / Japan</option>
          <option value="Jordan">ජෝර්දානය / Jordan</option>
          <option value="Kazakhstan">කසකස්ථානය / Kazakhstan</option>
          <option value="Kenya">කෙන්යාව / Kenya</option>
          <option value="Kiribati">කිරිබතී / Kiribati</option>
          <option value="Kuwait">කුවේටය / Kuwait</option>
          <option value="Kyrgyzstan">කිර්ගිස්ථානය / Kyrgyzstan</option>
          <option value="Laos">ලාඕසය / Laos</option>
          <option value="Latvia">ලැට්වියාව / Latvia</option>
          <option value="Lebanon">ලෙබනනය / Lebanon</option>
          <option value="Lesotho">ලෙසෝතෝ / Lesotho</option>
          <option value="Liberia">ලයිබීරියාව / Liberia</option>
          <option value="Libya">ලිබියාව / Libya</option>
          <option value="Liechtenstein">ලික්ටෙන්ස්ටයින් / Liechtenstein</option>
          <option value="Lithuania">ලිතුවේනියාව / Lithuania</option>
          <option value="Luxembourg">ලක්සම්බර්ග් / Luxembourg</option>
          <option value="Madagascar">මැඩගස්කරය / Madagascar</option>
          <option value="Malawi">මලාවි / Malawi</option>
          <option value="Malaysia">මැලේසියාව / Malaysia</option>
          <option value="Maldives">මාලදිවයින / Maldives</option>
          <option value="Mali">මාලි / Mali</option>
          <option value="Malta">මෝල්ටාව / Malta</option>
          <option value="Marshall Islands">මාෂල් දූපත් / Marshall Islands</option>
          <option value="Mauritania">මොරිටේනියාව / Mauritania</option>
          <option value="Mauritius">මුරුසිය / Mauritius</option>
          <option value="Mexico">මෙක්සිකෝව / Mexico</option>
          <option value="Micronesia">මයික්‍රොනීසියාව / Micronesia</option>
          <option value="Moldova">මෝල්ඩෝවා / Moldova</option>
          <option value="Monaco">මොනාකෝ / Monaco</option>
          <option value="Mongolia">මොංගෝලියාව / Mongolia</option>
          <option value="Montenegro">මොන්ටිනිග්‍රෝ / Montenegro</option>
          <option value="Morocco">මොරොක්කෝව / Morocco</option>
          <option value="Mozambique">මොසැම්බික් / Mozambique</option>
          <option value="Myanmar (formerly Burma)">මියන්මාරය / Myanmar</option>
          <option value="Namibia">නැමීබියාව / Namibia</option>
          <option value="Nauru">නාඌරූ / Nauru</option>
          <option value="Nepal">නේපාලය / Nepal</option>
          <option value="Netherlands">නෙදර්ලන්තය / Netherlands</option>
          <option value="New Zealand">නවසීලන්තය / New Zealand</option>
          <option value="Nicaragua">නිකරගුවාව / Nicaragua</option>
          <option value="Niger">නයිජර් / Niger</option>
          <option value="Nigeria">නයිජීරියාව / Nigeria</option>
          <option value="North Korea">උතුරු කොරියාව / North Korea</option>
          <option value="North Macedonia">උතුරු මැසිඩෝනියාව / North Macedonia</option>
          <option value="Norway">නෝර්වේ / Norway</option>
          <option value="Oman">ඕමානය / Oman</option>
          <option value="Pakistan">පාකිස්ථානය / Pakistan</option>
          <option value="Palau">පලාවු / Palau</option>
          <option value="Palestine State">පලස්තීනය / Palestine State</option>
          <option value="Panama">පැනමාව / Panama</option>
          <option value="Papua New Guinea">පැපුවා නිව්ගිනියාව / Papua New Guinea</option>
          <option value="Paraguay">පැරගුවේ / Paraguay</option>
          <option value="Peru">පේරු / Peru</option>
          <option value="Philippines">පිලිපීනය / Philippines</option>
          <option value="Poland">පෝලන්තය / Poland</option>
          <option value="Portugal">පෘතුගාලය / Portugal</option>
          <option value="Qatar">කටාර් / Qatar</option>
          <option value="Romania">රුමේනියාව / Romania</option>
          <option value="Russia">රුසියාව / Russia</option>
          <option value="Rwanda">රුවන්ඩාව / Rwanda</option>
          <option value="Saint Kitts and Nevis">ශාන්ත කිට්ස් සහ නේවිස් / Saint Kitts and Nevis</option>
          <option value="Saint Lucia">ශාන්ත ලුසියා / Saint Lucia</option>
          <option value="Saint Vincent and the Grenadines">ශාන්ත වින්සන්ට් සහ ග්‍රෙනඩින්ස් / St. Vincent & Grenadines</option>
          <option value="Samoa">සැමෝවා / Samoa</option>
          <option value="San Marino">සැන් මරිනෝ / San Marino</option>
          <option value="Sao Tome and Principe">සාඕ ටෝම් සහ ප්‍රින්සිපේ / Sao Tome and Principe</option>
          <option value="Saudi Arabia">සෞදි අරාබිය / Saudi Arabia</option>
          <option value="Senegal">සෙනගල් / Senegal</option>
          <option value="Serbia">සර්බියාව / Serbia</option>
          <option value="Seychelles">සීෂෙල්ස් / Seychelles</option>
          <option value="Sierra Leone">සියෙරා ලියොන් / Sierra Leone</option>
          <option value="Singapore">සිංගප්පූරුව / Singapore</option>
          <option value="Slovakia">ස්ලෝවැකියාව / Slovakia</option>
          <option value="Slovenia">ස්ලෝවේනියාව / Slovenia</option>
          <option value="Solomon Islands">සොලමන් දූපත් / Solomon Islands</option>
          <option value="Somalia">සෝමාලියාව / Somalia</option>
          <option value="South Africa">දකුණු අප්‍රිකාව / South Africa</option>
          <option value="South Korea">දකුණු කොරියාව / South Korea</option>
          <option value="South Sudan">දකුණු සුඩානය / South Sudan</option>
          <option value="Spain">ස්පාඤ්ඤය / Spain</option>
          <option value="Sudan">සුඩානය / Sudan</option>
          <option value="Suriname">සුරිනාමය / Suriname</option>
          <option value="Sweden">ස්වීඩනය / Sweden</option>
          <option value="Switzerland">ස්විට්සර්ලන්තය / Switzerland</option>
          <option value="Syria">සිරියාව / Syria</option>
          <option value="Tajikistan">තජිකිස්ථානය / Tajikistan</option>
          <option value="Tanzania">ටැන්සානියාව / Tanzania</option>
          <option value="Thailand">තායිලන්තය / Thailand</option>
          <option value="Timor-Leste">ටිමෝර්-ලෙස්ටේ / Timor-Leste</option>
          <option value="Togo">ටෝගෝ / Togo</option>
          <option value="Tonga">ටොංගා / Tonga</option>
          <option value="Trinidad and Tobago">ට්‍රිනිඩෑඩ් සහ ටොබැගෝ / Trinidad and Tobago</option>
          <option value="Tunisia">ටියුනීසියාව / Tunisia</option>
          <option value="Turkey">තුර්කිය / Turkey</option>
          <option value="Turkmenistan">ටර්ක්මෙනිස්තානය / Turkmenistan</option>
          <option value="Tuvalu">ටුවාලු / Tuvalu</option>
          <option value="Uganda">උගන්ඩාව / Uganda</option>
          <option value="Ukraine">යුක්රේනය / Ukraine</option>
          <option value="United Arab Emirates">එක්සත් අරාබි එමීර් රාජ්‍යය / United Arab Emirates</option>
          <option value="United Kingdom">එක්සත් රාජධානිය / United Kingdom</option>
          <option value="United States of America">ඇමරිකා එක්සත් ජනපදය / United States</option>
          <option value="Uruguay">උරුගුවේ / Uruguay</option>
          <option value="Uzbekistan">උස්බෙකිස්ථානය / Uzbekistan</option>
          <option value="Vanuatu">වනුවාටු / Vanuatu</option>
          <option value="Venezuela">වෙනිසියුලාව / Venezuela</option>
          <option value="Vietnam">වියට්නාමය / Vietnam</option>
          <option value="Yemen">යේමනය / Yemen</option>
          <option value="Zambia">සැම්බියාව / Zambia</option>
          <option value="Zimbabwe">සිම්බාබ්වේ / Zimbabwe</option>
        `;
      } else {
        optionsHtml = `
          <option value="" disabled selected>දිස්ත්‍රික්කය තෝරන්න / Select District</option>
          <option value="Ampara">අම්පාර / Ampara</option>
          <option value="Anuradhapura">අනුරාධපුර / Anuradhapura</option>
          <option value="Badulla">බදුල්ල / Badulla</option>
          <option value="Batticaloa">මඩකලපුව / Batticaloa</option>
          <option value="Colombo">කොළඹ / Colombo</option>
          <option value="Galle">ගාල්ල / Galle</option>
          <option value="Gampaha">ගම්පහ / Gampaha</option>
          <option value="Hambantota">හම්බන්තොට / Hambantota</option>
          <option value="Jaffna">යාපනය / Jaffna</option>
          <option value="Kalutara">කළුතර / Kalutara</option>
          <option value="Kandy">මහනුවර / Kandy</option>
          <option value="Kegalle">කෑගල්ල / Kegalle</option>
          <option value="Kilinochchi">කිලිනොච්චි / Kilinochchi</option>
          <option value="Kurunegala">කුරුණෑගල / Kurunegala</option>
          <option value="Mannar">මන්නාරම / Mannar</option>
          <option value="Matale">මාතලේ / Matale</option>
          <option value="Matara">මාතර / Matara</option>
          <option value="Moneragala">මොණරාගල / Moneragala</option>
          <option value="Mullaitivu">මුලතිව් / Mullaitivu</option>
          <option value="Nuwara Eliya">නුවරඑළිය / Nuwara Eliya</option>
          <option value="Polonnaruwa">පොළොන්නරුව / Polonnaruwa</option>
          <option value="Puttalam">පුත්තලම / Puttalam</option>
          <option value="Ratnapura">රත්නපුර / Ratnapura</option>
          <option value="Trincomalee">ත්‍රිකුණාමලය / Trincomalee</option>
          <option value="Vavuniya">වවුනියාව / Vavuniya</option>
        `;
      }

      const optionMatches = [...optionsHtml.matchAll(/<option value="([^"]*)"(?:[^>]*)>(.*?)<\/option>/g)];
      let customOptionsHtml = optionMatches.map(m => {
        if (m[1] === '') return ''; // skip the disabled placeholder
        return `<div class="custom-select-option" onclick="window.Funnel.saveText('${currentQ.field}', '${m[1]}'); document.getElementById('custom-select-trigger').innerHTML='${m[2]}'; document.getElementById('custom-select-modal').style.display='none'; document.getElementById('select-ok').style.display='inline-flex';">${m[2]}</div>`;
      }).join('');
      
      let triggerText = 'තෝරන්න / Select...';
      if (existing) {
        const selectedMatch = optionMatches.find(m => m[1] === existing);
        if (selectedMatch) triggerText = selectedMatch[2];
      }
      
      // Simple text version of title for the modal header
      const headerTitle = currentQ.type === 'country-select' ? 'රට තෝරන්න / Select Country' : 'දිස්ත්‍රික්කය තෝරන්න / Select District';
      
      const globalContainer = document.getElementById('global-select-container');
      if (globalContainer) {
        globalContainer.innerHTML = `
          <div id="custom-select-modal" class="custom-select-modal" style="display:none;">
            <div class="custom-select-dialog">
              <div class="custom-select-header">
                <span>${headerTitle}</span>
                <button type="button" class="quiz-close-btn" onclick="document.getElementById('custom-select-modal').style.display='none'; event.stopPropagation();" style="position:static; margin:0; width:32px; height:32px;">
                  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><line x1="18" y1="6" x2="6" y2="18"></line><line x1="6" y1="6" x2="18" y2="18"></line></svg>
                </button>
              </div>
              <div class="custom-select-body">
                ${customOptionsHtml}
              </div>
            </div>
          </div>
        `;
      }

      contentArea.innerHTML = `
        <div class="quiz-question ${isSameQ ? 'no-anim' : ''}" style="text-align: center;">
          <div style="margin-bottom: 1.5rem; font-family: var(--font-sans);">
            ${currentQ.title}
          </div>
          ${currentQ.optional ? '<p class="quiz-optional-note">අත්‍යාවශ්‍ය නොවේ &mdash; Optional</p>' : ''}
          <div class="input-wrap" style="position:relative; margin-top: 0.5rem; text-align:left;">
            <div id="custom-select-trigger" class="quiz-text-input custom-select-trigger" onclick="document.getElementById('custom-select-modal').style.display = 'flex';">
              ${triggerText}
            </div>
          </div>
          <div style="display:flex; justify-content:center; gap:1rem; margin-top:1.5rem;">
            <button class="quiz-ok-btn" id="select-ok" onclick="window.Funnel.goNext()" style="${hasSelection ? 'display:inline-flex;' : 'display:none;'}${isLastQ ? 'background:#000;color:#fff;' : ''}">${isLastQ ? 'Submit' : 'ඉදිරියට / Next'}</button>
          </div>
        </div>
      `;
      
      if (existing) {
        setTimeout(() => {
          const selectEl = contentArea.querySelector('select');
          if (selectEl) selectEl.value = existing;
        }, 10);
      }
    }
    else if (currentQ.type === 'short-text') {
      navBar.style.display = 'flex';
      const existing = state.answers[currentQ.field] || '';
      const hasText = existing.trim().length > 0;

      contentArea.innerHTML = `
        <div class="quiz-question ${isSameQ ? 'no-anim' : ''}" style="text-align: center;">
          <div style="margin-bottom: 1.5rem; font-family: var(--font-sans);">
            ${currentQ.title}
          </div>
          <input type="${currentQ.field === 'email' ? 'email' : (currentQ.field === 'phone' ? 'tel' : 'text')}" class="quiz-text-input" id="short-text-input" style="text-align: center;"
            placeholder="${currentQ.placeholder || ''}"
            value="${existing}"
            oninput="window.Funnel.saveText('${currentQ.field}', this.value)">
          <div id="short-text-error" class="cf-err" style="display:none; text-align:center; font-family:var(--font-sans); margin-top:0.5rem; font-size: 0.85rem;">
            කරුණාකර නිවැරදි දුරකථන අංකයක් ඇතුලත් කරන්න <br> <span style="font-size:0.75rem;">Please enter a valid mobile number</span>
          </div>
          <div style="display:flex; justify-content:center; gap:1rem; margin-top:1.5rem;">
            ${currentQ.optional ? `<button class="btn-skip" id="short-text-skip" onclick="window.Funnel.saveText('${currentQ.field}', ''); window.Funnel.goNext()" style="${hasText ? 'display:none;' : 'display:inline-flex;'}">මඟහරින්න / Skip</button>` : ''}
            <button class="quiz-ok-btn" id="short-text-ok" onclick="window.Funnel.goNext()" style="${hasText ? 'display:inline-flex;' : 'display:none;'}${isLastQ ? 'background:#000;color:#fff;' : ''}">${isLastQ ? 'Submit' : 'ඉදිරියට / Next'}</button>
          </div>
        </div>
      `;
    }
  },

  selectSingle: (field, value) => {
    if (state.answers[field] !== value) {
      window.Funnel.clearAnswersAfterCurrentIndex();
    }
    state.answers[field] = value;
    setTimeout(() => window.Funnel.goNext(), 220);
  },

  toggleMulti: (value, field) => {
    if (state.multiVals.includes(value)) {
      state.multiVals = state.multiVals.filter(v => v !== value);
    } else {
      state.multiVals.push(value);
    }
    window.Funnel.render();
  },

  commitMulti: (field) => {
    const currentAns = state.answers[field] || [];
    const newAns = [...state.multiVals];
    const isSame = currentAns.length === newAns.length && currentAns.every(v => newAns.includes(v));
    if (!isSame) {
      window.Funnel.clearAnswersAfterCurrentIndex();
    }
    state.answers[field] = newAns;
    state.multiVals = [];
    window.Funnel.goNext();
  },

  saveText: (field, value) => {
    state.answers[field] = value;
    const okBtn = document.getElementById('short-text-ok');
    const skipBtn = document.getElementById('short-text-skip');
    const errDiv = document.getElementById('short-text-error');
    if (errDiv) errDiv.style.display = 'none';

    if (value.trim().length > 0) {
      if (okBtn) okBtn.style.display = 'inline-flex';
      if (skipBtn) skipBtn.style.display = 'none';
    } else {
      if (okBtn) okBtn.style.display = 'none';
      if (skipBtn) skipBtn.style.display = 'inline-flex';
    }
  },

  goNext: () => {
    const activeQ = window.Funnel.getActiveQuestions();
    const currentQ = activeQ[state.qIndex];

    if (currentQ && currentQ.field === 'phone') {
      const val = (state.answers['phone'] || '').replace(/[\s\-]/g, '');
      const isNum = /^\+?\d+$/.test(val);
      if (!isNum) {
        const errDiv = document.getElementById('short-text-error');
        if (errDiv) errDiv.style.display = 'block';
        return;
      }
    }
    
    if (state.qIndex < activeQ.length - 1) {
      state.qIndex++;
      state.multiVals = [];
      window.Funnel.render();
    } else {
      state.phase = 'result';
      window.Funnel.submitToWebhook();
      state.multiVals = [];
      window.Funnel.render();
    }
  },

  goPrev: () => {
    if (state.qIndex > 0) {
      state.qIndex--;
      state.multiVals = state.answers[window.Funnel.getActiveQuestions()[state.qIndex].field] || [];
      window.Funnel.render();
    }
  },

  clearAnswersAfterCurrentIndex: () => {
    const activeQ = window.Funnel.getActiveQuestions();
    const currentQ = activeQ[state.qIndex];
    if (!currentQ) return;
    
    const globalIdx = QUIZ_QUESTIONS.findIndex(q => q.id === currentQ.id);
    if (globalIdx === -1) return;

    for (let i = globalIdx + 1; i < QUIZ_QUESTIONS.length; i++) {
      delete state.answers[QUIZ_QUESTIONS[i].field];
    }
  },

  renderResult: () => {
    const contentArea = document.getElementById('quiz-content-area');
    document.getElementById('quiz-nav').style.display = 'none';

    const firstName = (state.answers.name || 'ඔබ').split(' ')[0];
    const groupLink = "https://chat.whatsapp.com/YOUR_GROUP_LINK_HERE";

    contentArea.innerHTML = `
      <div class="quiz-result" style="display:flex; flex-direction:column; justify-content:center; min-height: 60vh;">
        <div style="display: flex; flex-direction: column; align-items: center; justify-content: center; text-align:center;">

          <h2 style="line-height: 1.4; font-size: clamp(1.2rem, 4vw, 1.5rem);">නියමයි, ${firstName}! 🎉<br><em style="font-size:clamp(0.9rem, 3vw, 1.1rem); font-style:normal; font-weight:400; color:var(--md-sys-color-primary);">Registration Successful</em></h2>
          <p class="quiz-result-message" style="margin-top: 1rem; margin-bottom: 2rem; line-height: 1.6; font-size: clamp(0.9rem, 3vw, 1rem);">
            ඔයාගේ විස්තර අපිට ලැබුණා. දැන් ඔයාට තියෙන්නේ අපේ නිල WhatsApp group එකට එකතු වෙන්න විතරයි. Workshop එකට අදාල හැම විස්තරයක්ම අපි ඒ group එකට දානවා.<br><br>
            <em>Click the button below to join the WhatsApp group!</em>
          </p>

          <a href="${groupLink}" target="_blank" class="btn btn-primary" style="display:inline-flex; align-items:center; justify-content:center; gap:0.5rem; background-color:#25D366; color:#fff; border:none; padding:1rem 2rem; border-radius:30px; text-decoration:none; font-weight:700; font-size:1.1rem; width:100%; max-width:350px;">
            <svg width="24" height="24" viewBox="0 0 24 24" fill="currentColor"><path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51a12.8 12.8 0 0 0-.57-.01c-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 0 1-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 0 1-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 0 1 2.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0 0 12.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 0 0 5.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 0 0-3.48-8.413z"/></svg>
            Join WhatsApp Group
          </a>
        </div>
      </div>
    `;
  },

  updateProgressBar: () => {
    const phaseLabelEl = document.getElementById('quiz-phase-label');
    const fill = document.getElementById('quiz-progress-fill');
    
    if (state.phase === 'result') {
      if (phaseLabelEl) phaseLabelEl.innerText = 'Complete';
      if (fill) fill.style.width = '100%';
      return;
    }

    const activeQ = window.Funnel.getActiveQuestions();
    const currentQ = activeQ[state.qIndex];
    if (!currentQ) return;

    if (phaseLabelEl) phaseLabelEl.innerHTML = currentQ.stepLabel;
    

    let percent = Math.round(((state.qIndex) / (activeQ.length)) * 100);
    if (percent < 5) percent = 5; 
    
    if (fill) fill.style.width = `${percent}%`;
  },

  submitToWebhook: async () => {
    if (!WEBHOOK_URL || WEBHOOK_URL === "") return;

    // Mapping for readable Google Sheet data
    const sitMap = {
      'learning': 'I am learning tailoring',
      'job': 'I do tailoring as a job or service',
      'tailoring-biz': 'I run a tailoring or clothing-related business',
      'other-biz': 'I run another small business',
      'planning': 'I am planning to start a business',
      'other': 'Other / not sure yet'
    };
    
    const goalMap = {
      'improve-skills': 'Improve my tailoring skills',
      'advanced-techniques': 'Learn advanced tailoring techniques',
      'start-earning': 'Start earning through tailoring',
      'grow-tailoring-biz': 'Grow my existing tailoring or clothing business',
      'grow-business-online': 'Learn how to grow a business online using the necessary digital tools and systems.'
    };

    const skillMap = {
      'beginner': 'Beginner / just starting',
      'job': 'I work in the tailoring field',
      'business': 'I already run a tailoring-related business',
      'planning-tailoring': 'I\'m planning to start a tailoring-related business soon.',
      'planning-other': 'I\'m hoping to start a different (non-tailoring) business',
      'not-decided': 'I haven\'t decided yet'
    };

    const readableSit = sitMap[state.answers.currentSituation] || state.answers.currentSituation;
    const readableSkill = skillMap[state.answers.tailoringSkill] || state.answers.tailoringSkill;
    const rawGoals = state.answers.primaryGoal || [];
    const readableGoals = rawGoals.map(g => goalMap[g] || g).join(', ');

    const payload = {
      name: state.answers.name,
      phone: state.answers.phone,
      email: state.answers.email,
      country: state.answers.country,
      district: state.answers.district,
      currentSituation: readableSit,
      primaryGoal: readableGoals,
      tailoringSkill: readableSkill
    };
    try {
      fetch(WEBHOOK_URL, { method: "POST", mode: "no-cors", body: JSON.stringify(payload) });
      console.log("Submitted to Webhook:", payload);
    } catch (err) {
      console.error("Webhook error:", err);
    }
  }
};

window.addEventListener('DOMContentLoaded', () => {
  setTimeout(() => {
    window.Funnel.openQuiz();
  }, 1000);
});
