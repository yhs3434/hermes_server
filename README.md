# Dr.Chain Project
> 위 프로젝트는 의료 기록과 같은 보안에 민감한 정보들을 블록체인과 DB에 이중 저장하여  
> 저장된 정보의 무결성과 보안성을 유지하는 것을 목적으로 하고 있다.

# Setup

## Requirements
 - MYSQL DB(link)  
 [![mysql](https://user-images.githubusercontent.com/37432155/59326987-35f2ff00-8d23-11e9-8c8a-1681870b1012.png)](https://www.mysql.com/downloads/)  
   
 + Ganache(link)  
 [![ganache](https://user-images.githubusercontent.com/37432155/59326986-355a6880-8d23-11e9-9413-27d7e396ec34.png)](https://truffleframework.com/ganache)  
   
 - Node.js(link)  
 [![nodejs](https://user-images.githubusercontent.com/37432155/59326988-35f2ff00-8d23-11e9-83ef-354dd52a18a4.jpg)](https://nodejs.org/ko/download/)  
   
   
 - Remix(link)     
 [![remix](https://user-images.githubusercontent.com/37432155/59326989-35f2ff00-8d23-11e9-9522-b9d439b93f93.png)
](https://remix.ethereum.org/)  
  
    
 + Source Code  
   
   
## Installation & Start
 1. 프로젝트 소스 코드를 적당한 디렉토리에 내려받는다.  
     ```sh
     $ git clone https://github.com/jae123123/Dr.Chain
     ```
 2. 터미널(혹은 cmd창)을 하나 연 후, Ganache를 실행한다.  
     ```sh
     $ ganache-cli
     ```
 3. DB사용을 위해 임의의 데이터베이스 생성 후 다음과 같이 테이블을 생성한다.
     
     ![records_table](https://user-images.githubusercontent.com/37432155/59326712-5e2e2e00-8d22-11e9-9bb9-53ee3a46d1fc.png)
     ![records_secure_table](https://user-images.githubusercontent.com/37432155/59326736-7900a280-8d22-11e9-9cb1-d8a7a94d7221.png)
     ![user_table](https://user-images.githubusercontent.com/37432155/59326748-84ec6480-8d22-11e9-8cdc-0e078db3702c.png)
     ![user_sign_table](https://user-images.githubusercontent.com/37432155/59326767-8d449f80-8d22-11e9-9d3a-c5a8342f932b.png)
     
 3. Remix에 접속한 후 SmartContract 디렉토리의 RecordData.sol 파일의 코드를 복사해 붙여넣는다.  
     ```sh
     1. 우상단의 Environment 항목을 Web3 provider로 변경  
     2. Smart Contract Deploy 클릭
     ```  
     
 4. Deployed 된 Contract의 주소 및 Account Address 를 복사 및 records.js의 각 부분에 입력한다.
     ```sh
     1. record.js에서 contract_addr, function ether_output 찾기
     2. Enter_the_contract_address 대신 Contract Address 입력
     3. Enter_the_account_address 대신 Account Address 입력
     ```    
 5. 터미널을 추가로 하나 더 연 후, 1번에서 내려받았던 소스 코드 디렉토리로 이동한다.  
     ```sh
     $ cd source_code_dir
     ```    

 6. 프로젝트 실행을 위한 모듈들을 설치한다.  
     ```sh
     $ npm install
     ```  
     
 7. 디렉토리 내에 node_modules폴더가 생성이 되었으면 서버를 실행시킨다.  
     ```sh
     $ node app.js
     ```  
     
# Usage
Internet Explorer(혹은 다른 브라우저도 가능) 주소창에 다음과 같이 입력한다.
```sh
localhost:30001/login
```  

# Directory
```
Dr.Chain ( Root directory )
│
├── SmartContract
│   ├── DrCoin.sol
│   ├── README.md
│   ├── HospitalData.sol
│   ├── RecordData.sol
│   └── UserData.sol
│
├── global
│   └── db.js
│
├── node_modules
│   ├── module_name_1
│   ├── ...
│   └── module_name_n
│
├── public
│   ├── css
│   │   ├── d_doctorsend.css
│   │   ├── d_recordslist.css
│   │   ├── d_userList.css
│   │   ├── d_userList2.css
│   │   ├── d_writeread.css
│   │   ├── p_recordslist.css
│   │   ├── p_writeread.css
│   │   └── select.css
│   │
│   ├── html
│   │   ├── doctor
│   │   │   ├── doctorsend.html
│   │   │   ├── recordslist.html
│   │   │   ├── userList.html
│   │   │   ├── userList2.html
│   │   │   └── writeread.html
│   │   │
│   │   └── patient
│   │       ├── recordslist.html
│   │       ├── references.html
│   │       └── writeread.html
│   │
│   ├── image.jpg
│   └── style.css
│
├── router
│   └── html_router.js
│
├── signup
│   └── signup.html
│
├── use_db
│   ├── records.js
│   └── user.js
│
├── app.js
├── image.jpg
├── login.html
├── package.json
├── package-lock.json
├── README.md
└── select.html
```


## Testing Page
> http://drchain.na.to/
