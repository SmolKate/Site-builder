/** @type {import('stylelint').Config} */
export default {
  extends: ["stylelint-config-standard-scss"],
  rules: {
    "declaration-empty-line-before": [
      "always",
      {
        except: ["first-nested"],
        ignore: ["after-declaration"],
      },
    ],
    "rule-empty-line-before": [
      "always",
      {
        except: ["first-nested"],
        ignore: ["after-comment"],
      },
    ],
    "color-function-alias-notation": "with-alpha",
    "color-function-notation": "legacy",
    "alpha-value-notation": "number",
    "value-keyword-case": ["lower", { camelCaseSvgKeywords: true }],
    "color-hex-length": "short",
  },
};
