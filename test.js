var output = { 'sidarr': {}, 'MON':{8:1}, 'TUE':{2:1}, 'WEN':{1:1}, 'THUR':{3:3}, 'FRI':{}, 'SAT':{}, 'SUN':{}, 'session':{}}
for (let w in output){
    //console.log(output[w])
    if (output[w]){
        console.log(output[w])
    }
}
console.log(output)