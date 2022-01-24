module.exports =
{
  "root": true,
  "ignorePatterns": [
    "projects/**/*"
  ],
  "overrides": [
    {
      "files": [
        "*.ts"
      ],
      "parserOptions": {
        "project": [
          "tsconfig.json",
          "e2e/tsconfig.json"
        ],
        "tsconfigRootDir": __dirname,
        "createDefaultProgram": true
      },
      "extends": ["plugin:@angular-eslint/recommended"],
      "rules": {
        "@angular-eslint/directive-selector": [
          "error",
          {
            "type": "attribute",
            "prefix": "app",
            "style": "camelCase"
          }
        ],
        "@angular-eslint/component-selector": [
          "error",
          {
            "type": "element",
            "prefix": "app",
            "style": "kebab-case"
          }
        ]
      }
    },
    {
      "files": ["*.component.html"],
      "extends": ["plugin:@angular-eslint/template/recommended"],
      "rules": {
        "max-len": ["error", { "code": 140 }]
      }
    },
    {
      "files": ["*.component.ts"],
      "extends": ["plugin:@angular-eslint/template/process-inline-templates"]
    }
  ]
}
