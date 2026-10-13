/**
 * Normalizes a faculty / lecturer name to a URL anchor slug.
 * Strips academic titles (Prof., Dr., Ing., rer. nat., etc.) and non-alphanumeric chars.
 * Example:
 *   "Prof. Dr.-Ing. Thorsten Halle" -> "faculty-thorsten-halle"
 *   "Dr. Dang Cuong Phan"          -> "faculty-dang-cuong-phan"
 *   "M.Sc. Marc Ulrich"            -> "faculty-marc-ulrich"
 *   "Marc Ulrich"                  -> "faculty-marc-ulrich"
 */
export function getFacultyAnchor(name: string): string {
  if (!name) return ''
  const cleaned = name
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .replace(/\b(prof|dr|ing|rer|nat|habil|h|c|mult|m\.sc|mr|b\.sc|msc)\b\.?/gi, '')
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '')
  return `faculty-${cleaned}`
}
