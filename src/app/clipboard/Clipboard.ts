export interface Clipboard {
    content: string;
    user_id: number;
    time_passed: string;
}

export function dummyClipboard(): Clipboard {
    return {
        content: 'test test',
        user_id: 1,
        time_passed: '1 minute ago'
    };
}
