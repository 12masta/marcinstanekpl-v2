/** Use same-host paths in <img src> so local dev serves /static, not production URLs. */
export function blogOgImageSrc(ogImage, siteUrl) {
  if (!ogImage) return null
  if (ogImage.startsWith(`https://`) || ogImage.startsWith(`http://`)) {
    const base = (siteUrl || ``).replace(/\/$/, ``)
    if (base && ogImage.startsWith(`${base}/`)) {
      return ogImage.slice(base.length)
    }
    return ogImage
  }
  if (ogImage.startsWith(`/`)) return ogImage
  return ogImage
}
