(function(W, D, $){
    var defaults = {
        controlSpace: 18, //css padding
        maxWidth: 'auto',
        width: false,
        resize: true,
        titles: {
            before: '',
            after: ''
        },
        layout: {
            container: '<div class="b-diff"></div>',
            item: '<div class="b-diff__item"></div>',
            control: '<div class="b-diff__control">' +
            '<div class="b-diff__line"></div>' +
            '<div class="b-diff__arrow b-diff__arrow_left"></div>' +
            '<div class="b-diff__arrow b-diff__arrow_right"></div>' +
            '</div>',
            title: '<div class="b-diff__title"></div>'
        }
    };

    function simpleImageDiff($elem) {
        var O = {
            current: false,
            loaded: 0,
            dimensions: false,
            currentImageDim: {},
            controlPosition: 0,
            clipAreaRatio: false,
            $clipedImage: false,
            $control: false,
            init: function () {
                var $images = $elem.find('img').slice(0, 2),
                    $body = $('body');

                O.current = $(defaults.layout.container);
                O.current.bind('prebuild', function(){
                    O.dimensions = O.getImageRealSize($images.first().get(0));

                    $elem.css('display', 'none');

                    if(!defaults.width){
                        defaults.width = O.current.width();
                    }

                    O.current.insertBefore($elem);

                    //setting base height
                    O.current.css({
                        height: (defaults.width / O.dimensions.width) * O.dimensions.height
                    });
                });


                O.current.bind('loaded', function () {
                    var controlWidth, parentOffset,
                        titles = {};
                    //$images = $elem.find('img').slice(0, 1);

                    titles.before = $images.first().attr('data-title') || defaults.titles.before;
                    titles.after = $images.last().attr('data-title') || defaults.titles.after;

                    $images.each(function(index){
                        var $item = $(defaults.layout.item),
                            $title = $(defaults.layout.title);
                        $item.append($(this));

                        if(titles.before && index < 1){
                            $title.addClass('b-diff__title_before');
                            $item.append($title.text(titles.after));
                        }

                        if(titles.after && index > 0){
                            $title.addClass('b-diff__title_after');
                            $item.append($title.text(titles.before));
                        }

                        O.current.append($item);

                    });

                    //O.current.append($images);
                    O.$control = $(defaults.layout.control);
                    O.$clipedImage = O.current.find('.b-diff__item:last');
                    O.current.append(O.$control);

                    parentOffset = O.current.offset();

                    O.resizeItems(defaults.width);

                    controlWidth = O.$control.width();
                    O.controlPosition = O.currentImageDim.width / 2 - controlWidth / 2;
                    O.clipAreaRatio = O.controlPosition / O.currentImageDim.width;
                    O.move(O.controlPosition);

                    $elem.remove();

                    if(defaults.resize) {
                        $(W).resize(function () {
                            O.stopAnimation(O.$control);
                            O.stopAnimation(O.$clipedImage);
                            O.resizeItems();
                            O.controlPosition = O.clipAreaRatio * O.currentImageDim.width;
                            O.move(O.controlPosition);
                            parentOffset = O.current.offset();
                        });
                    }
                    O.current.bind('click', function (e) {
                        var pageX = e.pageX || e.originalEvent.touches[0].pageX;

                        O.controlPosition = pageX - parentOffset.left;
                        O.clipAreaRatio = O.controlPosition / O.currentImageDim.width;
                        O.animateItems(O.controlPosition);
                        console.log('click');
                    })

                    O.current.bind('mousedown.diff', function(e){
                        if(e.which == 1) {
                            handler(e);
                            return false;
                        }
                    });

                    O.current.bind('touchstart.diff', handler);

                    function handler(e) {
                        O.stopAnimation(O.$control);
                        O.stopAnimation(O.$clipedImage);
                        var startPageY = e.pageY || e.originalEvent.touches[0].pageY,
                            startPageX = e.pageX || e.originalEvent.touches[0].pageX,
                            isSliderScroll = true,
                            caller = 0;
                        $body.bind('mousemove.diff touchmove.diff', function (e) {
                            var pageX = e.pageX || e.originalEvent.touches[0].pageX,
                                pageY = e.pageY || e.originalEvent.touches[0].pageY;

                            if (Math.abs(pageY - startPageY) > Math.abs(pageX - startPageX) && caller < 1) {
                                isSliderScroll = false;
                                return true;
                            }

                            if (isSliderScroll) {
                                O.controlPosition = pageX - parentOffset.left;
                                O.clipAreaRatio = O.controlPosition / O.currentImageDim.width;
                                O.move(O.controlPosition);
                                caller += 1;
                                return false;
                            }
                        });
                    }

                    $body.bind('mouseup.diff touchend.diff mouseleave.diff touchleave.diff', function () {
                        $body.unbind('mousemove.diff touchmove.diff');
                    });

                    $images.bind('dragstart', function(){
                        return false;
                    })


                });

                $images.each(function(){
                    if(this.complete){
                        O.loaded += 1;
                        if(O.loaded === 1){
                            O.current.trigger('prebuild');
                        }
                        if (O.loaded == $images.length){
                            O.current.trigger('loaded');
                        }
                    }else{
                        $(this).load(function(){
                            O.loaded += 1;
                            if(O.loaded === 1){
                                O.current.trigger('prebuild');
                            }
                            if (O.loaded == $images.length) {
                                O.current.trigger('loaded');
                            }
                        })
                    }
                });


            },
            getImageRealSize: function (DOMElement) {
                return {
                    width: DOMElement.naturalWidth,
                    height: DOMElement.naturalHeight,
                    ratio: DOMElement.naturalWidth / DOMElement.naturalHeight
                }

            },
            setClipArea: function (width) {
                O.$clipedImage.css('clip', 'rect(0, ' + width + 'px,' + O.currentImageDim.height + 'px, 0)');
            },
            moveControl: function (dest) {
                O.$control.css({
                    left: dest
                });
            },
            move: function (dest) {
                var controlWidth = O.$control.width();
                if (dest <= 0) {
                    dest = 0;
                } else {
                    if (dest >= O.currentImageDim.width - controlWidth) {
                        dest = O.currentImageDim.width - controlWidth;
                    }
                }

                O.moveControl(dest - defaults.controlSpace);
                O.setClipArea(dest);
            },
            resizeItems: function(cWidth){
                var prop, width = cWidth || O.current.width() ;

                // if our container width more than image full width
                if(O.dimensions.width <= width){
                    width = O.dimensions.width;
                }

                if(defaults.maxWidth != 'auto'){
                    width = (defaults.maxWidth < width) ? defaults.maxWidth : width;
                }

                prop = width / O.dimensions.width;
                O.currentImageDim.width = prop * O.dimensions.width;
                O.currentImageDim.height = prop * O.dimensions.height;

                O.current.find('.b-diff__item').css({
                    width: O.currentImageDim.width,
                    height: O.currentImageDim.height
                });

                O.current.css('height', O.currentImageDim.height);



                O.$control.css('height', O.currentImageDim.height);
            },
            animateItems: function(dest) {
                O.$control.css({
                    '-webkit-transition': 'left .3s ease-in-out',
                    'transition': 'left .3s ease-in-out'
                });
                O.$clipedImage.css({
                    '-webkit-transition': 'all .3s ease-in-out',
                    'transition': 'all .3s ease-in-out'
                });
                O.move(dest);
            },
            stopAnimation: function ($elem) {
                $elem.css({
                    '-webkit-transition': '',
                    'transition': ''
                });
            }
        }

        O.init();
    }

    $.fn.simpleImageDiff = function(options){
        $.extend(defaults, options || {});
        this.each(function(){
            simpleImageDiff($(this));
        });
    }
}(window, document, jQuery));