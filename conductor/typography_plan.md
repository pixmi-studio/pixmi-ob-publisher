# Typography Update Plan

## Objective
Update the typography across all built-in themes to explicitly set a font size of `15px` without falling back to any Obsidian variables like `--articleFontsize`. Add uniform margins for all direct content children (`p`, `pre`, `blockquote`, `img`, etc.) of `.wechat-container`. Specifically for the `medium-geek` theme, perfectly center all headers.

## Key Files & Context
- `src/themes.ts`

## Implementation Steps

1.  **Global Typography Updates (All Themes in `src/themes.ts`)**:
    -   Modify the base `.wechat-container` class (and its children as necessary) in all built-in themes (`default`, `minimalist`, `technical`, `modern`, `medium-geek`) to explicitly specify `font-size: 15px !important;`. This explicitly forces the `15px` font size and prevents Obsidian from injecting its default `--articleFontsize` variable.
    -   Apply a uniform margin of `0 16px 24px` to direct content children of the container. We will use the direct child selector:
        `.wechat-container > p, .wechat-container > pre, .wechat-container > blockquote, .wechat-container > img`
        and apply `margin: 0 16px 24px !important;` to ensure consistent spacing and override Obsidian's defaults.

2.  **Theme-Specific Adjustments**:
    -   **Medium Geek (`medium-geek`)**:
        -   Add `text-align: center !important;` to all heading levels (`h1`, `h2`, `h3`, `h4`, `h5`, `h6`) within `.wechat-container`.
    -   **Minimalist (`minimalist`)**:
        -   Update its existing `.wechat-container` font-size from `16px` to `15px !important;`.
    -   **Modern Magazine (`modern`)**:
        -   Update its existing `body` or container font-size rule to `15px !important;`.

## Verification & Testing
- Build the plugin and preview articles using each built-in theme.
- Inspect the DOM to verify that `.wechat-container` uses a base font size of `15px` and does not inherit `--articleFontsize`.
- Verify that direct children (paragraphs, code blocks, blockquotes, and images) correctly apply the `0 16px 24px` margin.
- Check the `medium-geek` theme to ensure headers (`h1` to `h6`) are perfectly centered.