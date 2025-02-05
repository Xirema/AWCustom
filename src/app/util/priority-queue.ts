export class PriorityQueue<Type> {
    private arr:Type[] = [];
    constructor(private comparator:(a:Type, b:Type) => number = (a, b) => (+a) - (+b)) {

    }
    push(item:Type):void {
        if(this.arr.length === 0) {
            this.arr.push(item);
            return;
        }
        if(this.arr.length === 1) {
            let test = this.comparator(item, this.arr[0]);
            if(test < 0) {
                this.arr = [item, ...this.arr];
            } else {
                this.arr = [...this.arr, item];
            }
            return;
        }
        let start = 0;
        let end = this.arr.length;
        while(start < end) {
            let curr = Math.floor((start + end) / 2);
            let test = this.comparator(item, this.arr[curr]);
            if(test === 0) {
                this.arr = [...this.arr.slice(0, curr), item, ...this.arr.slice(curr)];
                return;
            }
            if(test < 0) {
                end = curr;
                continue;
            }
            //test > 0
            start = curr + 1;
        }
        //We didn't find an exact match, but start should equal end at the point where the item should be inserted
        this.arr = [...this.arr.slice(0, start), item, ...this.arr.slice(start)];
    }
    peek():Type | undefined {
        if(this.arr.length === 0) {
            return undefined;
        }
        return this.arr[0];
    }
    pop():Type | undefined {
        return this.arr.shift();
    }
    size():number {
        return this.arr.length;
    }
    isEmpty():boolean {
        return this.size() === 0;
    }
}