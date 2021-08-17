/*
    return homepages
*/

exports.userHome = (req, res, next) => {
    var output = `
    <html>
        <body>
            <p>User home.
            
            <a href='/user/info'>개인정보 설정</a>
            
            </p>

            <div><a href='/user/gathering'>번개모임</a></div>

            <div><a href='/user/reservation?startdate='>예약하기</a></div>
            <p> 클라이언트는 현재 요일에 해당하는 주차의 정보를 받아오기 위해 startdate(query)에 "2021-09-01" 형식으로 보내야한다.</p>

            <div><a href='/user/board'>공지사항</a></div>

            
        </body>
    </html>
    `;
    res.status(200).send(output);
    
};

exports.adminHome = (req, res) => {
    var output =`
    <html>
        <body>
            <p>Admin home.</p>

            <div><a href='/manager/reservation?startdate='>고정합주 예약</a></div>
            <p> 클라이언트는 현재 요일에 해당하는 주차의 정보를 받아오기 위해 startdate(query)에 "2021-09-01" 형식으로 보내야한다.</p>
   
        </body>
    </html>
    `;
    res.status(200).send(output);
};

exports.chairmanHome = (req, res) => {
    var output =`
    <html>
        <body>
            <p>Chairman home.</p>

            <div><a href='/manager/manage_list'>회원 목록 및 회원정보 수정</a></div>
            
            <div><a href='/manager/reservation?startdate='>고정합주 예약</a></div>
            <p> 클라이언트는 현재 요일에 해당하는 주차의 정보를 받아오기 위해 startdate(query)에 "2021-09-01" 형식으로 보내야한다.</p>
            
            <div><a href='/manager/announcement'>공지사항 등록하기</a></div>

            <div><a href='/manager/approve_new_member'>신규 가입자 승인하기</a></div>
    
   
        </body>
    </html>
    `
    res.status(200).send(output);
    
};