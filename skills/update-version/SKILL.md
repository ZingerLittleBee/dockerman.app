---
name: update-version
description: Update Dockerman version and changelog. Use when releasing a new version with changelog content in markdown format.
---

# Update Version Skill

Updates the Dockerman website with a new version release, including siteConfig, changelog, and README files.

## Input Format

User provides changelog content in markdown format:

```markdown
## vX.Y.Z

### ✨ Features

- 🔔 **Feature Name**: Description of the feature
- 🎛️ **Another Feature**: More details

### 🎨 Improvements

- ⚡ **Improvement Name**: Description
```

## Instructions

### 1. Extract Version Number

Parse `vX.Y.Z` from the first `## vX.Y.Z` heading in the user input.

### 2. Update siteConfig.ts

Edit `src/app/siteConfig.ts` and update the `latestVersion` field:

```typescript
latestVersion: "X.Y.Z",  // Note: no 'v' prefix
```

### 3. Convert Markdown to MDX Format

Transform the user's markdown into the changelog MDX format:

1. **Wrap with ChangelogEntry**: Add opening and closing tags with version and current date
2. **Add Title**: Create a short H2 title summarizing the release
3. **Convert Bold**: Replace `**text:**` patterns with `<Bold>text:</Bold>`
4. **Keep Emojis**: Preserve emoji prefixes in feature names

#### MDX Template

```mdx
<ChangelogEntry version="vX.Y.Z" date="Mon DD, YYYY">
## Short Release Title

Brief description of what this release introduces.

### ✨ Features

- <Bold>Feature Name:</Bold> Description of the feature
  with multi-line support if needed

### 🎨 Improvements

- <Bold>Improvement Name:</Bold> Description

</ChangelogEntry>
```

### 4. Prepend to Changelog

Insert the new `<ChangelogEntry>` block at the **top** of `src/app/changelog/page.mdx`, before the existing entries.

### 5. Update README Files

Update both `README.md` and `README.zh-CN.md` with the new version and release date badges:

```markdown
[![Version](https://img.shields.io/badge/version-vX.Y.Z-blue.svg?style=flat-square)](https://github.com/dockerman/dockerman/releases/tag/vX.Y.Z)
[![Release Date](https://img.shields.io/badge/release%20date-Mon%20DD%2C%20YYYY-green.svg?style=flat-square)](https://github.com/dockerman/dockerman/releases/tag/vX.Y.Z)
```

**Note**: In the release date badge URL, spaces are encoded as `%20` and commas as `%2C`.

### 6. Update README Features Section

Add new features to the Features section in both `README.md` and `README.zh-CN.md`:

- Keep descriptions **brief** (one line per feature)
- No detailed sub-items needed
- Add under the appropriate section (Container Management, Image Management, etc.)
- Create new sections if needed (e.g., "Volume Management")

## File References

| File | Purpose |
|------|---------|
| `src/app/siteConfig.ts` | Contains `latestVersion` field to update |
| `src/app/changelog/page.mdx` | MDX changelog with `<ChangelogEntry>` components |
| `README.md` | English README with version/date badges |
| `README.zh-CN.md` | Chinese README with version/date badges |

## Date Format

- Changelog & badge display: `Mon DD, YYYY` (e.g., "Jan 30, 2026")
- Badge URL encoded: `Mon%20DD%2C%20YYYY` (e.g., "Jan%2030%2C%202026")

## Section Types Supported

- `### ✨ Features` - New functionality
- `### 🎨 Improvements` - Enhancements to existing features
- `### 🐛 Bug Fixes` - Issue resolutions
- `### ⚡ Performance` - Performance optimizations
- `### 🌐 Internationalization` - i18n updates

## Optional: Changelog Images

If screenshots are provided, add them using:

```mdx
<ChangelogImage
  src="/screenshots/X.Y.Z/image.png"
  alt="Description"
/>
```

## Verification Checklist

- [ ] `siteConfig.ts` has correct version (without `v` prefix)
- [ ] Changelog entry has correct version (with `v` prefix)
- [ ] Date is in correct format
- [ ] All `<Bold>` tags are properly closed
- [ ] `<ChangelogEntry>` tag is properly closed
- [ ] New entry is at the top of the changelog file
- [ ] `README.md` version badge updated
- [ ] `README.md` release date badge updated
- [ ] `README.zh-CN.md` version badge updated
- [ ] `README.zh-CN.md` release date badge updated
- [ ] `README.md` features section updated (brief, no details)
- [ ] `README.zh-CN.md` features section updated (brief, no details)
