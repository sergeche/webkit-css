Display CSS rule line number in Safari/WebKit/Chrome Web Inspector
==================================================================

WebKit-based browsers like Safari or Google Chrome has gorgeous Web Inspector, which, unfortunately, doesn't display CSS rule's line numbers (as Firebug does).

This hack tries to fix this problem:

![Example](http://img638.yfrog.com/img638/715/q0b.png)

How to install
==============

The installation process is quite simple: all you have to do is to add downloaded `SC-CSSAdditions.js` script to *inspector.html* (Safari, Webkit) or *devtools.html* (Chrome). Here's a step-by-step instruction:

1. [Download](http://github.com/sergeche/webkit-css/downloads) archive
2. Unpack its contents and copy `SC-CSSAdditions.js` file into *inspector* folder. Its location is different for every browser and platform:

Mac
---
* Safari: `/System/Library/Frameworks/WebKit.framework/Versions/A/Frameworks/WebCore.framework/Versions/A/Resources/inspector`
* Chrome: Right-click on _Google Chrome_ app → Show Package Contents → `Contents/Versions/5.0.307.11/Google Chrome Framework.framework/Resources/inspector`. The version number (5.0.307.11 in this example) may vary depending on your Google Chrome version
* WebKit: Right-click on _WebKit_ app → Show Package Contents → `Contents/Frameworks/<Version>/WebCore.framework/Versions/A/Resources/inspector` where `<Version>` is your current OS version (Leopard — 10.5, Snow Leopard — 10.6).
	
Windows
-------
Assuming you have installed browser in default location.

* Safari on Windows doesn't have Web Inspector by default, use Google for installation instructions
* Chrome: `C:\Documents and Settings\<UserName>\Local Settings\Application Data\Google\Chrome\Application\4.0.249.89\Resources\Inspector` where `<UserName>` is your system user name (note that version number — 4.0.249.89 — may vary).


3. Open _inspector.html_ (Safari, WebKit) or _devtools.html_ (Chrome) in your favorite text editor and add `<script type="text/javascript" src="SC-CSSAdditions.js"></script>` at the end of `<head>` section.
4. Restart your browser.

Now you'll be able to see line numbers near CSS rules.

Know issues
===========
* Line numbers are displayed for external stylesheets only.
* Nested rules are not supported (for example, inside `@media` section).

Please note that this hack is in early development state and may not provide proper line numbers for style rules. If you've found such problem please [report it](http://github.com/sergeche/webkit-css/issues) and provide CSS example.

How it works
============
Web Inspector relies on W3C's DOM mostly, which means there are no "standard" way to get line numbers for CSS rule. This hack provides another parser which reads CSS source but preserves their line numbers. When you call Web Inspector, internal CSS rules are processed and marked with line numbers form this hacky parser.
