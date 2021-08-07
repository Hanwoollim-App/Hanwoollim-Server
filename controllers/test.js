function CodeToReservation(code){

    function textjson(type, key, value){
        if (type == 'start') return ` { "${key}": `;
        if (type == 'addpair') return `, "${key}": "${value}"`;
        if (type == 'addvalue') return `${value}`;
        if (type == 'end') return `}`;
    }
    
    
    // when nohtins inside then pass
    if (!code){
        console.log('값이 없습니다')
        return;
    } 

    // check syntax     s8e9s9  s8.5e9.5s
    var count_s = 0;
    var count_e = 0;
    var stime = '';
    var etime = '';
    var second_stime = '';
    console.log('code:' + code)
    console.log('code.length:' + code.length)
    console.log('code[1]:' + code[1])
    console.log(code[0]==='s')
    
    for (let i = 0; i < code.length; i++){
        console.log('i: ' + i)
        if (code[i]==='s'){
            console.log('found s:')
            count_s+=1
            if (code[i+2]!=='e'){
                stime += code[i+1];
                continue;
            }
            if (code[i+2]!=='.'){
                stime += code[i+1];
                stime += code[i+2];
                stime += code[i+3];
                continue;
            }
        }

        if (code[i]==='e'){
            console.log('found e:')
            count_e+=1
            if (!code[i+1]){
                break;
            }
            if (code[i+2]!=='s'){
                etime += code[i+1];
                    var j = i+1;
                    if (code[j+2]!=='e'){
                        second_stime += code[i+1];
                        continue;
                    }
                    if (code[j+2]!=='.'){
                        second_stime += code[i+1];
                        second_stime += code[i+2];
                        second_stime += code[i+3];
                        continue;
                    }
                continue;
            }
            if (code[i+2]!=='.'){
                etime += code[i+1];
                etime += code[i+2];
                etime += code[i+3];
                continue;
            }
        }


        if (parseFloat(stime)>=parseFloat(etime)){
            return res.status().send({ message: '잘못된 포멧으로 저장되어있습니다. starttime이 endtime 보다 큽니다' });
        }
        if (parseFloat(etime)>parseFloat(second_stime)){
            return res.status().send({ message: '잘못된 포멧으로 저장되어있습니다. endtime이 다음 starttime 보다 큽니다' });
        }
        if ( (parseFloat(etime)-parseFloat(stime)) > 1 ){
            return res.status().send({ message: '잘못된 포멧으로 저장되어있습니다. 최대 예약시간은 1시간 입니다.' });
        }
        console.log('시작시간: ' + stime);
        console.log('끝시간: ' + etime);
        console.log('다음: ' + second_stime)
    }
    if (count_s!==count_e){
        return res.status().send({ message: '잘못된 포멧으로 저장되어있습니다. starttime, endtime 갯수 비매칭' });
    }
    
    
}

code1 = 's8e9s9e10.5s10.5e11s15e16'
code2 = 's8e7s8e9'
code3 = 's8e8.5s8'
CodeToReservation(code1)