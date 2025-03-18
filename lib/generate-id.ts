export function generateId(length = 32) {
    return [...Array(length)]
        .map(() => Math.random().toString(36)[2])
        .join('');
}