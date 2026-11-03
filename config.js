// One source of truth. Change mode only after deploying the acknowledged save API.
window.WORKSHOP_CONFIG = {
  mode: 'preview',
  event_id: 'SU-FW-02-2026-11-14',
  endpoint: 'api/register.php',
  requestTimeoutMs: 55000,
  event: {
    date: '2026-11-14',
    dateLabel: '2026 නොවැම්බර් 14',
    timeStatus: 'pending',
    timeLabel: '',
    timezone: 'Asia/Colombo'
  },
  communityUrl: '',
  helpUrl: '',
  privacyUrl: '',
  quizVersion: 'quiz-v1',
  consentVersion: 'workshop-consent-v1',
  copyVersion: 'si-2026-11-v1',
  // Intro video shown (autoplay, muted) right after the details are saved.
  introVideo: { src: '', poster: '', captions: '' },
  videos: {
    V1: { src: '', poster: '', captions: '' },
    V2: { src: '', poster: '', captions: '' },
    V3: { src: '', poster: '', captions: '' },
    V4: { src: '', poster: '', captions: '' },
    V5: { src: '', poster: '', captions: '' }
  }
};
