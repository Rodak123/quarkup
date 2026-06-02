# Quarkup

A simple markdown extension that compiles markdown into tailwind styled html

## Disclaimer

This package is still work in progress.

## Example

Compile `demo/main.md` into `test-web/html/`.

```sh
node src/main.ts c demo/main.md -o test-web/html
```

## Features

- [x] Paragraphs
- [x] Headings with slugs
- [x] Links
- [x] Code blocks
- [x] [GitHub Flavored Markdown](https://github.github.com/gfm/)
- [x] Table of Contents
- [ ] References and Sources
- [ ] Local images

## Custom Syntax

Writedown uses keywords with options:

```md
$keyword:optionA{value}:optionB{value}&
```

the keyword (`$`) and option (`:`) marks can be configured.

### Supported Keywords

- `$tableofcontents:maxDepth{1-6 [default: 6]}$` - Creates a table of contents