/**
 * Created by hurtsok on 17.09.2015.
 */

(function(W, D, $){
    var defaults = {
        controlSpace: 18, //css padding
        layout: {
            container: '<div class="b-diff"></div>',
            control: '<div class="b-diff__control">' +
            '<div class="b-diff__line"></div>' +
            '<div class="b-diff__arrow b-diff__arrow_left"></div>' +
            '<div class="b-diff__arrow b-diff__arrow_right"></div>' +
            '</div>'
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
                var $images = $elem.find('img');
                if ($images.length == 2) {
                    $elem.css('display', 'none');
                    O.current = $(defaults.layout.container);
                    O.current.bind('loaded', function () {
                        var controlWidth, parentOffset;
                        $images = O.current.find('img');
                        O.$control = $(defaults.layout.control);
                        O.$clipedImage = $images.last();
                        O.current.append(O.$control);
                        $elem.replaceWith(O.current);
                        parentOffset = O.current.offset();
                        O.dimensions = O.getImageRealSize($images.first().get(0));
                        O.resizeItems();

                        controlWidth = O.$control.width();
                        O.controlPosition = O.currentImageDim.width / 2 - controlWidth / 2;
                        O.clipAreaRatio = O.controlPosition / O.currentImageDim.width;
                        O.move(O.controlPosition);

                        $(W).resize(function () {
                            O.stopAnimation(O.$control);
                            O.stopAnimation(O.$clipedImage);
                            O.resizeItems();
                            O.controlPosition = O.clipAreaRatio * O.currentImageDim.width;
                            O.move(O.controlPosition);
                            parentOffset = O.current.offset();
                        });

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

                    });

                    $images.load(function () {
                        O.loaded += 1;
                        O.current.append('<img src="' + $(this).attr('src') + '"/>');
                        if (O.loaded == $images.length) {
                            O.current.trigger('loaded');
                        }
                    })
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
            resizeItems: function () {
                var prop = O.current.width() / O.dimensions.width;

                O.currentImageDim.width = prop * O.dimensions.width;
                O.currentImageDim.height = prop * O.dimensions.height;

                O.current.find('img').css({
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