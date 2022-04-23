<?php
$dist = __DIR__.'/../';
$src = __DIR__;

//------------------------------------------------------------//
// dist 초기화

deleteDirectory($dist.'/resource');
unlink($dist.'/index.html');
unlink($dist.'/favicon.ico');
unlink($dist.'/feature.png');
unlink($dist.'/robots.txt');
unlink($dist.'/sitemap.xml');
// deleteDirectory($dist); // root폴더가 src 상위로 삭제하면 안됨.
// mkdir($dist, 0777, true);
// exit;

//------------------------------------------------------------//
// index.html 생성

$html = file_get_contents($src.'/index.html');
//버전 관리 파일 찾기
preg_match_all("/'(.[^']*\?t={version})'/", $html, $files1);
preg_match_all('/"(.[^"]*\?t={version})"/', $html, $files2);
$files = array_merge($files1[1], $files2[1]);
// 파일 생성날짜 및 버전 수정
foreach($files as $file) {
	$f = $src.'/'.str_replace('?t={version}','',$file);
	$t = filemtime($f);
	$file_new = $file;
	if(!preg_match('/\.min\.(js|css)/',$f)) {
		$mf = preg_replace('/\.(js|css)/', '.min.$1', $f);
		if(file_exists($mf)) {
			$t = filemtime($mf);
			$file_new = preg_replace('/\.(js|css)/', '.min.$1', $file);
		}
	}
	$html = str_replace($file, str_replace('{version}',$t,$file_new), $html);
}
// {addtional_script}
$html = str_replace('<!--{addtional_script}-->', file_get_contents($src.'/addtional_script.tpl'), $html);
// minify
$html = preg_replace('/^\s+\/\/.*/m', '', $html);
$html = preg_replace('/\/\*.*\*\//', '', $html);
$html = preg_replace('/<!--.*-->/sU', '', $html);
$html = preg_replace('/\r\n|\n|\t/', '', $html);
$html = preg_replace('/\>\s+\</', '><', $html);
$html = preg_replace('/\s{4,}/', '', $html);
// gen index.html
file_put_contents($dist.'/index.html', $html);

function copy_folder($src, $dst) { 
    $dir = opendir($src); 
    @mkdir($dst); 
    while( $file = readdir($dir) ) { 
        if (( $file != '.' ) && ( $file != '..' )) { 
            if ( is_dir($src . '/' . $file) ) { 
                copy_folder($src . '/' . $file, $dst . '/' . $file); 
            } else { 
                copy($src . '/' . $file, $dst . '/' . $file); 
            } 
        } 
    } 
    closedir($dir);
} 
function deleteDirectory($dir) {
    if (!file_exists($dir)) {
        return true;
    }
    if (!is_dir($dir)) {
        return unlink($dir);
    }
    foreach (scandir($dir) as $item) {
        if ($item == '.' || $item == '..') {
            continue;
        }
        if (!deleteDirectory($dir . DIRECTORY_SEPARATOR . $item)) {
            return false;
        }
    }
    return rmdir($dir);
}
//-----------------------------------------------------------------//
// 소스 파일 복사
copy_folder($src.'/resource', $dist.'/resource');
copy($src.'/favicon.ico', $dist.'/favicon.ico');
copy($src.'/feature.png', $dist.'/feature.png');
copy($src.'/robots.txt', $dist.'/robots.txt');
copy($src.'/sitemap.xml', $dist.'/sitemap.xml');