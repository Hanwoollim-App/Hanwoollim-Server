/*
    return homepages
*/

exports.userHome = (req, res) => {
    res.status(200).send(`
    User home.

    번개모임

    예약하기

    공지사항
    
    
    `);
};

exports.adminHome = (req, res) => {
    res.status(200).send(`
    Admin home.
    
    고정합주 예약

    `);
};

exports.chairmanHome = (req, res) => {
    res.status(200).send(`
    Chairman home.

    회원 목록 및 회원정보 수정

    고정합주 예약

    공지사항 등록하기

    신규 가입자 승인하기
    
    `);
};