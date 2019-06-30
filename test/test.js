const assert = require('assert');
const fs = require('fs');
const {CUEFileParser} = require('../CUEFileParser');
const testFilePath = 'test/test.cue';
const test2FilePath = 'test/test2.cue';
const preCompOutput = require('./out.json');
const pre2CompOutput = require('./out2.json');

const info = {
	tracksCount: 36
};


describe('Parsing Simple File', function() {
	it('should parse file', function() {
		const output = CUEFileParser.parseFile(testFilePath);
		assert.deepStrictEqual(preCompOutput, output)
	});
});

describe('Parsing Complex File', function() {
	it('should parse file', function() {
		const output = CUEFileParser.parseFile(test2FilePath);
		console.log(output);
		//assert.deepStrictEqual(preCompOutput, output)
	});
});

describe('Parsing Buffer', function() {
	it('should parse buffer', function() {
		const buffer = fs.readFileSync(testFilePath);
		const output = CUEFileParser.parseBuffer(buffer);
		assert.deepStrictEqual(preCompOutput, output)
	});
});