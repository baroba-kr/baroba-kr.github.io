(function($) {
    var items = [], movies = {}, islogin = false,
        runmode = window.location.host ? 'web' : process.versions['electron'] ? 'pc' : 'mobile',
        host = window.location.host ? '//'+window.location.host : '//www.baroba.kr',
        api_url = (host.replace('www.','').replace('//','//api.')),
        key_request_api = '',
        request_api = function() {
            key_request_api = setTimeout(request_api, 300);
            if (items && items.length > 0) {
                $.post(api_url+'/request/?', { 'item': JSON.stringify(items) }, function(r) {
                    for (i in r.payload) {
                        var tr = r.payload[i],
                            callback = 'cb_' + tr.method;
                        if (window[callback]) { window[callback]($.parseJSON(tr.data)); }
                    }
                }, 'json'); 
                items = [];
                '';;;
            }
        },
        add_request_item = function(method_name, params, callback) {
            var item = {
                    "method": method_name,
                    "params": params
                },
                cb = 'cb_' + method_name;
            for(i in items) {
                if(items[i].method==method_name) { return ;}
            }
            items.push(item);
            window[cb] = callback;
        },
        get_hash = function() {
            const h = decodeURIComponent(window.location.hash)+'';
            return h ? h.substr(1) : '';
        },
        // getCookie = function (c_name) {
        //     var i,x,y,ARRcookies=document.cookie.split(";");
        //     for (i=0;i<ARRcookies.length;i++)
        //     {
        //         x=ARRcookies[i].substr(0,ARRcookies[i].indexOf("="));
        //         y=ARRcookies[i].substr(ARRcookies[i].indexOf("=")+1);
        //         x=x.replace(/^\s+|\s+$/g,"");
        //         if (x === c_name) {
        //             return unescape(y);
        //         }
        //     }
        // },
        // setCookie = function (c_name,value,exdays){
        //     var exdate=new Date();
        //     exdate.setDate(exdate.getDate() + exdays);
        //     var c_value=escape(value) + ((exdays==null) ? "" : "; expires="+exdate.toUTCString());
        //     document.cookie=c_name + "=" + c_value;
        // },
        extractHostname = function(url) {
            var hostname;
            if (url.indexOf("//") > -1) {
                hostname = url.split('/')[2];
            } else {
                hostname = url.split('/')[0];
            }
            hostname = hostname.split(':')[0];
            hostname = hostname.split('?')[0];
            return hostname;
        },
        extractRootDomain = function(url) {
            var domain = extractHostname(url),
                splitArr = domain.split('.'),
                arrLen = splitArr.length;
            if (arrLen > 2) {
                domain = splitArr[arrLen - 2] + '.' + splitArr[arrLen - 1];
                if (splitArr[arrLen - 2].length == 2 && splitArr[arrLen - 1].length == 2) {
                    domain = splitArr[arrLen - 3] + '.' + domain;
                }
            }
            domain = domain.split('.');
            return domain[0];
        },
        login = function(){
            add_request_item('login', { 'userid': $('[name=userid]').val(), 'userpw': $('[name=userpw]').val()}, function(r){
                if(r && r.success && r.payload) {
                    $('[name=btn-login],[name=btn-join]').addClass('d-none');
                    $('[name=btn-logout]').removeClass('d-none');
                    sessionStorage.delete_movie = r.payload.delete_movie;
                    location.href = '#';
                } else {
                    var msg = r.error && r.error.message ? r.error.message : '로그인 정보가 올바른지 확인해주세요.';
                    alert(msg);
                }
            });
            return false;
        },
        addparser = function(){
            add_request_item('addParser', { 'url': $('[name=url]').val(), 'category': $('[name=category]').val(), 'active': $('[name=active]').val(), 'free': $('[name=free]').val(), 'adult': $('[name=adult]').val(), 'interval': $('[name=interval]').val(), 'site_no': $('[name=site_no]').val(), 'interval': $('[name=interval]').val(), 'ordinal': $('[name=ordinal]').val()}, function(r){
                if(r && r.success && r.payload) {
                    $('[name=btn-login],[name=btn-join]').addClass('d-none');
                    $('[name=btn-logout]').removeClass('d-none');
                    sessionStorage.delete_movie = r.payload.delete_movie;
                    location.href = '#';
                } else {
                    var msg = r.error && r.error.message ? r.error.message : '로그인 정보가 올바른지 확인해주세요.';
                    alert(msg);
                }
            });
            return false;
        },
        /**
         * get url parameter value
         * @param String sParam Parameter Name
         */
        getURLParameter = function (sParam) {
            var sPageURL = window.location.search.substring(1);
            var sURLVariables = sPageURL.split('&');
            let v = '';
            sParam = (sParam+'').trim();
            if(!sParam) return v;
            sParam += '=';
            for (var i=0; i < sURLVariables.length; i++){
                let param = sURLVariables[i];
                let p = param.indexOf(sParam);
                if(p>-1) {
                    v = param.substr(p + sParam.length);
                    break;
                }
            }
            return v;
        },
        /**
         * url parameter에 값을 설정
         * @param {string} sParam 파라메터 이름. 예: page
         * @param {string} sValue 파라메터 값. 예: 1
         * @param {string} sUrl URL문자열 또는 Query String($_SERVER['QUERY_STRING']) . 예: http://loc.stube.co.kr/message.php
         * @returns {string} 값이 추가/변경된 $url. 예: http://loc.stube.co.kr/message.php?&page=1
         */
         setURLParameter =function (sParam, sValue, sUrl) {
            let sPageURL = sUrl||window.location.search;
            let length = sPageURL.indexOf('?')>-1 ? sPageURL.substring(sPageURL.indexOf('?')+1).length : sPageURL.length;
            let split_url = sPageURL.split('?',2);
            if(sPageURL.indexOf(sParam+'=')>-1) {
                sPageURL = sPageURL.replace(new RegExp(sParam+'=(.[^&]*)?(&|)', 'g'), sParam+'='+sValue+'$2', sPageURL)
            } else {
                if(split_url[1]) {
                    sPageURL = sPageURL+'&'+sParam+'='+sValue;
                } else {
                    sPageURL = split_url[0]+'?'+sParam+'='+sValue;
                }
            }
            return sPageURL;
        },
        cnt_request_movie = 40;
    request_api();
    sessionStorage.delete_movie = sessionStorage.delete_movie ? sessionStorage.delete_movie : 'N';
    $(window).blur(function() {
        key_request_api = clearTimeout(key_request_api);
    });
    $(window).focus(function() {
        if (!key_request_api) {
            request_api();
        }
    });

    // poster box resize
    var cw = 0,
        set_poster_box_size = function() {
            var w = $('[name=poster_box]:last').width(),
                h = w * 9 / 16,
                t = 200;
            if (w > 0 && cw != w) {
                cw = w;
                var poster_box_style = '[name=poster_box]{height:' + h + 'px;}';
                var $style_box = $('style[name=poster_box_style]');
                if ($style_box.length > 0) {
                    $style_box.empty().append(poster_box_style);
                } else {
                    $('head').append('<style name="poster_box_style">' + poster_box_style + '</style>');
                }
            } else {
                t = 1000;
            }
            setTimeout(function() { set_poster_box_size() }, t);
        }

	var first_hash_request = true,
        genMovieHtml = function (list) {
            var tpl = '<div name="item" data-movie="{movieurl}" data-movieno="{movieno}" data-time="{time}" class="item">\
            <!-- <a href="#" class="poster_box_link"><div name="poster_box" style="background-image:url(resource/image/no-img.png);display:block" data-src="{posterurl}" class=" btn m-0 p-0 blazyload"></div></a>-->\
            <a href="#" class="poster_box_link"><div name="poster_box" style="background-image:url({posterurl});display:block" data-src="{posterurl}" class=" btn m-0 p-0 "></div></a>\
            <p name="ctrl">\
                <span class="text-muted">\
                    {root_domain} \
                    {date}\
                </span>\
                <span name="icon" class="float-right">\
                    <a href="#" name="{like_name}"><i class="{like_class} fa-heart d-none"></i></a>&nbsp;\
                    <a href="#" name="delete" class="{hide_delete_btn}"><i class="fas fa-trash-alt"></i></a>\
                    <a href="#" name="share"><i class="fas fa-share-alt d-none"></i></a>&nbsp;\
                    <a href="#" name="close" class="d-none"><i class="fas fa-times"></i></a>&nbsp;\
                </span>\
            </p>\
            <p name="title">\
                {title} \
            </p>\
        </div>',
            //<img name="poster" src="" data-src="{posterurl}" width="100%" height="" class="blazyload">
            // <a href="#"><i name="unlike" class="far fa-heart"></i></a>&nbsp;<a href="#"><i name="delete" class="fas fa-trash-alt"></i></a>
            html = [],
            myLike = localStorage.getItem('like');
            for (i in list) {
                var movie = list[i],
                    last_time = movie.time,
                    t = new Date(last_time * 1000),
                    M = t.getMonth() + 1,
                    d = t.getDate() < 10 ? '0' + t.getDate() : t.getDate(),
                    H = t.getHours() < 10 ? '0' + t.getHours() : t.getHours(),
                    m = t.getMinutes() < 10 ? '0' + t.getMinutes() : t.getMinutes(),
                    date = M + '.' + d + ' ' + H + ':' + m,
                    poster = movie.poster ? movie.poster : 'resource/image/no-img.png',
                    liked = myLike ? myLike.indexOf(movie.movie_no) : -1,
                    like_name = liked < 0 ? 'unlike' : 'like',
                    like_class = liked < 0 ? 'far' : 'fas';
                if(typeof movies[movie.movie_no] != typeof undefined) { continue; }
                html.push(
                    tpl.replace(/{posterurl}/g, poster).replace(/{movieurl}/g, movie.url).replace(/{time}/g, movie.time).replace(/{movieno}/g, movie.movie_no).replace(/{title}/g, movie.title).replace(/{date}/g, date).replace(/{root_domain}/g, extractRootDomain(movie.url).toUpperCase()).replace(/{like_name}/g, like_name).replace(/{like_class}/g, like_class).replace('{hide_delete_btn}', sessionStorage.delete_movie=='Y' ? '' : 'd-none') //.replace(/{height}/g,height)
                );
                movies[movie.movie_no] = true;
                setTimeout(function(){check_last_movie();}, 1000);
            }
            return html;
		},
		$first_movie = null, // 태그별 첫번째 동영상을 임시로 담는 변수
        callbackMovieList = function(r) {
            if (!r || !r.success) { return; }
            var cnt_item = $('[name=item]').length;
            $('#searching').addClass('d-none'); // 검색중입니다. 종료./
            if (!r.payload || r.payload && r.payload.length < 1) {
                $('#btn-more').addClass('d-none');
                if ($('[name=item]').length < 1) { //검색 결과가 없습니다.
                    $('#empty-result').removeClass('d-none');
                }
                // return;
            }
            $('#empty-result').addClass('d-none'); // 결과가 있으면 없습니다.문구 숨김.
            var $list = $('#list'), html = genMovieHtml(r.payload);
            $list.append(html.join(''))
            // .find('[name=item]').each(function(){
            // $(this).height( $(this).width() * 9 / 16 );
            // });
            // setbLazyLoadData();
			set_poster_box_size();

            // 태그별 첫 조회시 이전페이지도 조회
			if(first_hash_request) {
                first_hash_request = false;
                // setTimeout(function(){
                    search_date = getURLParameter('date');
                    $first_movie = $('[name=item]:eq(0)');
                    add_request_item('getMovieList', { 'c': get_hash(), 'cnt': cnt_request_movie, 'time': $first_movie.attr('data-time'), 'date':search_date, 'direction':'back' }, callbackMovieListBack);
                // }, 500);
			} else {
				$first_movie = null;
			}

            if(sessionStorage.delete_movie=='Y') {
                $('[name=delete].d-none').removeClass('d-none');
            }

            if (r.payload && r.payload.length < cnt_request_movie) {
                $('#btn-more').addClass('d-none');
            } else {
                $('#btn-more').removeClass('d-none').attr('data-time', $('[name=item]:last').attr('data-time'));
            }
            
            if(cnt_item<1) {
                $(window).scrollTop(0);
                checkLastMovie = checkLastMovie;
                setTimeout(function(){
                    checkLastMovie = false;
                    // $(window).scrollTop(0);
                    checkLastMovie = true;
                }, 1000);
            }
            getMore = true;
        },
        callbackMovieListBack = function(r) {
            if (!r || !r.success) { $first_movie = null; return; }
            // $('#searching').addClass('d-none'); // 검색중입니다. 종료./
            if (!r.payload || r.payload && r.payload.length < 1) {
                // $('#btn-more').addClass('d-none');
                // if ($('[name=item]').length < 1) { //검색 결과가 없습니다.
                //     $('#empty-result').removeClass('d-none');
                // }
                return;
            }
            // $('#empty-result').addClass('d-none'); // 결과가 있으면 없습니다.문구 숨김.
            var $list = $('#list'), html = genMovieHtml(r.payload);
            $list.prepend(html.join(''));
            // setbLazyLoadData();
			set_poster_box_size();

            if(sessionStorage.delete_movie=='Y') {
                $('[name=delete].d-none').removeClass('d-none');
            }

			// 태그별 첫번째 목록 데이터 로딩시 이전데이터도 함깨 로딩하는데 그럴경우 최상단으로 이동하지 않도록 포지션을 유지시킴.
			if($first_movie) {
				$(window).scrollTop($first_movie.offset().top-70);
				$first_movie = null;
			}
			
            // if (r.payload && r.payload.length < cnt_request_movie) {
            //     $('#btn-more').addClass('d-none');
            // } else {
            //     $('#btn-more').removeClass('d-none').attr('data-time', $('[name=item]:last').attr('data-time'));
            // }
            getBackMore = true;
        }
    var emptyMovieList = function() {
        $('#list').empty();
        movies = {};
	}
	var add_tab = (keyword, save) => {
		console.log(keyword, $('footer a[href="#'+keyword+'"]').length, $('footer a[href="#'+keyword+'"]').length < 1)
		if($('footer a[href="#'+keyword+'"]').length < 1 ) {
			if(save) {
				tabKeywords.push(keyword);
				tabKeywords = tabKeywords.filter((v, i, a) => a.indexOf(v) === i&&v)
				localStorage.setItem('tabKeywords', tabKeywords);
			}
			$('footer > div').append('<a href="#'+keyword+'"><div>'+keyword+'</div></a>')
		}
	}
	var tabKeywords = (localStorage.getItem('tabKeywords')||'').split(',');
	$('footer > div > *').each(function(){
		tabKeywords.push($(this).attr('href').replace('#',''));
	})
	tabKeywords = tabKeywords.filter((v, i, a) => a.indexOf(v) === i&&v)
	console.log(tabKeywords);
	for(i in tabKeywords) {
		add_tab(tabKeywords[i]);
	}

    var reset_hashes = {}; // 웹페이지 접속시 초기 로딩하면서 오래전 마지막으로 본 동영상시간은 초기화합니다.
    var add_request_getMovieList = function(){
        // var hash = get_hash();
        // if(hash!='login'&&hash!='join') {
        //     add_request_item('getMovieList', { 'c': hash, 'cnt': cnt_request_movie }, callbackMovieList);
        // }
        $(document).focus(); // request를 작동시키려면 focus되어야 한다.
        var hash = get_hash();
        $('.board').addClass('d-none');
        switch (hash) {
            case 'login': 
                $('[name=login]').removeClass('d-none');
            break;
            case 'logout': 
                add_request_item('logout', {}, function(){
                    sessionStorage.delete_movie = 'N';
                    $('[name=btn-login],[name=btn-join]').removeClass('d-none');
                    $('[name=btn-logout]').addClass('d-none');
                    window.location.href='#';
                });
            break;
            case 'join': 
                $('[name=join]').removeClass('d-none');
            break;
            case 'addparser': 
                if(islogin) {$('[name=addparser]').removeClass('d-none');}
            break;
            default :
                emptyMovieList();
                // document.title=(document.title.replace(/\#.*/,''))+'#'+hash;
                if(hash) { 
                    let t = document.title + '';
                    t = t.indexOf(' - ')>-1 ? t.substring(0, t.indexOf(' - ')) : t;
                    document.title = t + ' - '+hash; // 제목테그 단순화
                }
                $('#searching').removeClass('d-none'); // 검색중입니다. 종료./
                $('[name=main]').removeClass('d-none');
                $('#btn-more').addClass('d-none');
                lastMovieTime = localStorage[hash];
                // lastMovieTime = localStorage.getItem('lastMovieTime');
                // lastMovieTime = lastMovieTime ? JSON.parse(lastMovieTime) : {};
                if(lastMovieTime) { // 해시값에 마지막동영상시간이 있을때
                    if(!reset_hashes[hash]) {
                        reset_hashes[hash] = true; // 
                        // 3일 지난 시간은 지워서 초기화합니다.
                        if(lastMovieTime < Math.floor(new Date().getTime()/1000) + 60*60*24*1 ) {
                            lastMovieTime = false;
                        }
                    }
                }
                if(!lastMovieTime) {  // 해시값에 마지막동영상시간이 없으면 6시 이전에는 어제0시를 6시 이후에는 오늘 0시를 시작시간으로 사용합니다.
                    let t = new Date(),
                        d = t.getHours()<6 ? new Date(t.getFullYear(), t.getMonth(), t.getDate()-1, 0,0,0,0) : new Date(t.getFullYear(), t.getMonth(), t.getDate(), 0,0,0,0);
                    lastMovieTime = Math.floor(d.getTime()/1000);
                    localStorage.setItem(hash, lastMovieTime);
                } else {
                }
                search_date = getURLParameter('date');
                console.log('search_date:', search_date);
                // return;
				add_request_item('getMovieList', { 'c': hash, 'cnt': cnt_request_movie, 'time':lastMovieTime, 'date':search_date }, callbackMovieList);
				add_tab(hash, true);
            break;
        }
    }
    // check login
    add_request_item('isLogin', {}, function(r){
        if(r && r.success && r.payload) {
            islogin = r.payload;
            $('[name=btn-login],[name=btn-join]').addClass('d-none');
            $('[name=btn-logout]').removeClass('d-none');
        } else {
            $('[name=btn-login],[name=btn-join]').removeClass('d-none');
            $('[name=btn-logout]').addClass('d-none');
        }
    });

    // more
    var getMore = true, getBackMore = true, topSpace = 1000, bottomSpace = 800, 
        check_top = function() { // 화면 상단 확인. 이전 동영상 가져오기
            // console.log('check_top start'); 
            if($(window).scrollTop()<=topSpace && getBackMore) {
                search_date = getURLParameter('date');
                getBackMore = false;
                // console.log({ 'time': $('[name=item]:eq(0)').attr('data-time'), 'c': get_hash(), 'cnt': cnt_request_movie, 'direction':'back' });
                add_request_item('getMovieList', { 'c': get_hash(), 'cnt': cnt_request_movie, 'time': $('[name=item]:eq(0)').attr('data-time'), 'date':search_date, 'direction':'back' }, callbackMovieListBack);
            }
        }, 
        check_bottom = function() { // 화면 하단 확인. 다음 동영상 가져오기
            // console.log('check_bottom start');
            if($(window).scrollTop() + $(window).height() >= $(document).height() - bottomSpace && $('#btn-more').is(':visible') && getMore ) {
                $('#btn-more').click();
            }
        }, 
        checkLastMovie = true,
        check_last_movie = function() {
            // console.log('checkLastMovie:',checkLastMovie);
            if(!checkLastMovie) {return;}
            var $window = $(window), 
                $item = $('[name=item]'),
                cnt = Math.floor($window.width()/$item.width()), cnt = cnt > 5 ? 5 : cnt, no = Math.floor($window.scrollTop() / ($item.height()+20)) * cnt, 
                last_movie_time = $item.eq(no).attr('data-time'),
                // lastMovieTime = localStorage.getItem('lastMovieTime'), lastMovieTime = lastMovieTime ? JSON.parse(lastMovieTime) : {},
                // lastMovieTime = {},
                hash = get_hash(), hash = hash ? hash : ''
            ;
            // console.log(cnt, $window.scrollTop(), $item.height(), no);
            // if(last_movie_time) {lastMovieTime[hash] = last_movie_time;}
            // localStorage.setItem('lastMovieTime', JSON.stringify(lastMovieTime));
            if(last_movie_time) {localStorage.setItem(hash, last_movie_time);}
        },
        get_more_movie = function() {
            getMore = false;
            // add_request_getMovieList();
            add_request_item('getMovieList', { 'time': $('[name=item]:last').attr('data-time'), 'c': get_hash(), 'cnt': cnt_request_movie }, callbackMovieList);
        }
        ;
	// get recently movie
    add_request_getMovieList();
    window.addEventListener("hashchange",function(event){
		first_hash_request = true;
        add_request_getMovieList();
    });

    var position_y = 0;

    var play_video = function(obj) {
        getBackMore = false;getMore = false;
        var window_width = $(window).outerWidth(),
            $item = $(obj).parents('[name=item]'),
            movie_url = $item.attr('data-movie'),
            movie_url = window.location.href.indexOf('https://')>-1 && movie_url.indexOf('mgoon.com')>-1 ? movie_url.replace('http://', 'https://') : movie_url,
            movie_no = $item.attr('data-movieno'),
            type = movie_url.match(/\.gif/i) ? 'image' : 'video',
            $ctrl = $item.find('[name=ctrl]'),
            $title = $item.find('[name=title]'),
            $iframe = type == 'image' ? $('<img class=" arve-iframe fitvidsignore" name="movie" src="' + movie_url + '" width="100%" height="auto">') : $('<iframe class="popup_movie arve-iframe fitvidsignore" frameborder="0" name="movie" scrolling="no" src="' + movie_url + '" width="100%" height="auto" allow="accelerometer; autoplay; encrypted-media; gyroscope; picture-in-picture; fullscreen" allowfullscreen></iframe>');

            // console.log(obj, $item.get(0), window_width );
        // if(window_width<=630) {// replace
        //     $(obj).append($iframe);
        //     $iframe.height($iframe.width() * 9 / 16);
        //     $item.siblings().find('[name=movie]').each(function(i) {
        //         $(obj).remove();
        //     });
        // } else {// popup
            $('.popup_movie').remove();
            $('.preloader').removeClass('d-none');// loading start
            $('[name=movie_area]').html($iframe);
            $('[name=ctrlbox]').html($ctrl.html()).find('[name=close]').removeClass('d-none');
            $('[name=titlebox]').html($title.html());
            position_y = $(document).scrollTop();$('main').height('auto').css({'overflow':'auto'}); //,'margin-top':'0'
            // console.log('position_y:', position_y);
            $('main').height($(window).innerHeight() - 56 - 20 + position_y).css({'overflow':'hidden','margin-top':position_y * -1});
            // $('main').css({'overflow':'hidden','margin-top':position_y * -1});
            $('.popup_bg').removeClass('d-none');
        // }

        if (type == 'video') {
            $iframe.height($iframe.width() * 9 / 16);
        }
        $iframe.on('load', function(){
            $('.preloader').addClass('d-none');// loading end
            // auto play, auto skip ads
            if(runmode!='web'){
                var t = 200;
                        
                // naver.com 
                if(movie_url.indexOf('naver.com')>-1) {
                    // auto play
                    var skip_ad = function(t){
                            if($iframe.contents().find('.u_rmc_btn_skip').length>0) {
                                $iframe.contents().find('.u_rmc_btn_skip').click();
                                window._autoplay = setTimeout(function(){skip_ad(t)}, t);
                            } else {
                                clearTimeout(window._autoplay);
                            }
                        },
                        check_play = function(t){
                        if($iframe.contents().find('.u_rmc_navertv_ic').length>0) {
                            $iframe.contents().find('.u_rmc_navertv_ic').click();
                            skip_ad(t);
                        } else {
                            window._autoplay = setTimeout(function(){check_play(t)}, t);
                        }
                    }
                    window._autoplay = setTimeout(function(){check_play(t);}, t); 
                }
                // streamango.com 
                else if(movie_url.indexOf('streamango.com')>-1) {
                    // auto play
                    var check_play = function(t){
                        if($iframe.contents().find('.vjs-big-play-button').length>0) {
                            $iframe.contents().find('.vjs-big-play-button').click();
                            clearTimeout(window._autoplay);
                        } else {
                            window._autoplay = setTimeout(function(){check_play(t)}, t);
                        }
                    }
                    window._autoplay = setTimeout(function(){check_play(t);}, t); 
                }
                // dailymotion.com 
                else if(movie_url.indexOf('dailymotion.com')>-1) {
                    // auto play
                    var check_play = function(t){
                        if($iframe.contents().find('.np_ButtonPlayback').length>0) {
                            $iframe.contents().find('.np_ButtonPlayback').click();
                            clearTimeout(window._autoplay);
                        } else {
                            window._autoplay = setTimeout(function(){check_play(t)}, t);
                        }
                    }
                    window._autoplay = setTimeout(function(){check_play(t);}, t); 
                }
                // youtube.com 
                else if(movie_url.indexOf('youtube.com')>-1) {
                    // auto play
                    var check_play = function(t){
                        if($iframe.contents().find('.ytp-large-play-button').length>0) {
                            $iframe.contents().find('.ytp-large-play-button').click();
                            clearTimeout(window._autoplay);
                        } else {
                            window._autoplay = setTimeout(function(){check_play(t)}, t);
                        }
                    }
                    window._autoplay = setTimeout(function(){check_play(t);}, t); 
                }
                else {
                    // auto play
                    var check_play = function(t){
                        if($iframe.contents().find('button').length>0) {
                            $iframe.contents().find('button').click();
                            clearTimeout(window._autoplay);
                        } else {
                            window._autoplay = setTimeout(function(){check_play(t)}, t);
                        }
                    }
                    window._autoplay = setTimeout(function(){check_play(t);}, t); 
                }
            }
        });
        add_request_item('playMovie', { 'n': movie_no });
    };

    $('body')
    // play
    .on('click', '[name=poster_box]', function(e){
        e.preventDefault();
        e.stopPropagation();
        play_video(this);
        return false;
    })
    // unlike -> like
    .on('click', '[name=unlike]', function(e) {
        e.preventDefault();
        e.stopPropagation();
        var $item = $(this).parents('[name=item]'),
            movie_no = $item.attr('data-movieno');
        if (movie_no) {
            var myLike = localStorage.getItem('like');
            myLike = myLike ? JSON.parse(myLike) : [];
            myLike.push(movie_no);
            localStorage.setItem('like', JSON.stringify(myLike));
            $(this).attr('name', 'like').find('i').removeClass('far').addClass('fas');
            add_request_item('likeMovie', { 'n': movie_no });
        }
        return false;
    })
    // like -> unlike
    .on('click', '[name=like]', function(e) {
        e.preventDefault();
        e.stopPropagation();
        var $item = $(this).parents('[name=item]'),
            movie_no = $item.attr('data-movieno');
        if (movie_no) {
            var myLike = localStorage.getItem('like'),
                myLike = myLike ? JSON.parse(myLike) : [],
                index = myLike.indexOf(movie_no);
            if (index > -1) { myLike.splice(index, 1); }
            localStorage.setItem('like', JSON.stringify(myLike));
            $(this).attr('name', 'unlike').find('i').removeClass('fas').addClass('far');
            add_request_item('unlikeMovie', { 'n': movie_no });
        }
        return false;
    })
    // delete
    .on('click', '[name=delete]', function(e) {
        e.preventDefault();
        e.stopPropagation();
        var $item = $(this).parents('[name=item]'),
            movie_no = $item.attr('data-movieno');
        if (movie_no) {
            $item.hide();
            add_request_item('deleteMovie', { 'n': movie_no, 'c': get_hash() }, function(r) {
                if (!r || !r.success) { $item.show(); return; }
                if (r.payload) { $item.hide(); }
            });
        }
        return false;
    }).on('click', '[name=close], .popup_bg', function(e) {
        getMore = true; getBackMore = true;
        e.preventDefault();
        e.stopPropagation();
        $('main').height('auto').css({'overflow':'auto','margin-top':'0'});
        $(document).scrollTop(position_y);
        $('.popup_bg').addClass('d-none');
        $('.popup_movie').remove();
        clearTimeout(window._autoplay);
        return false;
    });

    $('#btn-more').on('click', function() {
        get_more_movie();
    });
    setTimeout(function(){
        $(window).scroll(function(){check_bottom();check_last_movie();check_top();}).resize(function(){check_bottom()})
        // .on('beforeunload', function() {checkLastMovie=false;$(window).scrollTop(0); })
        ;
    },2000);
    

    /**
     * 검색
     * @param {String} s 검색어. 카테고리이름이나 날짜
     * @param {String} t 검색종류. category: 카테고리검색, date: 날짜검색
     */
    var search = function(s, t) {
        $.post(api_url+'/search/', { 's': s, 't':t }, function(r) {
            if (r && r.success) {
                li = [];
                for (i in r.payload) {
                    var row = r.payload[i];
                    li.push('<li>' + row.name + '</li>');
                }
                $('.autocomplete').empty().append(li.join(''));
            }
        }, 'json');
    }
    $('input[name=search]').on('keyup', function() {
        var t = $.trim($('select[name="search-type"]').val());
        var s = $.trim($(this).val());
        if (s.length < 1) { return; }
        search(s, t);
    });
    $('form[name=search]').on('submit', function() {
		let type = $('select[name="search-type"]').val();
		let keyword = $('input[name=search]').val();
        if(type=='category'){window.location.href='#'+keyword;}
        if(type=='date'){window.location.href= setURLParameter('date',keyword)+window.location.hash;}
        $('.autocomplete').empty();
		$('input[name=search]').val('');
        return false;
    });
    $('button[name=button-search]').on('click', function() {
        $('input[name=search]').keyup();
        return false;
    });
    $('form[name=search]').on('click', function() {
        $('.autocomplete').empty();
    });

    // new list
    $('.autocomplete').on('click', 'li', function() {
        let type = $('select[name="search-type"]').val();
        let c = $(this).text();
        if(type=='category') {
            if(c==get_hash()) {return false;}
            location.href = '#' + c;
            // add_request_getMovieList();
            emptyMovieList();
            $('.autocomplete').empty();
            $('input[name=search]').val('');
            // $('[data-toggle="offcanvas"]').click(); // desktop 환경에서 검색결과 숨김
            $('[name=btn-menu-toggler]:visible').click();
        } else {
            window.location.href = setURLParameter(`date`, c)+window.location.hash;
        }
    });

    // infomation
    // var url = '';
    // if (window.chrome) {
    //     url = 'https://chrome.google.com/webstore/search/popup%20blocker';
    // }
    // if (window.navigator.userAgent.indexOf("Firefox") > -1) {
    //     url = 'https://addons.mozilla.org/ko/firefox/search/?q=popup%20blocker';
    // }
    // $alert = '<div class="alert alert-warning alert-dismissible slide show" role="alert"><a href="' + url + '" target="_blank"><strong>팝업 차단 플러그인</strong></a>을 설치해 성인 광고를 차단해 주세요. 동영상 제공업체가 실행하는 광고에는 성인 광고도 있습니다.<button type="button" class="close" data-dismiss="alert" aria-label="Close"><span aria-hidden="true">&times;</span></button></div>';
    // $('body').append($alert);
    // setTimeout(function() {
    //     $('div.alert').find('.close').click();
    // }, 5000);



    $('[name=form-signin]').on('submit', function(){
        login();
        return false;
    });

    $('[name=form-addparser]').on('submit', function(){
        addparser();
        return false;
    });

    // 검색, 로그인, 가입, 로그아웃 등 모바일 우측 매뉴영역 클릭시 매뉴 숨김 처리.
    $('[name=btn-login],[name=btn-logout],[name=btn-join]').on('click', function(){
        $('[name=btn-menu-toggler]:visible').click();
    });
    $('form[name=search]').on('submit', function() {
        $('[name=btn-menu-toggler]:visible').click();
    });

    // 모바일 매뉴 아이콘 클릭시 커서 검색으로 이동
    $('[name=btn-menu-toggler]').on('click', function(){
        setTimeout(function(){$('[name=search]').focus();}, 1000); // 음.. 뭔가 자연스럽지 않음. callback으로 처리가 필요해보임.
    })

})(jQuery);