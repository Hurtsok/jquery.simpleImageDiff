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
                var $images = $elem.find('img').slice(0, 2);
                if ($images.length == 2) {
                    $elem.css('display', 'none');
                    O.current = $(defaults.layout.container);
                    O.current.bind('loaded', function () {
                        var controlWidth, parentOffset;
                        //$images = $elem.find('img').slice(0, 1);

                        $images.each(function(index){
                            var $item = $(defaults.layout.item),
                                $title = $(defaults.layout.title);
                            $item.append($(this));

                            if(defaults.titles.before && index < 1){
                                $title.addClass('b-diff__title_before');
                                $item.append($title.text(defaults.titles.after));
                            }

                            if(defaults.titles.after && index > 0){
                                $title.addClass('b-diff__title_after');
                                $item.append($title.text(defaults.titles.before));
                            }

                            O.current.append($item);

                        });

                        //O.current.append($images);
                        O.$control = $(defaults.layout.control);
                        O.$clipedImage = O.current.find('.b-diff__item:last');
                        O.current.append(O.$control);
                        $elem.replaceWith(O.current);
                        parentOffset = O.current.offset();
                        O.dimensions = O.getImageRealSize($images.first().get(0));

                        O.resizeItems(defaults.width);

                        controlWidth = O.$control.width();
                        O.controlPosition = O.currentImageDim.width / 2 - controlWidth / 2;
                        O.clipAreaRatio = O.controlPosition / O.currentImageDim.width;
                        O.move(O.controlPosition);

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
                            e.preventDefault();
                            var pageX = e.pageX || e.originalEvent.touches[0].pageX;

                            O.controlPosition = pageX - parentOffset.left;
                            O.animateItems(O.controlPosition);
                        })

                        O.$control.bind('mousedown.diff touchstart.diff', function (e) {
                            O.stopAnimation(O.$control);
                            O.stopAnimation(O.$clipedImage);

                            O.current.bind('mousemove.diff touchmove.diff', function (e) {
                                e.preventDefault();
                                var pageX = e.pageX || e.originalEvent.touches[0].pageX;
                                O.controlPosition = pageX - parentOffset.left;
                                O.clipAreaRatio = O.controlPosition / O.currentImageDim.width;
                                O.move(O.controlPosition, O.clipAreaRatio);
                            });
                        });

                        O.current.bind('mouseup.diff touchend.diff mouseleave.diff touchleave.diff', function () {
                            O.current.unbind('mousemove.diff touchmove.diff');
                        });

                        $images.bind('mousedown mouseleave dragstart', function(){
                            return false;
                        });

                    });

                    $images.each(function(){
                        if(this.complete){
                            O.loaded += 1;
                            if (O.loaded == $images.length){
                                O.current.trigger('loaded');
                            }
                        }else{
                            $(this).load(function(){
                                O.loaded += 1;
                                if (O.loaded == $images.length) {
                                    O.current.trigger('loaded');
                                }
                            })
                        }
                    });

                }
            },
            getImageRealSize: function (DOMElement) {
                return {
                    width: DOMElement.naturalWidth,
                    height: DOMElement.naturalHeight,
                    ratio: DOMElement.naturalWidth / DOMElement.naturalHeight
                }

            },
            setClipArea: function (width) {
                O.$clipedImage.css('clip', 'rect(0, ' + width + 'px,' + O.currentImageDim.width + 'px, 0)');
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
                O.move(dest)
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