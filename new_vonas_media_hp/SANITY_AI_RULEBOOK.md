# Sanity CMS AI Rulebook

## 🚨 CRITICAL RULE #1: Always Check Actual Data First

**NEVER assume CMS connection issues without verifying the actual data in Sanity.**

### The Problem Pattern:
- AI sees placeholder images/fallback content
- AI assumes "CMS connection broken"
- AI tries to "fix" queries, components, connections
- **REALITY**: CMS is connected perfectly, but data fields are NULL/empty

### The Solution:
1. **ALWAYS query the database directly first**
2. Check if the specific document exists
3. Check if the specific fields have actual data (not null)
4. Only then determine if it's a code issue or data issue

---

## 🔍 Rule #2: Distinguish Between Data Issues vs Code Issues

### Data Issues (Most Common):
- Document exists but fields are `null`
- Document exists but image assets are missing
- Document exists but references are broken
- **Solution**: Add/fix data in Sanity Studio

### Code Issues (Less Common):
- Query syntax errors
- Wrong field names in queries
- Component not handling data properly
- **Solution**: Fix code

---

## 📊 Rule #3: Test Queries Systematically

### Step 1: Basic Document Check
```javascript
const basicQuery = `*[_type == "yourType" && slug.current == "your-slug"][0]{
  _id,
  _type,
  name,
  slug
}`;
```

### Step 2: Field-by-Field Check
```javascript
const detailedQuery = `*[_type == "yourType" && slug.current == "your-slug"][0]{
  _id,
  name,
  heroImage,
  gallery,
  // Add each field you're checking
}`;
```

### Step 3: Image Asset Expansion
```javascript
const imageQuery = `*[_type == "yourType" && slug.current == "your-slug"][0]{
  "heroImage": heroImage[0].image.asset->url,
  "gallery": gallery[].image.asset->url
}`;
```

---

## 🖼️ Rule #4: Image Field Patterns

### Common Image Field Structures:
1. **Simple Image**: `"image": image.asset->url`
2. **Image Array**: `"images": images[].asset->url`
3. **Image with Alt**: `"images": images[]{ "url": image.asset->url, "alt": alt }`
4. **Complex Image Object**: `"heroImage": heroImage[0].image.asset->url`

### Always Check:
- Is the field an array or single object?
- Does it have nested structure (image.asset vs direct asset)?
- Are there alt text fields?
- Are the asset references valid?

---

## 🔄 Rule #5: Fallback Strategy

### Good Fallback Pattern:
```javascript
// In component
const imageUrl = data?.heroImage?.[0]?.image?.asset?.url || '/fallback-image.jpg';
```

### Bad Fallback Pattern:
```javascript
// Assuming data exists
const imageUrl = data.heroImage[0].image.asset.url; // Will crash if null
```

---

## 🚀 Rule #6: Working vs Broken Comparison

### When Something Works (YouTube Channels):
1. Check what data structure it uses
2. Check what fields are populated
3. Check the query pattern
4. **Copy the successful pattern**

### When Something Doesn't Work (Creator Profiles):
1. Compare data structure with working example
2. Check if fields are null vs missing
3. Check if query pattern matches
4. **Don't reinvent - adapt the working pattern**

---

## 🛠️ Rule #7: Debug Process

### Step 1: Data Verification
```javascript
// Create simple test script
const client = createClient({ projectId, dataset, useCdn: true });
const result = await client.fetch('*[_type == "yourType"][0]');
console.log(JSON.stringify(result, null, 2));
```

### Step 2: Component Testing
```javascript
// Add debug logs in component
console.log('Raw data received:', data);
console.log('Processed image URL:', imageUrl);
```

### Step 3: Query Testing
```javascript
// Test query in Sanity Vision tool
// URL: https://your-project.sanity.studio/vision
```

---

## ⚡ Rule #8: Quick Fixes

### For Null Data:
1. **Don't fix code** - fix data in Sanity Studio
2. Add actual images to the document
3. Verify asset uploads completed
4. Check reference integrity

### For Code Issues:
1. Copy working query patterns
2. Match field names exactly
3. Handle null cases gracefully
4. Test with actual data

---

## 🎯 Rule #9: Prevention

### Always:
- Test with real data, not just fallbacks
- Verify data exists before assuming code issues
- Use working patterns as templates
- Check Sanity Studio directly when in doubt

### Never:
- Assume connection issues without verification
- Rewrite working code without checking data
- Ignore null/undefined data patterns
- Skip direct database queries when debugging

---

## 📝 Rule #10: Documentation

### When You Find Issues:
1. Document what data was missing
2. Document what query pattern worked
3. Document the fix (data vs code)
4. Update fallback patterns if needed

### Example Issue Log:
```
ISSUE: Creator profile shows placeholder images
ROOT CAUSE: heroImage and gallery fields are null in Sanity
SOLUTION: Add actual image data to Michael Brown document
NOT A SOLUTION: Rewriting queries or components
```

---

## 🏆 Success Pattern Summary

1. **Query database directly** → Verify data exists
2. **Check working examples** → Copy successful patterns  
3. **Fix data, not code** → Most issues are missing data
4. **Test systematically** → Don't guess, verify
5. **Handle nulls gracefully** → Always have fallbacks

**Remember: Sanity CMS connection works perfectly. The issue is usually missing or null data, not broken connections.**