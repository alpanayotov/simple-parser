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