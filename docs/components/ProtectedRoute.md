```docmeta
{
  "title": "Protected route guard",
  "slug": "protected-route",
  "data_class": "internal",
  "origin": "ai",
  "owners": ["web_app"],
  "public_url": null,
  "refs": [
    {"code": "components/ProtectedRoute.tsx", "symbol": "ProtectedRoute", "asserts": []}
  ],
  "test_refs": [],
  "last_review": "2025-02-15",
  "llm_reading_order": ["overview", "sequence", "decisions", "edges", "migration", "faq"]
}
```

## Overview {#protected_route_overview}
ProtectedRoute waits for Memberstack to finish loading. It decides whether to show children or redirect visitors based on the active role.

## Sequence {#protected_route_sequence}
1. Watch session, role, and router state from hooks.
2. Block render during Memberstack load to avoid flicker.
3. Redirect to login, onboarding, or unauthorized routes when access fails.

## Key decisions {#protected_route_decisions}
* Keep routing logic in the component to avoid duplicated checks. Owner web_app. 2025-02-15
* Allow admins through every gated screen to unblock urgent support. Owner web_app. 2025-02-15

## Edges {#protected_route_edges}
* Memberstack returns no role after load. Route visitor to onboarding for role capture.
* Router push fails because of network loss. Leave spinner so user can retry navigation.

## Migration {#protected_route_migration}
* Replace console logging with structured telemetry once logging backend is ready.

## FAQ {#protected_route_faq}
* Why return null on denied access? It prevents flash of protected UI while router redirects the visitor.
