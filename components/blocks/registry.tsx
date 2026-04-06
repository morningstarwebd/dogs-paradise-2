// ═══════════════════════════════════════════════════════════════════════
// REGISTRY RE-EXPORT (Split into modules for maintainability)
// ═══════════════════════════════════════════════════════════════════════
// 
// This file re-exports everything from the modular registry structure.
// See components/blocks/registry/ for the actual implementations:
//
// - registry/types.ts           → BlockDefinition interface
// - registry/design-schema.ts   → Shared design schema fields
// - registry/components.ts      → Dynamic component imports
// - registry/blocks/            → Sub-block schemas (hero, faq, etc.)
// - registry/schema/            → Section schemas (header, footer)
// - registry/index.ts           → Main BlockRegistry export
// ═══════════════════════════════════════════════════════════════════════

// Re-export everything from the modular registry
export * from './registry/index';
