<?php
declare(strict_types=1);
require __DIR__ . '/lib/proxy.php';
header('Content-Type: application/json; charset=utf-8');
header('Cache-Control: no-store');
header('X-Content-Type-Options: nosniff');
// Hostinger layout: domain/public_html/api/register.php and domain/workshop-private/config.php.
$private = getenv('WORKSHOP_PRIVATE_DIR') ?: dirname(__DIR__, 2) . '/workshop-private';
$configPath = $private . '/config.php';
try {
    if (!is_file($configPath)) {
        $result = [503, ['ok'=>false,'error'=>['code'=>'NOT_CONFIGURED']]];
    } else {
        $config = require $configPath;
        if (!is_array($config)) throw new RuntimeException('NOT_CONFIGURED');
        $result = workshopProxy($config, $_SERVER['REQUEST_METHOD'] ?? '', $_SERVER['HTTP_ORIGIN'] ?? '',
            file_get_contents('php://input', false, null, 0, 32769) ?: '', 'workshopGoogleTransport',
            static fn(): bool => workshopRateLimit($private, $config['shared_secret'] ?? '', $_SERVER['REMOTE_ADDR'] ?? 'unknown'));
    }
} catch (Throwable $e) { $result = [503, ['ok'=>false,'error'=>['code'=>'SERVICE_UNAVAILABLE']]]; }
http_response_code($result[0]);
if ($result[0] === 405) header('Allow: POST');
if ($result[0] === 429) header('Retry-After: 60');
echo json_encode($result[1], JSON_UNESCAPED_UNICODE);
