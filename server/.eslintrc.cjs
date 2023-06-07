module.exports = {
	extends: ['eslint:recommended', 'plugin:@typescript-eslint/recommended'],
	parser: '@typescript-eslint/parser',
	plugins: ['@typescript-eslint'],
	root: true,
	rules: {
		indent: ["error", "tab"],
		"@typescript-eslint/no-unused-vars": "off", // Temporary
		"@typescript-eslint/no-explicit-any": "off" // Temporary
	}
};
