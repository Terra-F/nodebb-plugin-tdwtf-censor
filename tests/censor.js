'use strict';
/*globals describe, it, beforeEach*/

const winston = require('winston');

process.on('uncaughtException', function (err) {
	winston.error('Encountered error while running test suite: ' + err.message);
});

const chai = require('chai');
chai.should();
//const expect = chai.expect;
const tdwtfCensor = require('../library');

describe('tdwtfCensor:', () => {

	describe('The censor regex parser', () => {
	
		beforeEach(() => {
			tdwtfCensor.badWords = [
				'belgium',
				'elgiu'
			];
		});
	
		it('should return a string', () => {
			tdwtfCensor.censor().should.be.a('string');
		});
		it('should cesnsor stuff', () => {
			const post = 'Belgium is full of Belgiuming Belgians.';
			const exp = '■■■■■■■ is full of Belgiuming Belgians.';
			tdwtfCensor.censor(post).should.equal(exp);
		});
	});
	
});

