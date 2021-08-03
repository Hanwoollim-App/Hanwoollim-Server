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

            <a href='/user/gathering'>번개모임</a>

            <a href='/user/reservation'>예약하기</a>

            <a href='/user/board'>공지사항</a>

            
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

            <a href='/manager/gathering'>고정합주 예약</a>
   
        </body>
    </html>
    `;
    res.status(200).send(output);
};

exports.chairmanHome = (req, res) => {
    var output =`
    Chairman home.

    회원 목록 및 회원정보 수정

    고정합주 예약

    공지사항 등록하기

    신규 가입자 승인하기
    
    `
    res.status(200).send(output);
    
};