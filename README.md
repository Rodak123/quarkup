# Quarkup

A simple markdown extension that compiles markdown into tailwind styled html.

## Disclaimer

This package and documentation is still work in progress.

## Contents

- [Quarkup](#quarkup)
  - [Disclaimer](#disclaimer)
  - [Contents](#contents)
  - [Usage](#usage)
    - [Examples](#examples)
  - [Features](#features)
  - [Custom Syntax](#custom-syntax)
    - [Table of Contents](#table-of-contents)

## Usage

`npx quarkup s|m [options] [command]`

### Examples

- [Compile single project](./examples/single/README.md)
- [Compile multiple projects](./examples/single/README.md)

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

Quarkup uses keywords with options:

```md
$keyword:optionA{value}:optionB{value}&
```

the keyword (`$`) and option (`:`) marks can be configured.

### Table of Contents

Example: `$tableofcontents:maxDepth{1-6 [default: 6]}$`

Keyword: `tableofcontents`

Options:
- `maxDepth` - 1 up to 6 (default is 6) # Highest acceptable heading
