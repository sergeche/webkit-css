if (!window.WebInspector)
	WebInspector = {};
	
WebInspector.loadResource = function(url, callback) {
	// don't use WebInspector.getResourceContent() because of its async nature
	var xhr = new XMLHttpRequest();
	xhr.open("GET", url, false);
	xhr.send(null);
	
	if (callback) {
		callback(xhr.responseText);
	}
};

WebInspector._cssCache = {};
WebInspector.getCSSStyleList = function(style_rule) {
	var style_href = style_rule.parentStyleSheet.href;

	if (!(style_href in this._cssCache)) {
		WebInspector.loadResource(style_href, function(content) {
			WebInspector._cssCache[style_href] = SC_CSSParser.read(content);
			WebInspector._cssCache[style_href].source = content;
		});
	}

	return this._cssCache[style_href];
};


WebInspector.getParsedCSSRules = function(style_rule) {
	var resource = WebInspector.getCSSStyleList(style_rule);
	if (resource) {
		return SC_CSSParser.findBySelector(resource, style_rule.selectorText, resource.source);
	} else {
		return null;
	}
};

if (WebInspector.DOMWindow) {
	WebInspector.DOMWindow.prototype.getMatchedCSSRules = function(node, pseudoElement, authorOnly) {
		// we should keep track of found rules to get proper one on multiple match
		var rule_track = {},
			has_unmatched = false;

		try {
			for (var i = 0, il = node._matchedCSSRules.length; i < il; i++) {
				var rule = node._matchedCSSRules[i];

				if (rule.parentStyleSheet && rule.parentStyleSheet.href) {
					var rules = WebInspector.getParsedCSSRules(rule);
					if (rules === null) {
						// looks like the stylesheet isn't loaded yet
						has_unmatched = true;
					} else {
						var selector = SC_CSSParser.normalizeSelector(rule.selectorText);
						if (!(selector in rule_track))
							rule_track[selector] = 0;

						rule.lineNumber = rules[Math.min(rules.length - 1, rule_track[selector]++)].line;
					}
				}
			}
		} catch (e) {
			console.error(e);
		}
			
		return node._matchedCSSRules;
	}
}


WebInspector.StylePropertiesSection.prototype.__defineSetter__('subtitle', function(x) {
	if (this._subtitle === x)
		return;
	
	if (typeof(x) == 'string' && x.indexOf('<a') != -1) {
		var line_number = null;
		// add line number to header
		
		if (this.styleRule.rule) {
			// it's a Webkit nightly or Chrome
	        if (this.styleRule.rule.lineNumber) {
	        	line_number = this.styleRule.rule.lineNumber;
	        }
		} else {
			// it's a Safari, it uses native CSSRule object
			// Let's find rule index
			var rule_ix = -1,
				cur_rule = this.styleRule.style.parentRule,
				cur_ss = this.styleRule.parentStyleSheet;
				
			for (var i = 0, il = cur_ss.cssRules.length; i < il; i++) {
				if (cur_ss.cssRules[i] == cur_rule) {
					rule_ix = i;
					break;
				}
			}
			
			if (rule_ix != -1) {
				var resource = WebInspector.getCSSStyleList(this.styleRule);
				if (resource) {
					var parsed_rule = resource.children[rule_ix];
					if (parsed_rule) {
						line_number = parsed_rule.line;
					}
				}
			}
		}
		
        if (line_number !== null) {
			var url = this.styleRule.parentStyleSheet.href;
	        var link_title = WebInspector.displayNameForURL(url) + ':' + line_number;
	        x = WebInspector.linkifyURLAsNode(url, link_title);
        	x.lineNumber = line_number;
        }
	}
	
	this._subtitle = x;
	
	if (typeof(x) == 'string')
		this.subtitleElement.innerHTML = x;
	else {
		this.subtitleElement.innerHTML = '';
		this.subtitleElement.appendChild(x);
	}
});