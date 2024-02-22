module.exports = {
	root: true,
	env: {
		node: true,
	},
	parser: "@typescript-eslint/parser",
	plugins: ["@typescript-eslint"],
	extends: ["eslint:recommended", "plugin:@typescript-eslint/recommended", "prettier"],
	rules: {
		semi: "error",
		quotes: ["error", "double"],
		"@typescript-eslint/consistent-type-imports": "error",
		"@typescript-eslint/no-unused-vars": "error",
		"@typescript-eslint/no-non-null-assertion": "off",
	},
};
