<?php
declare(strict_types=1);
require __DIR__.'/../api/lib/proxy.php';
function check(bool $ok, string $message): void {if(!$ok)throw new RuntimeException($message);}
$c=['apps_script_url'=>'https://script.google.com/macros/s/test-deployment/exec','shared_secret'=>str_repeat('a',64),'allowed_origins'=>['https://workshop.example.test']];
$body=json_encode(['action'=>'start','request_id'=>'request-test-123']);
$transport=static function($url,$body)use($c){$e=json_decode($body,true);check(hash_equals(hash_hmac('sha256',$e['timestamp']."\n".$e['payload'],$c['shared_secret']),$e['signature']),'HMAC');check(json_decode(base64_decode($e['payload']),true)['action']==='start','payload');return ['ok'=>true,'registration_id'=>'test-registration','session_token'=>'test-session','status'=>'started','private_sheet_rows'=>['must-not-leak']];};
$r=workshopProxy($c,'POST','https://workshop.example.test',$body,$transport,fn()=>true);check($r[0]===200 && $r[1]['status']==='started','success');check(!isset($r[1]['private_sheet_rows']),'response allowlist');
$resume=workshopProxy($c,'POST','https://workshop.example.test',$body,fn()=>['ok'=>true,'resumed'=>true,'answers'=>['Q1'=>'START','Q2'=>'SKILL','Q3'=>'INVALID','private'=>'secret'],'custom_attend_workshop'=>'YES','private_sheet_rows'=>['secret']],fn()=>true);
check($resume[1]['resumed']===true && $resume[1]['answers']===['Q1'=>'START','Q2'=>'SKILL'] && $resume[1]['custom_attend_workshop']==='YES','resume fields survive proxy with validated answers');
check(!isset($resume[1]['private_sheet_rows']),'resume does not expose arbitrary rows');
check(workshopProxy($c,'GET','https://workshop.example.test',$body,$transport,fn()=>true)[0]===405,'method');
check(workshopProxy($c,'POST','https://wrong.example.test',$body,$transport,fn()=>true)[0]===403,'origin');
check(workshopProxy($c,'POST','https://workshop.example.test',$body,$transport,fn()=>false)[0]===429,'rate');
check(workshopProxy($c,'POST','https://workshop.example.test','{bad',$transport,fn()=>true)[0]===400,'json');
check(workshopProxy($c,'POST','https://workshop.example.test',str_repeat('x',32769),$transport,fn()=>true)[0]===413,'size');
check(workshopProxy([],'POST','https://workshop.example.test',$body,$transport,fn()=>true)[0]===503,'unconfigured');
check(workshopProxy($c,'POST','https://workshop.example.test',$body,fn()=>['ok'=>false,'error'=>['code'=>'INVALID_ANSWER']],fn()=>true)[0]===422,'upstream rejection');
check(workshopProxy($c,'POST','https://workshop.example.test',$body,fn()=>['not'=>'json contract'],fn()=>true)[0]===502,'bad upstream');
check(workshopProxy($c,'POST','https://workshop.example.test',$body,fn()=>throw new RuntimeException('private secret detail'),fn()=>true)[0]===502,'upstream failure');
$d=sys_get_temp_dir().'/workshop-rate-test-'.bin2hex(random_bytes(5));mkdir($d,0700);
try{for($i=0;$i<90;$i++)check(workshopRateLimit($d,$c['shared_secret'],'127.0.0.1'),'limit allowed');check(!workshopRateLimit($d,$c['shared_secret'],'127.0.0.1'),'limit blocked');$contents=file_get_contents($d.'/rate-limits.json');check(!str_contains($contents,'127.0.0.1'),'no plain IP');}finally{@unlink($d.'/rate-limits.json');@rmdir($d);}
echo "PASS: proxy signing, acknowledgements, failure handling, origin/method/body gates and private rate limiter.\n";
