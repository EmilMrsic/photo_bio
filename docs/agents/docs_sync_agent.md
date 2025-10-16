```docmeta
{
  "title": "Docs sync agent specification",
  "slug": "docs-sync-agent",
  "data_class": "internal",
  "origin": "ai",
  "owners": ["platform_docs"],
  "public_url": null,
  "refs": [],
  "test_refs": ["docs_sync_anchor_001", "docs_sync_testref_002"],
  "last_review": "2025-02-15",
  "llm_reading_order": ["overview", "sequence", "decisions", "edges", "migration", "faq"]
}
```

## Overview {#docs_sync_agent_overview}
Docs sync agent keeps anchors, refs, and tests aligned. It updates the index so crawlers stay fast.

## Sequence {#docs_sync_agent_sequence}
1. Parse changed files for RELATED_DOCS lines and ASSERTS tags.
2. Verify anchors exist or queue stub docs when missing.
3. Check asserted tests against the known list and note gaps.
4. Refresh docs/_index.json with sorted anchors and saved metadata.

## Key decisions {#docs_sync_agent_decisions}
* Never touch code logic to isolate documentation changes. Owner platform_docs. 2024-12-01
* Sort anchor lists to reduce merge churn. Owner platform_docs. 2025-01-10

## Edges {#docs_sync_agent_edges}
* Anchor missing in docs. Agent emits stub with empty sections. Test id docs_sync_anchor_001
* Assert id unknown. Agent flags test gap and adds TODO note. Test id docs_sync_testref_002

## Migration {#docs_sync_agent_migration}
* Plan diff aware index writer to avoid rewriting unchanged pages on large merges.

## FAQ {#docs_sync_agent_faq}
* Why not batch docs updates? Small commits keep review focused and surface anchor drift early.
