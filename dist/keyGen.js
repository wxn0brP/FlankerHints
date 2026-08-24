const alphabet = "abcdefghijklmnopqrstuvwxyz";
export const MAX_HINTS = Math.pow(alphabet.length, 3);
export function generateKeys(count) {
    if (count <= 0)
        return [];
    if (count > MAX_HINTS)
        count = MAX_HINTS;
    let length = 1;
    while (Math.pow(alphabet.length, length) < count)
        length++;
    const keys = [];
    for (let i = 0; i < count; i++) {
        let n = i;
        let key = "";
        for (let j = 0; j < length; j++) {
            key = alphabet[n % alphabet.length] + key;
            n = Math.floor(n / alphabet.length);
        }
        keys.push(key);
    }
    return keys;
}
