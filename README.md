# Writedown

A simple markdown extension that compiles markdown into tailwind styled html

## Example

Compile `demo/main.md` into `test-web/html/`.

```sh
node src/main.ts c demo/main.md -o test-web/html
```

## Custom Syntax

Writedown uses keywords with options:

```md
$keyword:optionA{value}:optionB{value}&
```

the keyword (`$`) and option (`:`) marks can be configured.

### Supported Keywords

- `$tableofcontents:maxDepth{1-6 [default: 6]}$`