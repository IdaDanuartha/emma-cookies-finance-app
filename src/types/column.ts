export type Column = {
    name: string;
    key: string;
    have_relation?: boolean;
    relation_key?: string;
    is_format_rupiah?: boolean;
    is_format_date?: boolean;
};