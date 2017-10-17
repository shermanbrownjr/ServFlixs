import $ from 'jquery';
window.$ = $;
import '../../node_modules/slick-carousel/slick/slick.scss';
import '../../node_modules/slick-carousel/slick/slick-theme.scss';
import './styles/main.scss';
import '../../node_modules/material-components-web/dist/material-components-web.js';
import '../../node_modules/slick-carousel/slick/slick.min.js';

(() => {
    $(document).ready(function () {
 
        $('.video-container').slick({
            dots: false,
            infinite: true,
            speed: 300, 
            slidesToShow: 5,
            slidesToScroll: 5,
            arrows: true,
            responsive: [
                {
                    breakpoint: 1024,
                    settings: { 
                        slidesToShow: 4,
                        slidesToScroll: 4
                    } 
                },
                {
                    breakpoint: 600,
                    settings: {
                        slidesToShow: 3,
                        slidesToScroll: 3,
                        arrows: false
                    }
                },
                {
                    breakpoint: 480,
                    settings: {
                        slidesToShow: 2,
                        slidesToScroll: 2,
                        arrows: false
                    }
                }
            ]
        });
    });
})();

