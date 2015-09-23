# jquery.simpleImageDiff

Responsive image diff tool
works in all modern browsers include IE >= 9
 
## Install
```cmd
    bower install jquery.simpleImageDiff --save
```
 
## Simple layout
responsive
<br/>
```html
    <div data-diff="1">
        <img src="images/1.jpg" />
        <img src="images/2.jpg" />
    </div> 
```

## Initialization
```js
    $('[data-diff]').simpleImageDiff();
```