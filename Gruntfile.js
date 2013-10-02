module.exports = function(grunt) {

	grunt.initConfig({
		pkg: grunt.file.readJSON('package.json'),
		uglify: {
			options: {
				banner: '/*!\n * jsTodoTxt v<%= pkg.version %>\n * Built on <%= grunt.template.today("yyyy-mm-dd") %>\n * https://github.com/jmhobbs/jsTodoTxt\n *\n * Copyright 2011-<%= grunt.template.today("yyyy") %>, John Hobbs\n * Licensed under the MIT license.\n * https://github.com/jmhobbs/jsTodoTxt/blob/master/LICENSE\n */'
			},
			build: {
				src: "jsTodoTxt.js",
				dest: "jsTodoTxt.min.js"
			}
		},
		jasmine: {
			jsTodoTxt: {
				src: "jsTodoTxt.js",
				options: {
					specs: [
						"test/spec/TodoTxtItemHelper.js",
						"test/spec/TodoTxtItem-Core.js",
						"test/spec/TodoTxtItem-Simple.js",
						"test/spec/TodoTxtItem-Complete.js",
						"test/spec/TodoTxtItem-Priority.js",
						"test/spec/TodoTxtItem-Project.js",
						"test/spec/TodoTxtItem-Context.js"
					]
				}
			}
		}
	});

	grunt.loadNpmTasks('grunt-contrib-uglify');
	grunt.loadNpmTasks('grunt-contrib-jasmine');
}
