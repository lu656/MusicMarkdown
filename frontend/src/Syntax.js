import 'brace/mode/java';

export class CustomHighlightRules extends window.ace.acequire('ace/mode/text_highlight_rules').TextHighlightRules {
  constructor() {
    super();
    this.$rules = {
      "start": [
        {
          "token": "keyword.operator",
          "regex": "(\\{)",
          "push": "main__1"
        },
        {
          "token": "keyword.operator",
          "regex": "(\\[)",
          "push": "main__2"
        },
        {
          "token": "keyword.operator",
          "regex": "(\\()",
          "push": "main__3"
        },
        {
          "token": "keyword.operator",
          "regex": "(\\|)",
          "push": "main__4"
        },
        {
          "token": "keyword.operator",
          "regex": "(,|\\:)"
        },
        {
          "token": "keyword.operator",
          "regex": "(\\$)",
          "push": "main__5"
        },
        {
          defaultToken: "text",
        }
      ],
      "main__1": [
        {
          "token": "keyword.operator",
          "regex": "(\\})",
          "next": "pop"
        },
        {
          "token": "keyword.operator",
          "regex": "(\\{)",
          "push": "main__1"
        },
        {
          "token": "keyword.operator",
          "regex": "(\\[)",
          "push": "main__2"
        },
        {
          "token": "keyword.operator",
          "regex": "(\\()",
          "push": "main__3"
        },
        {
          "token": "keyword.operator",
          "regex": "(\\|)",
          "push": "main__4"
        },
        {
          "token": "keyword.operator",
          "regex": "(,|\\:)"
        },
        {
          "token": "keyword.operator",
          "regex": "(\\$)",
          "push": "main__5"
        },
        {
          defaultToken: "text",
        }
      ],
      "main__2": [
        {
          "token": "keyword.operator",
          "regex": "(\\])",
          "next": "pop"
        },
        {
          "token": "keyword.operator",
          "regex": "(\\{)",
          "push": "main__1"
        },
        {
          "token": "keyword.operator",
          "regex": "(\\[)",
          "push": "main__2"
        },
        {
          "token": "keyword.operator",
          "regex": "(\\()",
          "push": "main__3"
        },
        {
          "token": "keyword.operator",
          "regex": "(\\|)",
          "push": "main__4"
        },
        {
          "token": "keyword.operator",
          "regex": "(,|\\:)"
        },
        {
          "token": "keyword.operator",
          "regex": "(\\$)",
          "push": "main__5"
        },
        {
          defaultToken: "text",
        }
      ],
      "main__3": [
        {
          "token": "keyword.operator",
          "regex": "(\\))",
          "next": "pop"
        },
        {
          "token": "keyword.operator",
          "regex": "(\\{)",
          "push": "main__1"
        },
        {
          "token": "keyword.operator",
          "regex": "(\\[)",
          "push": "main__2"
        },
        {
          "token": "keyword.operator",
          "regex": "(\\()",
          "push": "main__3"
        },
        {
          "token": "keyword.operator",
          "regex": "(\\|)",
          "push": "main__4"
        },
        {
          "token": "keyword.operator",
          "regex": "(,|\\:)"
        },
        {
          "token": "keyword.operator",
          "regex": "(\\$)",
          "push": "main__5"
        },
        {
          defaultToken: "text",
        }
      ],
      "main__4": [
        {
          "token": "keyword.operator",
          "regex": "(\\|)",
          "next": "pop"
        },
        {
          "token": "keyword.operator",
          "regex": "(\\{)",
          "push": "main__1"
        },
        {
          "token": "keyword.operator",
          "regex": "(\\[)",
          "push": "main__2"
        },
        {
          "token": "keyword.operator",
          "regex": "(\\()",
          "push": "main__3"
        },
        {
          "token": "keyword.operator",
          "regex": "(\\|)",
          "push": "main__4"
        },
        {
          "token": "keyword.operator",
          "regex": "(,|\\:)"
        },
        {
          "token": "keyword.operator",
          "regex": "(\\$)",
          "push": "main__5"
        },
        {
          defaultToken: "text",
        }
      ],
      "main__5": [
        {
          "token": "keyword.operator",
          "regex": "(\\$)",
          "next": "pop"
        },
        {
          "token": "constant.character.escape",
          "regex": "((\\\\(?:\\\\|$)))"
        },
        {
          "token": "string.unquoted",
          "regex": "([^$\\\\]+)"
        },
        {
          defaultToken: "text",
        }
      ]
    };
    this.normalizeRules();
  }
}

export default class CustomRule extends window.ace.acequire('ace/mode/java').Mode {
  constructor() {
    super();
    this.HighlightRules = CustomHighlightRules;
  }
}
