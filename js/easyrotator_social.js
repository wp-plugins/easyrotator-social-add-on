/*
 Copyright 2012 DWUser.com.
 Email contact: support {at] dwuser.com

 This file is part of EasyRotator Social Add-On.

 This program is free software: you can redistribute it and/or modify
 it under the terms of the GNU General Public License as published by
 the Free Software Foundation, either version 2 of the License, or
 (at your option) any later version.

 This program is distributed in the hope that it will be useful,
 but WITHOUT ANY WARRANTY; without even the implied warranty of
 MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
 GNU General Public License for more details.

 You should have received a copy of the GNU General Public License
 along with this program.  If not, see <http://www.gnu.org/licenses/>.
 */

var er_preprocessCallbacks = er_preprocessCallbacks || [];
er_preprocessCallbacks.push(function($){

    // --- Configuration Options ---
    var opts = {
        filter: 'div.socialEasyRotator',
        spacing: 10,
        position: {
            horizontal: 'center',
            vertical: 'middle',
            padding: 20,
            hOffset: 0,
            vOffset: 0
        },
        pauseAutoplay: true
    };

    // --- Button Definitions ---
    var floaterHTML = '<div id="erSocialFloater" class="erSocialFloaterDefault">' +
            '<a href="#" data-link="http://pinterest.com/pin/create/button/?url={link}&media={src}&description={title}" title="Pin on Pinterest">' +
                '<i class="erSocialIcon" style="background-position: 0 0;"></i>' +
            '</a>' +
            '<a href="#" data-link="https://twitter.com/intent/tweet/?url={link}&text={title}&via=dwuser" title="Tweet on Twitter">' +
                '<i class="erSocialIcon" style="background-position: -32px 0;"></i>' +
            '</a>' +
            '<a href="#" data-link="http://www.facebook.com/sharer.php?u={link}&t={title}" title="Share on Facebook">' +
                '<i class="erSocialIcon" style="background-position: -64px 0;"></i>' +
            '</a>' +
        '</div>';
    // --- Button CSS Styles ---
    var floaterCSS = '<style type="text/css">' +
        '   #erSocialFloater.erSocialFloaterDefault { line-height: 32px; padding: 0; }' +
        '   #erSocialFloater.erSocialFloaterDefault a { display: inline-block; width: 32px; height: 32px; margin: 0 0 0 ' + opts.spacing + 'px; text-decoration: none; border: none; padding: 0; }' +
        '   #erSocialFloater.erSocialFloaterDefault a:first-child { margin-left: 0; }' +
        '   #erSocialFloater.erSocialFloaterDefault a:hover { text-decoration: none; border: none; }' +
        '   #erSocialFloater.erSocialFloaterDefault i.erSocialIcon { display: inline-block; width: 32px; height: 32px; background: url(\'http' + ('https:' == document.location.protocol ? 's' : '') + '://easyrotator.s3.amazonaws.com/1/i/rotator/social/img32/sprite.png\') 0 0 no-repeat; }' +
        '</style>';
    $(floaterCSS).appendTo('head');


    // --- Do not modify beyond here unless you are an advanced user!!! ---

    // Allow page-specific overrides via er_socialConfig.
    if (window.er_socialConfig)
        opts = $.extend(true, opts, window.er_socialConfig); // deep copy

    var slideLinkBase = (function(){
        var hashSplit = location.href.split('#');
        var parts = hashSplit.shift().split('?');
        var base = parts.shift();
        var qs = '&' + (parts.join('?'));
        qs = qs.replace(/&er_row=[^&]+/, '&er_row={er_row}');
        qs = qs.replace(/&er_col=[^&]+/, '&er_col={er_col}');
        if (!/&er_row=/.test(qs))
            qs += '&er_row={er_row}';
        if (!/&er_col=/.test(qs))
            qs += '&er_col={er_col}';
        qs = qs.replace(/^&+/, '');
        var ret = base + '?' + qs;
        if (hashSplit.length > 0)
            ret += '#' + hashSplit.join('#');
        return ret;
    })();

    // Setup all of the data for all rotators
    var data = [];
    var ul = $('div.dwuserEasyRotator>div[data-ertype=content]>ul', opts.filter);
    ul.each(function(i){
        var dataImgs = [];
        $(this).children('li').each(function(j){
            // Extract the info for this slide
            var li = $(this);
            var img = li.find('img.main');
            var src = img.attr('data-srcSocial') || img.attr('src');
            var title = li.children('span.title').html();
            var desc = li.children('span.desc').html();
            var link = slideLinkBase;
            if (i==0)
                link = link.split('er_row={er_row}&').join('').split('&er_row={er_row}').join(''); // cut er_row if it's the first row
            link = link.split('{er_row}').join(i).split('{er_col}').join(j);

            // Store the image's info in the tracker; add data so we can reference this later
            var obj = {src:src, title:title, desc:desc, link:link};
            dataImgs[j] = obj;
            img.attr('data-erSocialData', i+','+j);
        });
        // Store the category's info in the tracker
        data[i] = dataImgs;
    });

    // The share button hander
    var shareButtonClickHandler = function(e)
    {
        e.preventDefault();

        var btn = $(this);
        var associatedImage = floater.parent().find('img.main');
        var info = associatedImage.attr('data-erSocialData');
        if (!info)
            return;
        var dataID = info.split(',');
        var dataCat = data[dataID[0]],
            dataImg = dataCat[dataID[1]];

        // Build the destination link
        var dest = btn.attr('data-link');
        var src = associatedImage[0].src; //dataImg.src;
        dest = dest.split('{link}').join(encodeURIComponent(dataImg.link))
            .split('{url}').join(encodeURIComponent(location.href))
            .split('{src}').join(encodeURIComponent(src))
            .split('{title}').join(encodeURIComponent(dataImg.title))
            .split('{desc}').join(encodeURIComponent(dataImg.desc));
        window.open(dest, 'sharingLink' + (new Date().getTime()));

        // pause autoplay
        if (opts.pauseAutoplay)
            associatedImage.closest('div.dwuserEasyRotator').trigger('er_playPause', {v:false});
    };

    // Build the floater
    var floater = (function(){

        // If #erSocialFloater is already defined in the page, use it instead of the default.
        var div = $('#erSocialFloater');
        if (div.length == 0)
            div = $(floaterHTML);
        div.css({position:'absolute', zIndex:'999999', overflow:'hidden', opacity:0}).hide().appendTo('body');
        div.find('a').click(shareButtonClickHandler);

        // Position it
        var p = opts.position,
            h = p.horizontal,
            v = p.vertical,
            pad = p.padding;
        div.css({
            left: (/left|center/i.test(h) ? (h=='left' ? pad : '50%') : undefined),
            right: (h=='right' ? pad : undefined),
            top: (/top|middle/i.test(v) ? (v=='top' ? pad : '50%') : undefined),
            bottom: (v=='bottom' ? pad : undefined),
            marginLeft:p.hOffset,
            marginTop:p.vOffset
        });
        // if centered, full marginLeft and marginTop will be set later

        return div;
    })();


    // Setup all of the listeners for the images
    $('div.dwuserEasyRotator div.erimgMain:not(.rotatorTileNav):not(.notSocial) div.erimgMain_img, div.dwuserEasyRotator div.erimgMainOneUp:not(.notSocial) div.erimgMainOneUp_img', opts.filter).live('mouseenter mouseleave', function(e){
        var target = $(this);
        if (e.type == 'mouseenter')
        {
            var parent = floater.parent();
            if (parent.length==0 || parent[0] !== target[0])
                floater.appendTo(target);

            var p = opts.position;
            if (p.horizontal == 'center')
                floater.css({marginLeft:(-floater.width()/2 + p.hOffset)});
            if (p.vertical == 'middle')
                floater.css({marginTop:(-floater.height()/2 + p.vOffset)});

            floater.stop(true).show().fadeTo(300, 1);
        }
        else
        {
            floater.stop(true).fadeTo(300, 0);
        }
    });
});

// Also enable permalinking, so we can link directly to specific slides
var er_postprocessCallbacks = er_postprocessCallbacks || [];
er_postprocessCallbacks.push(function($){
    $.extend({getUrlVars:function(){var a=[],hash;var b=window.location.href.slice(window.location.href.indexOf('?')+1).split('&');for(var i=0;i<b.length;i++){hash=b[i].split('=');a.push(hash[0]);a[hash[0]]=hash[1]}return a},getUrlVar:function(a){return $.getUrlVars()[a]}});
    var er_row = Number(parseInt($.getUrlVar('er_row') || '0'));
    var er_col = Number(parseInt($.getUrlVar('er_col') || '0'));
    if (isNaN(er_row)) er_row = 0;
    if (isNaN(er_col)) er_col = 0;
    if (er_row != 0)
    {
        $('div.dwuserEasyRotator').trigger('er_setRow', {id:er_row});
    }
    if (er_col != 0)
    {
        setTimeout(function(){
            $('div.dwuserEasyRotator').trigger('er_setCol', {id:er_col});
        }, er_row != 0 ? 1000 : 0);
    }
});