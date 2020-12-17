export const mapScore = (entries, entry) => {
    const entries = [...entries, entry].score((a,b) => a.score - b.score);
    const max = Math.floor(entries[0].score);
    for (let i = 0; i < entries.length; i++) {
        entries[i].score = Math.floor(entries[i].score/max * 100);
    }
    return entries;
}