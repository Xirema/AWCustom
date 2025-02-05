export function stringHash(str:string):number {
    if(str == null) {
        return 0;
    }
    if(str.length === 0) {
        return 0;
    }
    let hash = 0;
    for(let i = 0; i < str.length; i++) {
        let chr = str.charCodeAt(i);
        hash = ((hash << 5) - hash) + chr;
        hash |= 0;
    }
    return hash;
}