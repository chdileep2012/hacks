var Config = {
    TILES: 'http://m.nok.it/?app_id=C2Cse_31xwvbccaAIAaP&token=fjFdGyRjstwqr9iJxLwQ-g&c={LAT},{LON}&nord&nodot&t={T}&h=72&w=72&z=7',
    HERE: [28, 31, 33, 34, 35, 36, 38, 39, 40, 43, 44, 45, 46, 53, 56, 58, 63, 66, 68, 78, 81, 83, 88, 91, 93, 103, 104, 105, 106, 108, 109, 110, 113, 114, 115, 118, 119, 120, 128, 131, 133, 138, 140, 143, 153, 156, 158, 163, 166, 168, 178, 181, 183, 188, 191, 193, 203, 206, 208, 209, 210, 211, 213, 216, 218, 219, 220, 221]
}, getImage;

function randomCity(){
    var rc = {}, i = Math.floor(CITIES.length * Math.random());
    rc.lat = CITIES[i].lat;
    rc.lon = CITIES[i].lon;
    rc.city = CITIES[i].city;
    return rc;
}

getImage = (function(){
    var cache = [], cacheProbability = 0.6, c, zoom;
    return function(){
        var img, l = cache.length;
        if(Math.random() < cacheProbability && l > 10) {
            img = cache[Math.floor(Math.random() * l)];
        } else {
            c = randomCity();
            zoom = Math.floor(Math.random() * 9) || 1;
            img = Config.TILES.replace('{LAT}', c.lat).replace('{LON}', c.lon).replace('{T}', zoom);
            img = {
                img: img,
                where: c
            };
            cache.push(img);
        }
        return img;
    };
})();

function isAnimatable(){
    var animation = false,
    animationstring = 'animation',
    keyframeprefix = '',
    domPrefixes = 'Webkit Moz O ms Khtml'.split(' '),
    pfx  = '',
    elm = document.createElement('div');

    if( elm.style.animationName ) { animation = true; }

    if( animation === false ) {
        for( var i = 0; i < domPrefixes.length; i++ ) {
            if( elm.style[ domPrefixes[i] + 'AnimationName' ] !== undefined ) {
                pfx = domPrefixes[i];
                animationstring = pfx + 'Animation';
                keyframeprefix = '-' + pfx.toLowerCase() + '-';
                animation = true;
                break;
            }
        }
    }

    return animation;
}

function render(){
    var img, d, magicImage, animatable = isAnimatable(), tiles = $('.tiles');
    for(var i=0;i<250;i++) {
        img = getImage();
        d = $('<li>');
        d.data('img', img);
        img = img.img;
        d.attr("style","  -webkit-animation-delay: "+(Math.random()*10)+"s;-moz-animation-delay: "+(Math.random()*10)+"s;animation-delay: "+(Math.random()*10)+"s;left:" +(i*40)%1000+ "px;top:" +Math.floor(i/25)*40+ "px; background-image:url(" + img + ");");
        if(!~$.inArray(i, Config.HERE)) {
            d.addClass('tobe-flippable');
            if(!animatable) {
                d.addClass('flipped');
            }
        }
        magicImage = new Image();
        if(i === 249) {
            magicImage.onload = function(){
                setTimeout(function(){
                    $('.tobe-flippable').addClass('flippable');
                }, 500);
            };
        }
        magicImage.src = img;
        tiles.append(d);
    }
    tiles.on('click', 'li', function(){
        var data = $(this).data('img'),
            url = 'http://here.com/map=' + data.where.lat + ',' + data.where.lon + ',11/title=' + data.where.city;
        window.open(url);
    });
}

$(window).on('load', function(){
    var address = [$('.street-address').text(), $('.locality').text(), $('.postal-code').text(), $('.country-name').text()].join(', '),
        map =  $('.venue-map');
    $('.email').attr('href', 'mailto:herehacks@nokia.com').text('herehacks@nokia.com');
    $.jHERE.geocode(address, function(location){
        //In the very unfortunate case of geocode failing, fallback to using the approx. coordinates.
        location = location || [52.53, 13.385];
        map.jHERE({type: 'smart', center: location, zoom: 16, enable:['behavior', 'zoombar']})
           .jHERE('marker', location, {fill: '#124191'});
    });
    $('.pt .toggle').on('click', function(e){
        e.preventDefault();
        var link = $(this);
        if(link.data('type') === 'pt') {
            link.data('type', 'smart');
            return map.jHERE('type', 'smart');
        }
        link.data('type', 'pt');
        map.jHERE('type', 'pt');
    });
    $('.pt .sign').on('click', function(e){
        e.preventDefault();
        $('.pt .toggle').data('type', 'pt');
        map.jHERE('type', 'pt');
    });
    render();
    $(".fancybox").fancybox({
        padding: 0
    });
});