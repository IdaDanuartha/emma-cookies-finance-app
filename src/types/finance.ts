export type Finance = {
    source_id: string;
    type: string;
    amount: string;
    description: string;
    date: string;
    sources: {
        name: string;
        location: string;
    };
};