/* blazyload.js (c) Benant Han
* https://benant@bitbucket.org/benant/benant-front-js.git
* expects a list of:
* `<img src="default.gif" data-src="origin_image.png" width="600" height="400" class="blazyload">`
* MIT License (http://www.opensource.org/licenses/mit-license.html)
*/
$(function ($) {
    var addEventListener = function (evt, fn) {
            window.addEventListener
                ? this.addEventListener(evt, fn, false)
                : (window.attachEvent)
                    ? this.attachEvent('on' + evt, fn)
                    : this['on' + evt] = fn;
        }, 
        _has = function (obj, key) {
            return Object.prototype.hasOwnProperty.call(obj, key);
        };

    function loadImage(el, fn) {
        var img = new Image()
            , src = el.getAttribute('data-src');
        img.onload = function () {
            if(el.tagName.toLowerCase()=='img') { // <img> 태그처리
                if (!!el.parent)
                    el.parent.replaceChild(img, el)
                else
                    el.src = src;
            } else { // <div style="background-image:..."> 처리
                el.style.backgroundImage = 'url('+src+')';
            }
            fn ? fn() : null;
        }
        img.src = src;
    }

    function elementInViewport(el) {
        var rect = el.getBoundingClientRect(), innerHeight = (window.innerHeight || document.documentElement.clientHeight)*3;
        return (
            rect.top >= 0
            && rect.left >= 0
            && rect.top <= innerHeight
        )
    }

    var images = new Array(),
        processScroll = function () {
            for (var i = 0; i < images.length; i++) {
                if (elementInViewport(images[i])) {
                    loadImage(images[i], function () {
                        images.splice(i, i);
                    });
                }
            };
        };
    window.setbLazyLoadData = function () {
        var img = $('.blazyload');// <img> + <div style="background-image"> 2가지 모두 처리
        images = new Array();
        // Array.prototype.slice.call is not callable under our lovely IE8
        for (var i = 0; i < img.length; i++) {
            images.push(img[i]);
        };
        processScroll();
    }

    setbLazyLoadData();
    addEventListener('scroll', processScroll);
});