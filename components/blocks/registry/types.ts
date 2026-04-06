import { SchemaField, BlockTypeSchema } from "@/types/schema.types";

export interface BlockDefinition {
    id: string; // matches section_id in db
    label: string;
    icon?: string;
    schema: SchemaField[];
    mobileSchema?: SchemaField[];
    blocks?: BlockTypeSchema[]; // Shopify-style sub-blocks
    Component: React.ComponentType<Record<string, unknown>>;
}
