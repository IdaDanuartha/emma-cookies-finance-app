export type Finance = {
    sourceId: string;
    type: string;
    amount: string;
    description: string;
    date: string;
    sources: {
        name: string;
        location: string;
    };
};