/**
 * Shared visual language for site illustrations (blog OG + homepage feature art).
 * Imported by generate-blog-image.mjs and generate-home-image.mjs.
 */

export const SITE_ILLUSTRATION_STYLE = `Visual style: clean modern flat illustration for a professional tech / QA blog,
soft rounded shapes, restrained palette (blues, teals, warm neutrals), subtle gradients,
no photorealism, no cluttered backgrounds, suitable as a social Open Graph image.

Strict rule — no text in the image: do not draw letters, words, numbers, captions, labels, logos with readable type,
UI chrome with text, watermarks, or any typography in Polish, English, or any language. Purely visual metaphor only.`

export const COMPOSITION_BLOG_OG = `Composition: extra-wide horizontal banner, vertically shallow (low profile strip), main subject spread left-to-right, not tall.`

export const COMPOSITION_HOME_FEATURE = `Composition: square 1:1 frame, one clear focal idea with comfortable whitespace — modern tech / consulting homepage illustration: friendly and clear, not stiff corporate stock.

Background: solid white (#FFFFFF) across the canvas. No grey or tinted full-frame wash behind the scene; soft gradients only inside illustrated shapes.

Tone (balance): credible B2B independent practitioner — approachable and human, still orderly. Soft rounded shapes and a restrained blue / teal / warm-neutral palette are good. Avoid mascot characters, exaggerated cartoon faces, or childish sticker energy. Abstract metaphors, simple icons, and optional small stylized people (minimal, adult proportions) are fine if they stay secondary to the main idea — not a crowded scene.`

/** Full style block appended to blog image prompts (replaces legacy SITE_IMAGE_STYLE). */
export const BLOG_IMAGE_STYLE_PROMPT = `${SITE_ILLUSTRATION_STYLE}\n\n${COMPOSITION_BLOG_OG}`
