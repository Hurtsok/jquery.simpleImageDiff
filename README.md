# jquery.simpleImageDiff

Responsive image diff tool works in all modern desktop and mobile browsers include IE >= 9
Need jquery >= 1.7
[http://hurtsok.github.io/jquery.simpleImageDiff/](http://hurtsok.github.io/jquery.simpleImageDiff/) 

## Install
```cmd
    bower install jquery.simpleImageDiff --save
```
 
## Simple layout
<br/>
```html
    <div data-diff>
        <img src="images/1.jpg" />
        <img src="images/2.jpg" />
    </div> 
```

## Initialization
```js
    $('[data-diff]').simpleImageDiff();
```

## Options
```js 
     { 
        controlSpace: 18,
        layout: {
            container: '<div class="b-diff"></div>',
            control: '<div class="b-diff__control">' +
                        '<div class="b-diff__line"></div>' +
                        '<div class="b-diff__arrow b-diff__arrow_left"></div>' +
                        '<div class="b-diff__arrow b-diff__arrow_right"></div>' +
                     '</div>'
        }
      }      
```