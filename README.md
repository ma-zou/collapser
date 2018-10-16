# collapser
Small JavaScrip accordion

## Usage:

```JavaScript 
var collapser = new Collapser();

// destroy after Breakpoint (requires "breakpoint_from_css")

var collapser = new Collapser({ onhold: true });
if (breakpoint.medium.max) collapser.init();
window.addEventListener("resize", function () {
    if (breakpoint.medium.max) collapser.init();
    else collapser.destroy();
});
```

Make sure to init the class after the DOM-Elements are loaded to prevent strange scrolling

## Options

|Option|Type|Default|Description|
----------------------
|trigger|String (Selector)|'.collapser'|element that should the click event will be added to|
|maxHeight|Bool/Int|false|max-height of element when active|
|scrollTo|Bool|false|activate scrolling to element on click|
|openFirst|Bool|true|open the first element on pageload|
|onhold|Bool|false|wait for init method before initalising|

