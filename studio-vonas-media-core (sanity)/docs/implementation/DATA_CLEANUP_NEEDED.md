# Data Cleanup Required ⚠️

## ✅ Schemas Deployed to Cloud
- Updated schemas are now live in Sanity Cloud
- Studio running at http://localhost:3333
- Backward compatibility maintained

## ❌ Existing Data Needs Cleanup

### Categories to Update:
```
OLD → NEW
"1. 🏢 Company Foundation" → "Company"
"2. 👥 Team & Operations" → "Team"  
"3. 🎬 Production Workflows" → "Production"
"4. [YouTube Shows]" → "Shows"
"5. [Tools Systems]" → "Tools"
"6. 🤝 External Partnerships" → "Partners"
"7. 📋 Policies & Procedures" → "Policies"
```

### Items to Clean:
- Remove `parent` references (flatten structure)
- Remove `itemType` fields (not needed)
- Remove emoji titles like "👥 Team & Operations"
- Update `overviewSteps` from simple strings to objects with `step` and `details`

## Action Required:
**Go to Sanity Studio at http://localhost:3333 and manually update:**

1. **KB Category documents** - Remove emojis, shorten names
2. **Knowledge Base Item documents** - Clean titles, remove parent refs

## After Data Cleanup:
- Data will match new clean schema structure  
- Ready for frontend integration
- Flat structure (KB → Company) will work properly

## Current Status:
- ✅ Schemas updated and deployed
- ⚠️ Data cleanup needed via Studio
- ⏳ Ready for frontend once data is clean