'use strict';

var gulp = require('gulp');
var gutil = require('gulp-util');
var conflict = require('gulp-conflict');
var template = require('gulp-template');
var rename = require('gulp-rename');
var inquirer = require('inquirer');
// var editorconfig = require('editorconfig');

gulp.task('convert', function(done) {
	// TODO: convert existing files
	done();
});

gulp.task('default', function(done) {

	gutil.log('Choose your style:');

	var jshint = ['none', 'short', 'full', 'mine'];
	var jscs = ['none', 'crockford', 'google', 'jquery', 'mdcs', 'wikimedia', 'yandex', 'mine'];

	var questions = [
		{ type: 'list', name: 'indentStyle', message: 'Indent style', choices: ['tab', 'space'],   default: 'tab'  },
		{ type: 'list', name: 'indentSize',  message: 'Indent size',  choices: ['none', '2', '4'], default: '4'    },
		{ type: 'list', name: 'jshint',      message: 'Jshint style', choices: jshint,             default: 'mine' },
		{ type: 'list', name: 'jscs',        message: 'JSCS style',   choices: jscs,               default: 'mine' },
		{ type: 'confirm', name: 'moveon', message: 'Continue?' }
	];

	inquirer.prompt(questions, function(answers) {

		if (!answers.moveon) {
			return done();
		}

		var glob = [__dirname + '/templates/_editorconfig'];

		if (answers.jshint !== 'none') {
			glob.push(__dirname + '/templates/_jshintrc.' + answers.jshint);
		}

		if (answers.jscs !== 'none') {
			var variation = answers.jscs === 'mine' ? answers.jscs : 'preset';
			glob.push(__dirname + '/templates/_jscsrc.' + variation);
		}

		gulp.src(glob)
			.pipe(template(answers))
			.pipe(rename(function(file) {
				if (file.basename[0] === '_') {
					file.basename = '.' + file.basename.slice(1);
					file.extname = '';
				}
			}))
			.pipe(conflict('./'))
			.pipe(gulp.dest('./'))
			.on('finish', function() {
				done();
			});

	});
});
