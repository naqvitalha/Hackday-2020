/* eslint-disable */
import React from 'react';
import {mapScore, parseUserAgent} from "../Util";
import {results} from "../data/results";

function ReportItem({name, value, icon, percentile}) {
    return <div style={styles.reportItemContainer}>
        <div>
            <img style={styles.reportIcon} src={icon}/>
        </div>
        <div>{name}</div>
        <div>{value}</div>
        <div>
            Slower than {percentile}% of phone
        </div>
    </div>

}

function HorizontalBar({value, text}) {
    return <div style={{
        width: 450,
        height: 48,
        marginTop: 8,
        marginBottom: 8,
        position: 'relative',
        display: 'flex',
        justifySelf: 'center',
        alignItems: 'center'
    }}>
        <div style={{
            position: 'absolute',
            height: 48,
            display: 'flex',
            lineHeight: '48px',
            paddingLeft: 24,
            textAlign: 'left',
            color: 'black'
        }}>{text}</div>

        <div style={{
            position: 'absolute',
            top: 0,
            bottom: 0,
            right: 0,
            height: 48,
            display: 'flex',
            lineHeight: '48px',
            paddingLeft: 24,
            textAlign: 'left',
            color: 'black'
        }}>{value}</div>
        <div style={{
            border: '1px black solid',
            width: (400 / 100) * value,
            height: 48,
            marginTop: 8,
            marginBottom: 8,
        }}/>
    </div>
}

function ReportPage({reportData, deviceInfo}) {
    console.log('reportData')
    const {model} = parseUserAgent()
    const {deviceName = model} = deviceInfo || {}
    const dummyComparisons = [
        {name: 'iPhone 12', score: 95},
        {name: 'Samsung s20', score: 91},
        {name: 'OnePlus 8 Pro', score: 80},
    ]
    const {otherPhones = dummyComparisons, data} = reportData || {};

    let {cpu, gpu, disk} = data
    console.log('results.cpu', results.cpu)
    const allCpu = mapScore(results.cpu, {...cpu, model, isUserDevice: true})
    const allGpu = mapScore(results.webgl, {...gpu, model, isUserDevice: true})
    const allDisk = mapScore(results.io, {...disk, model, isUserDevice: true})
    const cpuPercentile = allCpu.find(val => val.isUserDevice).score
    const gpuPercentile = allGpu.find(val => val.isUserDevice).score
    const diskPercentile = allDisk.find(val => val.isUserDevice).score

    return <div>
        <div>Report</div>
        <div style={styles.deviceInfoContainer}>
            <div>Device Name: {deviceName}</div>
        </div>
        <div>Phone Report</div>

        <div>
            {otherPhones.map(value => (
                <HorizontalBar value={value.score} text={value.name}/>
            ))}
        </div>

        <div>Details</div>
        <div style={styles.reportRow}>
            <ReportItem name={"CPU"} value={cpu.score} icon={"/chip.png"} percentile={cpuPercentile}/>
            <ReportItem name={"GPU"} value={gpu.score} icon={"/chip.png"} percentile={gpuPercentile}/>
            <ReportItem name={"Disk"} value={disk.score} icon={"/disk.png"} percentile={diskPercentile}/>
        </div>

        <div style={styles.valueComparison}>
            <div>Current value: <span style={styles.valueComparisonValue}>Rs 14999</span></div>
            <div>Projected value in 1 month: <span style={styles.valueComparisonValue}>Rs 12999</span></div>
        </div>

        <div
            style={{padding: 12}}
            onClick={() => {
            window.location.href = 'https://www.flipkart.com/search?q=mobile&marketplace=FLIPKART&p%5B%5D=facets.price_range%255B%255D%3DRs.%2B18001%2B-%2BRs.%2B35000&p%5B%5D=facets.rating%255B%255D%3D4%25E2%2598%2585%2B%2526%2Babove&p%5B%5D=facets.price_range%255B%255D%3DRs.%2B25001%2B-%2BRs.%2B35000&pageUID=1608235350520'
        }}>
            Click Here to upgrade your phone
        </div>
    </div>
}


const styles = {
    reportRow: {
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
    },
    reportItemContainer: {
        display: 'flex',
        flexDirection: 'column',
        padding: 16,
        alignItems: 'center',
        justifyContent: 'center',
    },
    reportIcon: {
        width: 75,
        height: 75,
        margin: 12
    },
    valueComparison: {
        display: 'flex',
        flexDirection: 'column',
        marginTop: 24
    },
    valueComparisonValue: {
        fontWeight: '800'
    },
    deviceInfoContainer: {
        display: 'flex',
        flexDirection: 'column',
        padding: 16,
        alignItems: 'center',
        justifyContent: 'center',
    }
}

export default ReportPage