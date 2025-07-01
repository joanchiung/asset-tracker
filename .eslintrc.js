// .eslintrc.js
module.exports = {
	extends: ['eslint:recommended', 'plugin:prettier/recommended'],
	plugins: ['prettier'],
	rules: {
		'no-multiple-empty-lines': ['error', { max: 1, maxEOF: 0 }],
		'prettier/prettier': 'error'
	}
}
