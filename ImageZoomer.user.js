// ==UserScript==
// @name         Image Zoomer
// @namespace    http://tampermonkey.net/
// @version      0.1
// @description  Zoom images on a webpage with Ctrl-MiddleClick.
// @author       coverprice
// @match        https://forums.somethingawful.com/*
// @match        http://forums.somethingawful.com/*
// @grant        none
// @require      https://ajax.googleapis.com/ajax/libs/jquery/3.1.1/jquery.min.js
// @icon         http://www.freeiconspng.com/download-ico/8428
// ==/UserScript==

(function() {
    'use strict';

    let ctrlDown = false;

    $(document).on('keydown', function(event) {
        if(event.ctrlKey) {
            ctrlDown = true;
        }
    });
    $(document).on('keyup', function(event) {
        if(event.ctrlKey) {
            ctrlDown = false;
        }
    });

    function popit(img) {
        let img_width = img.naturalWidth;
        let img_height = img.naturalHeight;
        let win_width = $(window).width();
        let win_height = $(window).height();
        let scale_horiz = win_width / img_width;
        let scale_vert = win_height / img_height;

        let zoom_img_width, zoom_img_height;
        if(scale_vert < scale_horiz) {
            zoom_img_width = img_width * scale_vert;
            zoom_img_height = win_height;
        } else {
            zoom_img_width = win_width;
            zoom_img_height = img_height * scale_horiz;
        }

        let indent = 6;
        zoom_img_width = Math.floor(zoom_img_width - indent);
        zoom_img_height = Math.floor(zoom_img_height - indent);
        if(zoom_img_height <= 0 || zoom_img_width <= 0) {
            console.log("Image too small to zoom");
            return;
        }
        let left = Math.floor((win_width - zoom_img_width - indent) / 2);
        let top = Math.floor((win_height - zoom_img_height - indent) / 2);
        let zoomed_img = $('<img />', {
            src: img.src,
            width: zoom_img_width + 'px',
            height: zoom_img_height + 'px',
        });

        $('<div />')
            .css({
            position: 'fixed',
            left: left + 'px',
            top: top + 'px',
            width: zoom_img_width + 'px',
            height: zoom_img_height + 'px',
            'z-index': 1000,
            margin: '0px auto',
            padding: '0px',
            'background-color': 'white',
            border: '1px solid black',

        })
            .append(zoomed_img)
            .appendTo($('body'))
            .on('click', function (event) {
            $(event.delegateTarget).remove();
        });
    }

    $('img').each(function() {
        $(this).on('mousedown', function(event) {
            if(event.which == 2) {
                if(ctrlDown) {
                    event.stopPropagation();
                    popit(event.delegateTarget);
                }
            }
        });
    });
})();
