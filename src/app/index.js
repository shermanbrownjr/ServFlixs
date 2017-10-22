import $ from 'jquery';
window.$ = $; 

import '../../node_modules/font-awesome/scss/font-awesome.scss'; 
import '../../node_modules/slick-carousel/slick/slick.scss';  
import '../../node_modules/slick-carousel/slick/slick-theme.scss';
import './styles/main.scss';
import '../../node_modules/material-components-web/dist/material-components-web.js';
import '../../node_modules/slick-carousel/slick/slick.min.js';
import '../../node_modules/jquery-typeahead/dist/jquery.typeahead.min.css';
import '../../node_modules/jquery-typeahead/dist/jquery.typeahead.min.js';

(() => {
    $(document).ready(function () {

        $('#search-box').typeahead({
            order: "desc",
            source: {  
                movie: {
                    ajax: {
                        type: "POST",
                        url: "/movie/api",
                        data: JSON.stringify({ query: "query {titles}" }),
                        dataType: "json",
                        contentType: 'application/json'
                    },
                    ajax: function (query) {
                        return {
                            type: "POST",
                            url: "/movie/api",
                            data: JSON.stringify({ query: "query {titles}" }),
                            dataType: "json",
                            contentType: 'application/json',
                            callback: {
                                done: function (resp) {
                                    return resp.data.titles;
                                }
                            }
                        }
                    }
                }
            }
        });

        $('#search-box').keyup(function (e) {
            if (e.keyCode == 13) {
                window.location.href = "/" + $('#search-box').val();
            }
        });

    });
})();

