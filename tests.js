QUnit.test( "parser.doHeadings", function( assert ) {
	var parser = new Parser("#Heading 1");
	parser.doHeadings();
	
	assert.equal( 
		parser.text,
		"<h1>Heading 1</h1>", 
		"Headig 1 Created" 
	);

	parser = new Parser("##Heading 2");
	parser.doHeadings();
	
	assert.equal( 
		parser.text,
		"<h2>Heading 2</h2>", 
		"Headig 2 Created" 
	);

	parser = new Parser( '####### Heading' );
	parser.doHeadings();
	
	assert.equal(
		parser.text,
		'####### Heading',
		'<h7> is not valid'
	);

});

QUnit.test("parser.doBold", function( assert ){
	var parser = new Parser( '*bolded text*' );
	parser.doBold();
	
	assert.equal(
		parser.text,
		'<strong>bolded text</strong>',
		'Basic bold case'
	);

	parser = new Parser( 'some text here *bolded text* some text here' );
	parser.doBold();
	
	assert.equal(
		parser.text,
		'some text here <strong>bolded text</strong> some text here',
		'Bold text in the middle of sentance'
	);

	parser = new Parser( ' *bolded text* ' );
	parser.doBold();
	
	assert.equal(
		parser.text,
		' <strong>bolded text</strong> ',
		'Bold text with spacing in front and end'
	);

	parser = new Parser( '*bolded text* some more *text' );
	parser.doBold();
	
	assert.equal(
		parser.text,
		'<strong>bolded text</strong> some more *text',
		'Ignore single *'
	);
});

QUnit.test("parser.doLinks", function( assert ){
	var parser = new Parser( 'Lorem <http://google.com/> dolor sit' );
	parser.doLinks();
	
	assert.equal(
		parser.text,
		'Lorem <a href="http://google.com/">http://google.com/</a> dolor sit',
		'Basic Links Works'
	);

	parser = new Parser( 'Lorem <https://google.com/> dolor sit' );
	parser.doLinks();
	
	assert.equal(
		parser.text,
		'Lorem <a href="https://google.com/">https://google.com/</a> dolor sit',
		'Basic Links With https'
	);

	parser = new Parser( 'Lorem <//google.com/> dolor sit' );
	parser.doLinks();
	
	assert.equal(
		parser.text,
		'Lorem <a href="//google.com/">//google.com/</a> dolor sit',
		'Basic Links With //'
	);


	parser = new Parser( 'Lorem <//google.com/> dolor sit <this is not link>' );
	parser.doLinks();
	
	assert.equal(
		parser.text,
		'Lorem <a href="//google.com/">//google.com/</a> dolor sit <this is not link>',
		'This is not link'
	);
});

QUnit.test( "parser.doUL", function( assert ) {
	var $fixture = $('#qunit-fixture');
	var input = 'lorem \n' +
		' * item 1\n ' +
		' * item 2\n ' +
		' * item 3\n ' +
		'End!';

	var parser = new Parser(input);
	parser.doUL();

	var parsed = parser.text;
	$fixture.html(parsed);

	assert.equal(
		$fixture.children().length,
		1,
		"UL is created"
	);

	assert.equal(
		$fixture.children().children().length,
		3,
		"List items are created"
	);

});

QUnit.test( "parser.doOL", function( assert ) {
	var $fixture = $('#qunit-fixture');
	var input = 'lorem \n' +
		' 0. item 1\n ' +
		' 1. item 1\n ' +
		' 2. item 2\n ' +
		' 3. item 3\n ' +
		'End!\n' +
		' * item 1\n ' +
		' * item 2\n ' +
		' * item 3\n ' +
		'End!\n';

	var parser = new Parser(input);
	parser.doOL();

	var parsed = parser.text;
	$fixture.html(parsed);

	assert.equal(
		$fixture.find('ul').length,
		0,
		"UL not created"
	);

	assert.equal(
		$fixture.find('ol').length,
		1,
		"OL is created"
	);
});

QUnit.test('parser.extractCodeFragment', function( assert ) {
	var input = 'Lorem ipsum `dolor` sit amet';
	var parser = new Parser( input );

	parser.extractCodeFragment();
	assert.ok(
		parser.text.indexOf('dolor') === -1,
		'Code fragment are extracted'
	);

});

QUnit.test('Integration Test 1', function( assert ) {

	var input = 'Lorem ipsum dolor sit *amet*, consectetur adipisicing elit. Ex, iure, tempore. <http://google.com>: Tempore, fugit, repudiandae tempora quo id numquam cum dignissimos vel ratione eaque ut ullam error accusamus quidem iusto. Quidem!';

	var parser = new Parser( input );

	parser.parse();

	assert.equal(
		parser.text,
		'Lorem ipsum dolor sit <strong>amet</strong>, consectetur adipisicing elit. Ex, iure, tempore. <a href="http://google.com">http://google.com</a>: Tempore, fugit, repudiandae tempora quo id numquam cum dignissimos vel ratione eaque ut ullam error accusamus quidem iusto. Quidem!'
	);
});


QUnit.test('Integration Test 2', function( assert ) {

	var input = 'HTTP определя 8 различни клиентски метода за заявки:\n'+
'* *HEAD* — иска изпращане на заглавията отговарящи на посочения с URL ресурс. Отговорът на сървъра е идентичен с този на GET, но е с липсващо тяло. По този начин може да се вземе само метаинформацията, свързана с ресурса, спестявайки трансфера на целия файл.\n'+
'* *GET* — с него клиентът прави заявка за ресурс, зададен чрез URL. Могат да се изпращат и ограничено количество данни, закодирани директно в самия URL (отделени чрез въпросителен знак).\n' +
'* *POST* — позволява клиентът да изпрати данни на сървъра. Тази заявка обикновено се генерира при изпращането на уеб формуляр, а данните могат да бъдат: текст, написан от потребителя във формуляра; файл на клиентския компютър и др.\n' +
'* *PUT* — качва файл, който в бъдеще ще отговаря на посочения URL.\n' +
'* *DELETE* — изтрива посочения ресурс.\n' +
'* *TRACE* — сървърът връща получената заявка със статус OK. Позволява да се провери в какъв вид пристига заявката при сървъра и дали (и как) е била модифицирана по трасето от междинни прокси сървъри.\n' +
'* *OPTIONS* — сървърът трябва да отговори с поддържаните от него клиентски методи, съответстващи на зададения URL, или с поддържаните от сървъра методи като цяло, ако е зададено вместо URL.\n' +
'* *CONNECT* — използва се при комуникация през прокси.\n' +
'Стандартът, описан в RFC2616, изисква HTTP сървърите да поддържат задължително GET и HEAD методите[1]. Повечето съвременни сървъри поддържат и POST метода.';

	var parser = new Parser( input );

	parser.parse();

	assert.equal(
		parser.text,
		'HTTP определя 8 различни клиентски метода за заявки:\n' +
'<ul><li><strong>HEAD</strong> — иска изпращане на заглавията отговарящи на посочения с URL ресурс. Отговорът на сървъра е идентичен с този на GET, но е с липсващо тяло. По този начин може да се вземе само метаинформацията, свързана с ресурса, спестявайки трансфера на целия файл.</li>\n'+
'<li><strong>GET</strong> — с него клиентът прави заявка за ресурс, зададен чрез URL. Могат да се изпращат и ограничено количество данни, закодирани директно в самия URL (отделени чрез въпросителен знак).</li>\n'+
'<li><strong>POST</strong> — позволява клиентът да изпрати данни на сървъра. Тази заявка обикновено се генерира при изпращането на уеб формуляр, а данните могат да бъдат: текст, написан от потребителя във формуляра; файл на клиентския компютър и др.</li>\n'+
'<li><strong>PUT</strong> — качва файл, който в бъдеще ще отговаря на посочения URL.</li>\n'+
'<li><strong>DELETE</strong> — изтрива посочения ресурс.</li>\n'+
'<li><strong>TRACE</strong> — сървърът връща получената заявка със статус OK. Позволява да се провери в какъв вид пристига заявката при сървъра и дали (и как) е била модифицирана по трасето от междинни прокси сървъри.</li>\n'+
'<li><strong>OPTIONS</strong> — сървърът трябва да отговори с поддържаните от него клиентски методи, съответстващи на зададения URL, или с поддържаните от сървъра методи като цяло, ако е зададено вместо URL.</li>\n'+
'<li><strong>CONNECT</strong> — използва се при комуникация през прокси.</li>\n' +
'</ul>Стандартът, описан в RFC2616, изисква HTTP сървърите да поддържат задължително GET и HEAD методите[1]. Повечето съвременни сървъри поддържат и POST метода.'
	);
});


QUnit.test('Integration Test 3', function( assert ) {

	var input = '##Usage\n' +
'Standard loop:\n'+
'{{{\n'+
'<?php\n'+
    '// The Query\n' +
    '$the_query = new WP_Query( $args );\n' +
    '// The Loop\n' +
    'if ( $the_query->have_posts() ) {\n' +
        'echo \'<ul>\';\n'+
        'while ( $the_query->have_posts() ) {\n'+
        	'$the_query->the_post();\n'+
        	'echo \'<li>\' . get_the_title() . \'</li>\';\n'+
        '}\n'+
        'echo \'</ul>\';\n'+
    '} else {\n'+
        '// no posts found\n'+
    '}\n'+
    '/* Restore original Post Data */\n' +
    'wp_reset_postdata();\n' +
'}}}\n';

	var parser = new Parser( input );

	parser.parse();

	assert.equal(
		parser.text,
		'<h2>Usage</h2>\n'+
'Standard loop:\n' +
'<pre><code>\n' +
'<?php\n'+
	'// The Query\n'+
	'$the_query = new WP_Query( $args );\n'+
	'// The Loop\n'+
	'if ( $the_query->have_posts() ) {\n'+
		'echo \'<ul>\';\n'+
		'while ( $the_query->have_posts() ) {\n'+
			'$the_query->the_post();\n'+
			'echo \'<li>\' . get_the_title() . \'</li>\';\n'+
		'}\n'+
		'echo \'</ul>\';\n'+
	'} else {\n'+
		'// no posts found\n'+
	'}\n'+
	'/* Restore original Post Data */\n'+
	'wp_reset_postdata();\n'+
'</code></pre>\n'
	);
});

QUnit.test('Integration Test 4', function( assert ) {

	var input = '##Description\n' +
'Escaping for HTML blocks.\n' +
'##Usage\n'+
'`<?php esc_html( $name ) ?>`\n' +
'##Parameters\n'+
'`$text`\n'+
'(string) (required) Text to escape\n'+
'Default: None\n'+
'---------\n'+
'##Examples\n'+
'{{{\n'+
'	$html = esc_html( \'<a href="http://www.example.com/">A link</a>\' );\n'+
'}}}\n'+
'`$html` now contains this:\n'+
'{{{\n'+
'	&lt;a href=&quot;http://www.example.com/&quot;&gt;A link&lt;/a&gt;\n'+
'}}}\n'+
'Which would be displayed in an HTML document as:\n'+
'{{{\n'+
'	<a href="http://www.example.com/">A link</a>\n'+
'}}}\n'+
'Instead of this:\n'+
'<a href="http://www.example.com/">A link</a>';

	var parser = new Parser( input );

	parser.parse();

	assert.equal(
		parser.text,
		'<h2>Description</h2>\n' +
'Escaping for HTML blocks.\n' + 
'<h2>Usage</h2>\n' +
'<code><?php esc_html( $name ) ?></code>\n' +
'<h2>Parameters</h2>\n'+
'<code>$text</code>\n' +
'(string) (required) Text to escape\n'+
'Default: None\n'+
'<hr />\n'+
'<h2>Examples</h2>\n' +
'<pre><code>\n'+
'	$html = esc_html( \'<a href="http://www.example.com/">A link</a>\' );\n'+
'</code></pre>\n' +
'<code>$html</code> now contains this:\n'+
'<pre><code>\n'+
'	&lt;a href=&quot;http://www.example.com/&quot;&gt;A link&lt;/a&gt;\n'+
'</code></pre>\n'+
'Which would be displayed in an HTML document as:\n'+
'<pre><code>\n'+
'	<a href="http://www.example.com/">A link</a>\n'+
'</code></pre>\n'+
'Instead of this:\n'+
'<a href="http://www.example.com/">A link</a>'
	);
});

QUnit.test('Integration Test 5', function( assert ) {

	var input = '#Types of parameters\n' +
'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed vel sapien magna. Praesent vel pulvinar lectus. Nullam nunc sapien, luctus non tempus sit amet, blandit in orci. Morbi ultricies massa dui, et vulputate erat molestie id. Morbi consectetur arcu non orci facilisis elementum.\n' +
'##String\n' +
'A string is a line of text, and is typically anything from a single character to several dozen words.\n' +
'##Boolean\n' +
'A boolean parameter can be notated as a numeric value: `1` for `TRUE`, `0` for `FALSE`. For a boolean value in PHP function parameter style tags, these are all equivalent:\n' +
'* `1 = TRUE = true`\n' +
'* `0 = FALSE = false`\n\n' +
'##Comments (`#` and `/**/`)\n' +
'Sed # sollicitudin neque ut semper blandit. Donec dolor metus, faucibus ut nulla ut, for example `/* multiline comment here */`. *Class aptent taciti sociosqu ad litora torquent per conubia nostra.* Read more at <https://bg.wikipedia.org/wiki/%D0%9E%D0%B4%D0%B8%D1%81%D0%B5%D1%8F>\n' +
'{{{\n' +
'	<?php $params = array( \n' +
'		\'type\'   => \'postbypost\',\n' +
'		\'limit\'  => 5,\n' +
'		\'format\' => \'$1* <span>(Required *)</span>\',\n' +
'		\'before\' => \'<li>&bull;&nbsp;\',\n' +
'		\'after\'  => \'{{{$2}}}</li>\'\n' +
'	);\n' +
'	wp_get_archives($params); ?>\n' +
'}}}';

	var parser = new Parser( input );

	parser.parse();

	assert.equal(
		parser.text,
		'<h1>Types of parameters</h1>\n' +
'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed vel sapien magna. Praesent vel pulvinar lectus. Nullam nunc sapien, luctus non tempus sit amet, blandit in orci. Morbi ultricies massa dui, et vulputate erat molestie id. Morbi consectetur arcu non orci facilisis elementum.\n' +
'<h2>String</h2>\n' +
'A string is a line of text, and is typically anything from a single character to several dozen words.\n' +
'<h2>Boolean</h2>\n' +
'A boolean parameter can be notated as a numeric value: <code>1</code> for <code>TRUE</code>, <code>0</code> for <code>FALSE</code>. For a boolean value in PHP function parameter style tags, these are all equivalent:\n' +
'<ul><li><code>1 = TRUE = true</code></li>\n' +
'<li><code>0 = FALSE = false</code></li>\n</ul>\n' +
'<h2>Comments (<code>#</code> and <code>/**/</code>)</h2>\n' +
'Sed # sollicitudin neque ut semper blandit. Donec dolor metus, faucibus ut nulla ut, for example <code>/* multiline comment here */</code>. <strong>Class aptent taciti sociosqu ad litora torquent per conubia nostra.</strong> Read more at <a href="https://bg.wikipedia.org/wiki/%D0%9E%D0%B4%D0%B8%D1%81%D0%B5%D1%8F">https://bg.wikipedia.org/wiki/%D0%9E%D0%B4%D0%B8%D1%81%D0%B5%D1%8F</a>\n' +
'<pre><code>\n' +
'	<?php $params = array( \n' +
'		\'type\'   => \'postbypost\',\n' +
'		\'limit\'  => 5,\n' +
'		\'format\' => \'$1* <span>(Required *)</span>\',\n' +
'		\'before\' => \'<li>&bull;&nbsp;\',\n' +
'		\'after\'  => \'{{{$2}}}</li>\'\n' +
'	);\n' +
'	wp_get_archives($params); ?>\n' +
'</code></pre>'
	);
});