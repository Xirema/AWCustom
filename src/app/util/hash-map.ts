export class HashMap<Key, Value> implements Iterable<{key:Key, value:Value}>{
    constructor(
        private hasher:(k:Key) => number = (k) => +k,
        private equaler:(a:Key, b:Key) => boolean = (a, b) => a === b,
        loadFactor:number = 0.75
    ) {
        this.buckets = new Array<{key:Key, value:Value}[]>(10);
        for(let i = 0; i < this.buckets.length; i++) {
            this.buckets[i] = [];
        }
        this.loadFactor = loadFactor;
    }



    private buckets:{key:Key, value:Value}[][];
    private _size = 0;
    private _loadFactor = 0.75;

    public get loadFactor():number {
        return this._loadFactor;
    }

    public set loadFactor(newFactor:number) {
        if(newFactor <= 0) {
            newFactor = 0.75;
        }
        this._loadFactor = newFactor;
    }

    public bucketCount():number[] {
        return this.buckets.map(arr => arr.length);
    }

    public loadLevel():number {
        return this._size / this.buckets.length;
    }

    public contains(key:Key):boolean {
        return this.get(key) != null;
    }

    public get(key:Key) : Value | undefined {
        let hash = Math.abs(this.hasher(key));
        let bucket = this.buckets[hash % this.buckets.length];
        for(let pair of bucket) {
            if(this.equaler(key, pair.key)) {
                return pair.value;
            }
        }
        return undefined;
    }

    public put(key:Key, value:Value) : Value | undefined {
        let hash = Math.abs(this.hasher(key));
        let bucket = this.buckets[hash % this.buckets.length];
        let ret:Value | undefined = undefined;
        for(let pair of bucket) {
            if(this.equaler(key, pair.key)) {
                ret = pair.value;
                pair.value = value;
                return ret;
            }
        }
        bucket.push({key:key, value:value});
        this._size++;
        if(this._size / this.buckets.length > this._loadFactor) {
            console.debug('Performing an automatic Rehash!');
            this.rehash();
        }
        return ret;
    }

    public remove(key:Key) : Value | undefined {
        let hash = Math.abs(this.hasher(key));
        let bucket = this.buckets[hash % this.buckets.length];
        for(let index = 0; index < bucket.length; index++) {
            let pair = bucket[index];
            if(this.equaler(key, pair.key)) {
                let ret = pair.value;
                bucket[index] = bucket[bucket.length - 1];
                bucket.pop();
                this._size--;
                return ret;
            }
        }
        return undefined;
    }

    public erase():{key:Key, value:Value}[] {
        let ret:{key:Key, value:Value}[] = [];
        for(let bucket of this.buckets) {
            while(true) {
                let obj = bucket.pop();
                if(obj != null) 
                    ret.push(obj);
                else
                    break;
            }
        }
        this._size = 0;
        return ret;
    }

    public rehash(bucketCount:number = 0): void {
        if(bucketCount < this.size / this.loadFactor) {
            bucketCount = Math.ceil((this.size / this.loadFactor) * 2);
        }
        if(bucketCount <= 0) {
            bucketCount = 10;
        }
        let newBuckets = new Array<{key:Key, value:Value}[]>(bucketCount);
        for(let i = 0; i < newBuckets.length; i++) {
            newBuckets[i] = [];
        }
        for(let bucket of this.buckets) {
            for(let pair of bucket) {
                let hash = Math.abs(this.hasher(pair.key));
                newBuckets[hash % newBuckets.length].push({key:pair.key, value:pair.value});
            }
        }
        this.buckets = newBuckets;
    }

    public get size():number {
        return this._size;
    }

    *[Symbol.iterator](): IterableIterator<{ key: Key; value: Value; }> {
        for(let index = 0; index < this.buckets.length; index++) {
            let bucket = this.buckets[index];
            for(let bindex = 0; bindex < bucket.length; bindex++) {
                yield bucket[bindex];
            }
        }
    }
}

export class HashSet<Type> implements Iterable<Type> {
    constructor(
        hasher:(k:Type) => number = (k) => +k,
        equaler:(a:Type, b:Type) => boolean = (a, b) => a === b,
        loadFactor:number = 2
    ) {
        this.collection = new HashMap<Type, Type>(hasher, equaler, loadFactor);
    }

    private collection:HashMap<Type, Type>;

    public get loadFactor():number {
        return this.collection.loadFactor;
    }

    public set loadFactor(newLoadFactor:number) {
        this.collection.loadFactor = newLoadFactor;
    }

    public insert(value:Type):Type | undefined {
        return this.collection.put(value, value);
    }

    public contains(value:Type):boolean {
        return this.collection.get(value) != null;
    }

    public remove(value:Type):Type | undefined {
        return this.collection.remove(value);
    }

    public erase():Type[] {
        let ret = this.collection.erase();
        return ret.map(pair => pair.key);
    }

    public get size():number {
        return this.collection.size;
    }

    public rehash(bucketCount:number):void {
        this.collection.rehash(bucketCount);
    }

    public bucketCount():number[] {
        return this.collection.bucketCount();
    }

    public loadLevel():number {
        return this.collection.loadLevel();
    }

    *[Symbol.iterator](): IterableIterator<Type> {
        for(let pair of this.collection) {
            yield pair.key;
        }
    }
}

export function toMapWithMapper<Key, Value>(
    values:Value[], 
    keyMapper:(v:Value) => Key,
    hasher:(k:Key) => number = (k) => +k,
    equaler:(a:Key, b:Key) => boolean = (a, b) => a === b
):HashMap<Key, Value> {
    let ret = new HashMap<Key, Value>(hasher, equaler);
    values.forEach(v => ret.put(keyMapper(v), v));
    return ret;
}

export function toMap<Key, Value>(
    values:{key:Key, value:Value}[], 
    hasher:(k:Key) => number = (k) => +k,
    equaler:(a:Key, b:Key) => boolean = (a, b) => a === b
):HashMap<Key, Value> {
    let ret = new HashMap<Key, Value>(hasher, equaler);
    values.forEach(pair => ret.put(pair.key, pair.value));
    return ret;
}

export function toSet<Type>(
    values:Type[],
    hasher:(k:Type) => number = (k) => +k,
    equaler:(a:Type, b:Type) => boolean = (a, b) => a === b
):HashSet<Type> {
    let ret = new HashSet<Type>(hasher, equaler);
    values.forEach(v => ret.insert(v));
    return ret;
}