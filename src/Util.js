export const mapScore = (entries, entry) => {
    entries = [...entries, entry].sort((a, b) => b.score - a.score);
    const max = Math.floor(entries[0].score);
    for (let i = 0; i < entries.length; i++) {
        entries[i] = {
            model: entries[i].model,
            score: Math.floor((entries[i].score / max) * 100),
            isUserDevice: !!entries[i].isUserDevice
        };
    }
    return entries;
}

export const groupByModel = ({cpu, gpu, disk}) => {
    const models = {}
    cpu.forEach(metric => {
        models[metric.model] = {
            ...(models[metric.model] || {model: metric.model, isUserDevice: metric.isUserDevice}),
            cpu: metric.score
        }
    })
    gpu.forEach(metric => {
        models[metric.model] = {
            ...(models[metric.model] || {model: metric.model, isUserDevice: metric.isUserDevice}),
            gpu: metric.score
        }
    })
    disk.forEach(metric => {
        models[metric.model] = {
            ...(models[metric.model] || {model: metric.model, isUserDevice: metric.isUserDevice}),
            disk: metric.score
        }
    })
    const modelsValues = Object.values(models)
    return modelsValues.map(modelValue => {
        return {
            ...modelValue,
            overallScore: Math.round((modelValue.cpu + modelValue.gpu + modelValue.disk) / 3)
        }
    }).sort((a, b) => b.overallScore-a.overallScore)
}

export function parseUserAgent(userAgentString = window.navigator.userAgent) {
    let start = userAgentString.indexOf('(')
    let end = userAgentString.indexOf(')')
    const [os, version, model = 'test'] = userAgentString.substring(start + 1, end).split('; ')
    return {os, version, model}
}