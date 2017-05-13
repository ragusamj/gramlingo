module.exports = {
    "extends": "eslint:recommended",
    "env": {
        "browser": true,
        "node": true
    },
    "parserOptions": {
        "ecmaVersion": 6,
        "sourceType": "module"
    },
    "rules": {

        // syntax
        "curly": ["error"],
        "dot-notation": ["error"],
        "eqeqeq": ["error"],
        "indent": ["error", 4, {"SwitchCase": 1}],
        "linebreak-style": ["error", "unix"],
        "no-alert": ["error"],
        "no-cond-assign": ["error", "always"],
        "no-empty-function": ["error"],
        "no-unused-expressions": ["error"],
        "quotes": ["error", "double"],
        "semi": ["error", "always"],

        // style
        "brace-style": ["error", "stroustrup"]
    }
}
