<?php
declare(strict_types=1);

/** No Google credentials/secrets are returned to the visitor. */
function workshopProxy(array $config, string $method, string $origin, string $body, callable $transport, callable $rateLimit): array
{
    $fail = static fn(int $status, string $code): array => [$status, ['ok' => false, 'error' => ['code' => $code]]];
    if ($method !== 'POST') return $fail(405, 'POST_REQUIRED');
    $endpoint = (string)($config['apps_script_url'] ?? '');
    $secret = (string)($config['shared_secret'] ?? '');
    if (strlen($secret) < 32 || !preg_match('~^https://script\.google\.com/macros/s/[A-Za-z0-9_-]+/exec$~D', $endpoint)) return $fail(503, 'NOT_CONFIGURED');
    if (!in_array($origin, $config['allowed_origins'] ?? [], true)) return $fail(403, 'ORIGIN_NOT_ALLOWED');
    if (strlen($body) > 32768) return $fail(413, 'REQUEST_TOO_LARGE');
    try { $data = json_decode($body, true, 32, JSON_THROW_ON_ERROR); }
    catch (JsonException $e) { return $fail(400, 'INVALID_JSON'); }
    if (!is_array($data) || !in_array($data['action'] ?? null, ['start','answer','complete','enquiry','preferences','invitation_click','membership'], true)) return $fail(400, 'INVALID_ACTION');
    if (!is_string($data['request_id'] ?? null) || !preg_match('/^[a-zA-Z0-9_-]{8,100}$/D', $data['request_id'])) return $fail(400, 'INVALID_REQUEST');
    if (!$rateLimit()) return $fail(429, 'RATE_LIMITED');
    $payload = base64_encode(json_encode($data, JSON_UNESCAPED_UNICODE | JSON_THROW_ON_ERROR));
    $timestamp = time();
    $envelope = ['timestamp' => $timestamp, 'payload' => $payload, 'signature' => hash_hmac('sha256', $timestamp . "\n" . $payload, $secret)];
    try { $response = $transport($endpoint, json_encode($envelope, JSON_THROW_ON_ERROR)); }
    catch (Throwable $e) { return $fail(502, 'UPSTREAM_UNAVAILABLE'); }
    if (!is_array($response) || !is_bool($response['ok'] ?? null)) return $fail(502, 'INVALID_UPSTREAM_RESPONSE');
    if (!$response['ok']) {
        $code = $response['error']['code'] ?? 'SAVE_FAILED';
        $valid = is_string($code) && preg_match('/^[A-Z_]{2,50}$/D', $code);
        return $fail(422, $valid ? $code : 'SAVE_FAILED');
    }
    // Allowlist acknowledgements: never proxy arbitrary upstream content or rows.
    $out = ['ok' => true];
    foreach (['registration_id','session_token','status','video_id'] as $key) {
        if (array_key_exists($key, $response) && (is_string($response[$key]) || $response[$key] === null)) $out[$key] = $response[$key];
    }
    if ($data['action'] === 'start' && ($response['resumed'] ?? false) === true) {
        $choices = ['Q1'=>['START','IMPROVE','LEARN','CUSTOM','UNSURE'], 'Q2'=>['NEW','SKILL','OCCASIONAL','REGULAR','PREFER_NOT'], 'Q3'=>['RESOURCES','PRODUCT','FABRIC','PRICE','ORDERS','NOT_SURE'], 'Q4'=>['FREE','SELF','GUIDED','EXPLORE']];
        $out['resumed'] = true;
        $out['answers'] = [];
        foreach ($choices as $question => $codes) {
            $value = $response['answers'][$question] ?? null;
            if (in_array($value, $codes, true)) $out['answers'][$question] = $value;
        }
        if (in_array($response['custom_attend_workshop'] ?? null, ['YES','NO',''], true)) $out['custom_attend_workshop'] = $response['custom_attend_workshop'];
    }
    return [200, $out];
}

function workshopGoogleTransport(string $endpoint, string $body): array
{
    if (!function_exists('curl_init')) throw new RuntimeException('CURL_REQUIRED');
    $curl = curl_init($endpoint);
    curl_setopt_array($curl, [CURLOPT_POST => true, CURLOPT_POSTFIELDS => $body,
        CURLOPT_HTTPHEADER => ['Content-Type: application/json'], CURLOPT_RETURNTRANSFER => true,
        CURLOPT_FOLLOWLOCATION => true, CURLOPT_MAXREDIRS => 3,
        CURLOPT_PROTOCOLS => CURLPROTO_HTTPS, CURLOPT_REDIR_PROTOCOLS => CURLPROTO_HTTPS,
        CURLOPT_CONNECTTIMEOUT => 8, CURLOPT_TIMEOUT => 40]);
    $text = curl_exec($curl); $http = curl_getinfo($curl, CURLINFO_RESPONSE_CODE); curl_close($curl);
    if ($text === false || $http < 200 || $http >= 300 || strlen($text) > 32768) throw new RuntimeException('UPSTREAM_UNAVAILABLE');
    $result = json_decode($text, true, 32, JSON_THROW_ON_ERROR);
    if (!is_array($result)) throw new RuntimeException('INVALID_UPSTREAM_RESPONSE');
    return $result;
}

/** Local files contain only a salted IP hash, time window and request count. */
function workshopRateLimit(string $directory, string $secret, string $ip): bool
{
    $path = $directory . '/rate-limits.json';
    $file = fopen($path, 'c+');
    if ($file === false) throw new RuntimeException('STORAGE_UNAVAILABLE');
    try {
        if (!flock($file, LOCK_EX)) throw new RuntimeException('STORAGE_UNAVAILABLE');
        $all = json_decode(stream_get_contents($file), true) ?: []; $now = time();
        foreach ($all as $key => $value) if (($value['until'] ?? 0) <= $now) unset($all[$key]);
        $key = hash_hmac('sha256', $ip, $secret);
        $entry = $all[$key] ?? ['until' => $now + 60, 'count' => 0];
        if ($entry['count'] >= 90) return false;
        $entry['count']++; $all[$key] = $entry;
        rewind($file); ftruncate($file, 0); fwrite($file, json_encode($all, JSON_THROW_ON_ERROR)); fflush($file);
        @chmod($path, 0600);
        return true;
    } finally { flock($file, LOCK_UN); fclose($file); }
}
