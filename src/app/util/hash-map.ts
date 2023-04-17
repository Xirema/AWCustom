export class HashMap<Key, Value> {
    constructor(
        private hasher:(k:Key) => number = (k) => +k,
        private equaler:(a:Key, b:Key) => boolean = (a, b) => a === b
    ) {
        
    }
}