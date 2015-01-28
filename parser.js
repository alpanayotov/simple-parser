var Parser = ( function(){
	
	function Parser( text ) {
		this.text = text;
	} 

	Parser.prototype.doHeadings = function() {
		this.text = this.text.replace(/^ *(#{1,6})(?!#)(.+) *$/mg, function( match, hashes, heading){
			var tagName = 'h' + hashes.length;
			return '<' + tagName + '>' + heading + '</' + tagName + '>';
		});
	}
	
	Parser.prototype.doBold = function() {
		this.text = this.text.replace(/\*(.+?)\*/g, '<strong>$1</strong>' );
	}

	Parser.prototype.doLinks = function() {
		this.text = this.text.replace(/<((https?:)?\/\/\S+?)>/g, '<a href="$1">$1</a>' );
	}

	Parser.prototype.doUL = function(){
		this.text = this.text.replace(/((^[ \t]*\*[ \t]*.*$[\n\r])+)/gm, function(matches){
			return '<ul>' + matches.replace( /^[ \t]*\*[ \t]*(.*)/gm, "<li>$1</li>" ) + '</ul>';
		});
	}

	Parser.prototype.doOL = function(){
		this.text = this.text.replace(/((^[ \t]*\d\.[ \t]*.*$[\n\r])+)/gm, function(matches){
			return '<ol>' + matches.replace( /^[ \t]*\d\.[ \t]*(.*)/gm, "<li>$1</li>" ) + '</ol>';
		});
	}

	Parser.prototype.parse = function() {
		
		return text;
	}

	return Parser;

})();