# Firestore Model

This project currently reads data from:

- `GET /api/dogs`
- `GET /api/dogpages`

The live dataset currently contains:

- 131 dog records
- 3 page groups: `Available`, `Boys`, `Girls`

## Recommended Firestore Shape

### Collection: `dogs`

Document ID:

- use the existing numeric dog ID as a string, for example `dogs/209`

Fields:

- `legacyId`: number
- `rname`: string
- `cname`: string
- `comments`: string
- `dob`: timestamp or `null`
- `gender`: number
- `sireId`: number or `null`
- `sireName`: string or `null`
- `damId`: number or `null`
- `damName`: string or `null`
- `profileImageUrl`: string or `null`
- `createdAt`: server timestamp
- `updatedAt`: server timestamp

Notes:

- keep `legacyId` even though it matches the doc ID, because it makes imports and debugging easier
- keep `gender` numeric during migration because the current API already uses `0` and `1`
- keep `profileImageUrl` exactly as-is for the first import, even if some values are still relative asset paths

### Collection: `pages`

Document IDs:

- `available`
- `boys`
- `girls`

Fields:

- `slug`: string
- `displayName`: string
- `dogIds`: array of strings, ordered
- `legacyPageName`: string
- `updatedAt`: server timestamp

Example:

```json
{
  "slug": "boys",
  "displayName": "Boys",
  "dogIds": ["166", "201"],
  "legacyPageName": "Boys"
}
```

## Why This Shape

The current site effectively does this:

1. fetch all dogs
2. fetch page ordering rows
3. join them in the frontend

In Firestore, that join table is unnecessary for this app size. A page document with an ordered `dogIds` array is simpler to read and easier to maintain.

## Optional Future Improvements

- move profile images fully into Firebase Storage and store only Storage URLs
- add `pageMembership` to each dog if you want reverse lookups without reading `pages`
- split admin-only metadata from public dog profile data if security rules get more strict
