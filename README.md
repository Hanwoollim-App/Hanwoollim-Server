# Hanwoollim Application Server
 #### 한양대학교 밴드동아리 한울림에서 진행한 동아리멤버 전용 앱 개발 프로젝트입니다.

<br/>

# Stack

### Application Data and tools
> * #### JavaScript
> * #### Node.js
>   - ##### ExpressJs
>   - ##### Sequelize
>   - ##### Jsonwebtoken
>   - ##### BcryptJs
>   - ##### Dotenv
>   - ##### Cookie-parser
> * #### MySQL
> * #### Amazon EC2
> * #### Amazon RDS
> * #### NGINX

<br/>
   
### DevOps • Business Tools
> - #### GitHub
> - #### VisualStudio Code
> - #### Slack
> - #### Notion

    
    
<br/>

# APIs
- #### User-App API
   - ##### https://app.swaggerhub.com/apis/Jaemani/Hanwoolim-Server-User/1.0.0
- #### Manager-App API
   - ##### https://app.swaggerhub.com/apis/Jaemani/Hanwoolim-Server-Manager/1.0.0

<br/>

# Some important things to know
- ##### These applications are only made for students in the music club "Hanwoollim" of Hanyang University.
- ##### Although there are two applications 'User-app' and 'Manager-app', but both operated and controlled by one server. 
  - ##### and those are sharing same user-information table.

- #### sign in & sign up

  - ##### User must be signed in to access home of applications.
  - ##### If you're new to this applications, you could sign up to make new account and then sign in.
    - ###### sign up is only allowed in 'User-app'
    - ###### Because of we couldn't certificate student's information through University-Database, we don't know if the student ID you type is match with other informations. If we found you have signed up with the student ID which is not yours, or typed the fake student ID, your account would be deleted.
    - ###### If you have signed up with wrong student ID, Please update your student ID to correct number in 'Option' - 'Edit Information' at 'User-app'

    
    ![회원가입 (첫 로그인)](https://user-images.githubusercontent.com/39300288/133678495-a94b1711-66e1-4967-890a-ba645ee6bafc.png)
    ![로그인](https://user-images.githubusercontent.com/39300288/133678667-a37be086-68f8-41ab-b819-5bc62c21ad5a.png)
  
    
 - ##### You are not possible to access the page when you 'just signed up'
    ###### If everything is okay, the chairman of the Hanwoollim would approve you soon.

   ![승인안된화면](https://user-images.githubusercontent.com/39300288/133682476-ca84436d-e95e-4e92-ae30-b4b4e2da6386.png)
 
   
<br/>

# Main Functions
<br/>

## User-app
  - ### Initial Screen
    - #### sign in
    - #### sign up
      ![초기 화면](https://user-images.githubusercontent.com/39300288/133681678-4289b1a5-b6aa-4f27-acf7-a2757e2f2a18.png)
      
  - ### Main Screen    
    ##### You will see the Gear icon at the top-right corner. You are able to check or update your personal information through this. 
    ##### And you could see preview of 'Announcement',  'Reservations of tody', 'personal Reservation' and 'Lightning gathering of today' in the middle. 
    ##### Also "Home", "Lightning gathering", "Reservatoin", "Board" at the bottom.
    
      ![메인 화면](https://user-images.githubusercontent.com/39300288/133684551-7e1bd7db-088e-45de-88ef-4eaff0d08d3f.png)
 
  - ### Personal Information Setting (The Gear icon)
    - #### Edit information
    - #### Withdrawal
    
      ##### You could Edit your personal information or Withdrawal here.
      
      ![유저 인터페이스](https://user-images.githubusercontent.com/39300288/133697441-895d9237-7ef2-4b79-b559-96afd27357b5.png)
      
    - ### Edit information
      ##### This is a page for entering the information you want to update.
    
      ![유저 정보 수정](https://user-images.githubusercontent.com/39300288/133697143-64930273-de06-4733-96bd-82836eb8acba.png)

  - ### Announcement
    ##### Only Manager and Chairman could create and edit announcement.
    ##### Announcement is about what you need to know as a Member of Hanwoollim.
    
      ![메인_공지사항](https://user-images.githubusercontent.com/39300288/133796621-a11e627b-8815-4321-a39d-57be10d4fa0c.png)
      ![메인_공지사항_상세](https://user-images.githubusercontent.com/39300288/133796639-a448f19d-dce0-4ac6-8866-0b73b693687b.png)


    
  - ### Lightning Gathering
    ##### We didn't make this function yet
  
  - ### Reservation
    ##### You would see the date and time that other people already reserved.
    ##### You could choose other time to reserve practice room (maximum time is 1 hour and you can only have one Personal-practicing-reservation in a day).
      
      ![예약 화면](https://user-images.githubusercontent.com/39300288/133793563-ae886eca-4a39-46d8-8f84-3bd643c93875.png)
      ![예약 최종](https://user-images.githubusercontent.com/39300288/133793719-914372aa-fc33-4573-b1ca-8bc99bdc8bf3.png)

  - ### Board
     ##### This is the data-sharing board. All of the member could share useful data, file, study-guide(or anything) here.
      
      ![자료게시판](https://user-images.githubusercontent.com/39300288/133796153-8de37608-bfb0-499a-8987-b779c07c60e1.png)
      ![자료게시판 상세](https://user-images.githubusercontent.com/39300288/133796162-f64733d5-7604-432a-b611-316e9f100c19.png)
      
    - ##### For make sharing
      - ###### You must set the file-expired date.
      - ###### File-upload is an optional.
      
      ![자료게시판 자료 공유하기](https://user-images.githubusercontent.com/39300288/133796173-6246ef69-9625-47ad-8e87-8e20d3c007eb.png)


<br/>

## Manager-app
  - ### Initial Screen
    - #### sign in
      ![관리자_초기 화면](https://user-images.githubusercontent.com/39300288/133798261-d96c1e12-989d-4bad-b116-511785a49809.png)
  
  - ### Main screen
      #### For Manager (집행기)
      - ##### 'Reservation' and 'Announcement' are available
      #### For Chairman (관리자)
      - ##### 'Manage member', 'Reservaion', 'Announcement' and 'Approve new member' are available
        
      ![관리자_메인 화면](https://user-images.githubusercontent.com/39300288/133799916-1801a7d4-a09b-43a7-b361-6f9d8d96d923.png)


  - ### Manage member
    ##### Chairman would get the list of all members, and able to change position or force expel member
    
      ![관리자_회원 목록](https://user-images.githubusercontent.com/39300288/133801299-b3ea4bbc-c517-4f64-ad96-6a6b1d6364aa.png)
      ![관리자_회원_설정 – 1](https://user-images.githubusercontent.com/39300288/133801326-a5530fff-2623-4763-8c74-a8de4b15e74a.png)
    
  - ### Reservation
    ##### It is very similar to reservation function on User-app, but this function is to reserve Team-practicing and Mentoring
    
      ![관리자_고정합주_예약화면](https://user-images.githubusercontent.com/39300288/133802249-a45f7c22-8f0b-4be8-bf8e-6b1771861c71.png)
      ![관리자_고정합주_에약_분류](https://user-images.githubusercontent.com/39300288/133802284-a79d7c27-e0cb-4a05-827c-43c1aad8ec49.png)
      
     ##### In addition, you have to insert Team(for Team-practicing) or Name(for Mentoring)
     
      ![관리자_고정합주_예약_최종](https://user-images.githubusercontent.com/39300288/133802611-d2240e8f-c058-4f3d-8ff7-0e09f3576ecc.png)
      ![관리자_고정합주_멘토링_최종](https://user-images.githubusercontent.com/39300288/133802628-4b3b8ea5-fe28-4e94-be50-bd286cae40cd.png)

  - ### Announcement
    ##### As mentioned above, Announcement is about what members need to know as a Member of Hanwoollim.
      
      ![관리자_공지사항](https://user-images.githubusercontent.com/39300288/133803377-96338d0d-5896-4b90-935c-40acd6bd2453.png)
      ![관리자_공지사항_등록](https://user-images.githubusercontent.com/39300288/133803401-a035c3e0-a1bd-446e-8ea2-ff4226f6ee76.png)
      ![관리자_공지사항_상세](https://user-images.githubusercontent.com/39300288/133803508-400163d0-7a50-4906-bb86-22e1d11ba4e8.png)

  - ### Approve new member
    ##### Once the new member is signed up, information of member would added in the list. Chairman could check and approve the new members.
    
      ![관리자_신규가입](https://user-images.githubusercontent.com/39300288/133803836-56035c2b-d8a7-4640-97e9-2e4466ce34ec.png)

<br/>

## About errors
#### You would never get client-side error if you have wrote as right format.
#### The basic format of information follows below:
  - ##### ID: string
  - ##### PW: string
  - ##### name: string
  - ##### major: string
  - ##### student ID : 10 digits number
   ###### You should fill all of the text box when you're signing up

#### If you got any other problems, please contact developer.
      
