<?php
// Copy to workshop-private/config.php OUTSIDE public_html. Never commit a filled copy.
return [
    'apps_script_url' => '', // Exact deployed https://script.google.com/macros/s/.../exec URL.
    'shared_secret' => '', // At least 32 random bytes, encoded as hex; same as SHARED_SECRET in Apps Script.
    'allowed_origins' => ['https://YOUR-WORKSHOP-DOMAIN'], // Exact origin, no trailing slash/path.
];
