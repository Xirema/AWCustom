enum NodeColor {
    BLACK, RED
}

class TreeNode<Key, Value> {
    left?:TreeNode<Key, Value>;
    right?:TreeNode<Key, Value>;
    parent?:TreeNode<Key, Value>;

    key:Key;
    value:Value;
    color:NodeColor;

    constructor(
        key:Key,
        value:Value,
        color:NodeColor,
        parent?:TreeNode<Key, Value>,
        left?:TreeNode<Key, Value>,
        right?:TreeNode<Key, Value>
    ) {
        this.parent = parent;
        this.left = left;
        this.right = right;
        this.color = color;
        this.value = value;
        this.key = key;
    }
}

function isBlack<Key, Value>(node?:TreeNode<Key, Value>):boolean {
    if(!node) {
        return true;
    }
    return node.color === NodeColor.BLACK;
}

export class TreeMap<Key, Value> implements Iterable<{key:Key, value:Value}>{
    constructor(
        private comparator:(a:Key, b:Key) => number = (a:Key, b:Key) => +a - +b
    ) {

    }

    private root?:TreeNode<Key, Value>;

    public put(key:Key, value:Value):{key:Key, value:Value} | undefined{
        if(this.root == null) {
            this.root = new TreeNode<Key, Value>(
                key,
                value,
                NodeColor.BLACK
            );
            return undefined;
        }

        //First, put the new node where it would belong if this weren't RB tree.
        let currentNode = this.root;
        let newNode = new TreeNode<Key, Value>(
            key,
            value,
            NodeColor.RED,
            currentNode
        );
        do {
            let comp = this.comparator(currentNode.key, key);
            if(comp < 0) {
                if(currentNode.left) {
                    currentNode = currentNode.left
                } else {
                    currentNode.left = newNode;
                    break;
                }
            } else if(comp > 0) {
                if(currentNode.right) {
                    currentNode = currentNode.right;
                } else {
                    currentNode.right = newNode;
                    break;
                }
            } else {
                let ret = {key:currentNode.key, value:currentNode.value};
                currentNode.key = key;
                currentNode.value = value;
                return ret;
            }
        } while(true);

        this.doFix(newNode);
        return undefined;
    }

    private doFix(node:TreeNode<Key, Value>):void {
        while(!isBlack(node.parent) && node !== this.root) {
            let parent = node.parent;
            let grandparent = parent?.parent;
            if(!parent || !grandparent) {
                throw new Error('This cannot happen!');
            }
            if(parent === grandparent.left) {
                let uncle = grandparent.right;
                if(!isBlack(uncle)) {
                    if(!uncle) {
                        throw new Error('This cannot happen!');
                    }
                    parent.color = NodeColor.BLACK;
                    uncle.color = NodeColor.BLACK;
                    grandparent.color = NodeColor.RED;
                    node = grandparent;
                } else {
                    if(node === parent.right) {
                        node = parent;
                        this.rotateLeft(node);
                    }
                    parent = node.parent;
                    grandparent = node.parent?.parent;
                    if(!parent || !grandparent) {
                        throw new Error('This cannot happen!');
                    }
                    parent.color = NodeColor.BLACK;
                    grandparent.color = NodeColor.RED;
                    this.rotateRight(grandparent);
                }
            } else {
                let uncle = grandparent.left;
                if(!isBlack(uncle)) {
                    if(!uncle) {
                        throw new Error('This cannot happen!');
                    }
                    parent.color = NodeColor.BLACK;
                    uncle.color = NodeColor.BLACK;
                    grandparent.color = NodeColor.RED;
                    node = grandparent;
                } else {
                    if(node === parent.left) {
                        node = parent;
                        this.rotateRight(node);
                    }
                    parent = node.parent;
                    grandparent = node.parent?.parent;
                    if(!parent || !grandparent) {
                        throw new Error('This cannot happen!');
                    }
                    parent.color = NodeColor.BLACK;
                    grandparent.color = NodeColor.RED;
                    this.rotateLeft(grandparent);
                }
            }
        }
        if(!this.root) {
            throw new Error('This cannot happen!');
        }
        this.root.color = NodeColor.BLACK;
    }

    rotateRight(
        node:TreeNode<Key, Value>
    ):void {
        let sibling = node.left;
        if(!sibling) {
            throw new Error('Cannot rotate if left child is null!');
        }
        node.left = sibling.right;
        if(sibling.right) {
            sibling.right.parent = node;
        }
        sibling.parent = node.parent;
        if(!node.parent) {
            this.root = sibling;
        } else {
            if(node === node.parent.right) {
                node.parent.right = sibling;
            } else {
                node.parent.left = sibling;
            }
        }
        sibling.right = node;
        node.parent = sibling;
    }

    rotateLeft(
        node:TreeNode<Key, Value>
    ):void {
        let sibling = node.right;
        if(!sibling) {
            throw new Error('Cannot rotate if right child is null!');
        }
        node.right = sibling.left;
        if(sibling.left) {
            sibling.left.parent = node;
        }
        sibling.parent = node.parent;
        if(!node.parent) {
            this.root = sibling;
        } else {
            if(node === node.parent.left) {
                node.parent.left = sibling;
            } else {
                node.parent.right = sibling;
            }
        }
        sibling.left = node;
        node.parent = sibling;
    }
    
    *[Symbol.iterator](): IterableIterator<{ key: Key; value: Value; }> {
        throw new Error("Method not implemented.");
    }
}