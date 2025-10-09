```docmeta
{
  "title": "Docs writer agent specification",
  "slug": "docs-writer-agent",
  "data_class": "internal",
  "origin": "ai",
  "owners": ["platform_docs"],
  "public_url": null,
  "refs": [],
  "test_refs": ["docs_writer_smoke_001", "docs_writer_anchor_002"],
  "last_review": "2025-02-15",
  "llm_reading_order": ["overview", "sequence", "decisions", "edges", "migration", "faq"]
}
```

## Overview {#docs_writer_agent_overview}
Docs writer agent drafts internal pages. It follows comment links and writes guides that stay short and direct.

## Sequence {#docs_writer_agent_sequence}
1. Read headers from related code paths.
2. Build docmeta with owners, data class, and review date.
3. Write anchored sections with plain guidance and placeholder examples.
4. Emit docs_update, ref_map, review notes, and quality metrics.

## Key decisions {#docs_writer_agent_decisions}
* Keep grade level near eight for fast onboarding. Owner platform_docs. 2024-12-01
* Require anchors that match RELATED_DOCS entries to avoid ref drift. Owner platform_docs. 2025-01-10

## Edges {#docs_writer_agent_edges}
* Missing RELATED_DOCS data. Agent emits violation and stops. Test id docs_writer_smoke_001
* Anchor mismatch found during review. Agent regenerates section names. Test id docs_writer_anchor_002

## Migration {#docs_writer_agent_migration}
* Plan glossary support so repeated terms link once metadata schema expands.

## FAQ {#docs_writer_agent_faq}
* Why emit quality scores? Scores let reviewers spot tone or coverage regressions without re-reading every doc.
