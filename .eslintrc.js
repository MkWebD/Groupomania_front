module.exports = {
	root: true,
	env: {
		node: true,
		"vue/setup-compiler-macros": true,
	},
	extends: ["plugin:vue/vue3-essential", "eslint:recommended", "@vue/typescript/recommended"],
	plugins: ["vue", "@typescript-eslint"],
	parserOptions: { parser: "@typescript-eslint/parser", ecmaVersion: 2020, sourceType: "module" },
	rules: {
		"no-console": process.env.NODE_ENV === "production" ? "warn" : "off",
		"no-debugger": process.env.NODE_ENV === "production" ? "warn" : "off",
		"@typescript-eslint/no-this-alias": [
			"error",
			{
				allowDestructuring: false, // Disallow `const { props, state } = this`; true by default
				allowedNames: ["self"], // Allow `const self = this`; `[]` by default
			},
		],
	},
};
