/**
 * @author Sergey Chikuyonok (serge.che@gmail.com)
 * @link http://chikuyonok.ru
 */

/**
 * Visualize parsed rules: draw lines for each rule
 * @param {String} text CSS stylesheet
 * @param {rule} rule_node Parsed rule node
 */
function visualize(text, rule_node) {
	var viz = document.getElementById('visualize');
	viz.innerHTML = text;
	
	function addLine(line_num, depth) {
		var l = document.createElement('div');
		l.className = 'line line-level' + (depth || 0);
		viz.appendChild(l);
		l.style.top = ((line_num - 1) * l.offsetHeight) + 'px';
	}
	
	function walkRules(rule, depth) {
		depth = depth || 0;
		for (var i = 0, il = rule.children.length; i < il; i++) {
			var r = rule.children[i];
			addLine(r.line, depth);
			walkRules(r, depth + 1);
		}
	}
	
	walkRules(rule_node);
	console.log(rule_node);
}