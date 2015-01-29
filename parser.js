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
		this.text = this.text.replace( /^[ \t]*\-{4,}$[ \t]*/g, '<hr />');
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
		var parser = this;
		var simplePattern = /`(.+?)`/g;
		var complexPattern = /^\{\{\{$([\s\S]+?)^\}\}\}$/gm;

		var patterns = [simplePattern, complexPattern ];
		var length = patterns.length;
		
		
		this.text = this.text.replace(simplePattern, function( matches, item ){
			while( true ) {
				token = Math.random();

				if ( parser.text.indexOf( token ) === -1 ){
					parser.codeFragments['inline'][ token ] = item;
					break;
				}
			}

			return token;
		});

		this.text = this.text.replace(complexPattern, function( matches, item ){
			while( true ) {
				token = Math.random();

				if ( parser.text.indexOf( token ) === -1 ){
					parser.codeFragments['fenced'][ token ] = item;
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

		for ( var item in parts ) {

			var replacement;

			if ( type === 'inline' ) {
				replacement = '<code>' + parts[item] + '</code>';
			} else if ( type === 'fenced' ) {
				replacement = '<pre><code>' + parts[item] + '</code></pre>';
			}

			if ( replacement ) {
				this.text = this.text.replace( item, replacement );
			}
		}

		return this.text;

	}

	Parser.prototype.parse = function() {
		this.extractCodeFragment();
		this.doBold();
		this.doHeadings();
		this.doUl();
		this.doOL();
		this.doLinks();
		this.doHrs();
		this.replaceCodeFragments();

	}

	return Parser;

})();
