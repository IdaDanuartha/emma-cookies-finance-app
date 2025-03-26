export type Finance = {
    id: string;
    sourceId: string;
    type: string;
    amount: number;
    description: string;
    date: string;
    sources: {
        name: string;
    };
};