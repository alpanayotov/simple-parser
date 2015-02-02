var Parser = ( function(){
	
	function Parser( text ) {
		this.text = text;
		this.codeFragments = {
			'inline' : {},
			'fenced' : {}
		};
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

	Parser.prototype.doHrs = function() {
		this.text = this.text.replace( /^[ \t]*\-{4,}$[ \t]*/gm, '<hr />');
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

	Parser.prototype.extractCodeFragment = function(){
		var simplePattern = /`(.+?)`/g;
		var complexPattern = /^\{\{\{$([\s\S]+?)^\}\}\}$/gm;

		this._extractCodeFragmentBasedOnGroup( 'inline', simplePattern );
		this._extractCodeFragmentBasedOnGroup( 'fenced', complexPattern );
	}

	Parser.prototype._extractCodeFragmentBasedOnGroup = function( type, pattern ){
		var parser = this;
		
		this.text = this.text.replace( pattern, function( matches, item ){
			while( true ) {
				token = Math.random() * (10000 - 1 + 1) + 10000;

				if ( parser.text.indexOf( token ) === -1 ){
					parser.codeFragments[ type ][ token ] = item;
					break;
				}
			}

			return token;
		});

	}

	Parser.prototype.replaceCodeFragments = function() {
		this._replaceBasedOnGroup( 'inline' );
		this._replaceBasedOnGroup( 'fenced' );
	}

	Parser.prototype._replaceBasedOnGroup = function( type ) {
		var parts = this.codeFragments[ type ];

		var before = '<code>';
		var after = '</code>';

		if ( type === 'fenced' ) {
			before = '<pre><code>';
			after = '</code></pre>';
		}

		for ( var item in parts ) {
			this.text = this.text.replace( item, before + parts[item] + after );
		}


		return this.text;

	}

	Parser.prototype.parse = function() {
		this.extractCodeFragment();
		this.doHeadings();
		this.doUL();
		this.doOL();
		this.doBold();
		this.doLinks();
		this.doHrs();
		this.replaceCodeFragments();

	}

	return Parser;

})();
