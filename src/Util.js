export const mapScore = (entries, entry) => {
    entries = [...entries, entry].sort((a,b) => b.score - a.score);
    const max = Math.floor(entries[0].score);
    for (let i = 0; i < entries.length; i++) {
        entries[i] = { model: entries[i].model,  score: Math.floor((entries[i].score/max) * 100), isUserDevice: entry.isUserDevice };
    }
    return entries;
}