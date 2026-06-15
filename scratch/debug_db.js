import Database from 'better-sqlite3'

const db = new Database('.data/content/contents.sqlite')

try {
  console.log("Describing _content_activities table columns:")
  const info = db.prepare("PRAGMA table_info(_content_activities)").all()
  console.log(info.map(c => `${c.name} (${c.type})`))

  console.log("\nRows in _content_activities:")
  const rows = db.prepare("SELECT id, title, path, invitation, eventDate, expiryDate, date FROM _content_activities").all()
  console.log(rows)

} catch (err) {
  console.error('Error:', err)
} finally {
  db.close()
}
