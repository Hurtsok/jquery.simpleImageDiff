# jquery.simpleImageDiff

Responsive image diff tool works in all modern desktop and mobile browsers include IE >= 9
<br/>
[http://hurtsok.github.io/jquery.simpleImageDiff/](http://hurtsok.github.io/jquery.simpleImageDiff/) 

## Dependencies
`jQuery >= 1.7`

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

You can pass options via js
```js 
     { 
        controlSpace: 18,
        maxWidth: 'auto', // if maxWidth more than image real width, maxWidth=imageRealWidth,
        resize: true,
        width: false  //// if you have responsive container, you must pass start width
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
      }      
```

Or use data attributes, its more flexibly because you can config many blocks on page.
```html
        <div data-diff data-maxWidth="200" data-resize="1">
            <img data-title="before" src="images/1.jpg" />
            <img data-title="after" src="images/2.jpg" />
        </div> 
```

## Build
1. Install [nodejs](https://nodejs.org/en/)
2. Install gulp globally:
```cmd
    npm install -g gulp
```
3. Install npm dependencies:
```cmd
    npm install 
```
4. Run tasks
<br/>
build and minify js/stylus files
```cmd 
    gulp build
```
run watcher for automatically build js/stylus files
```
    gulp dev
```