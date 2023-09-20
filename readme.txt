## Docker
1. install postgresql image 
$ docker pull postgres

2. check images
$ docker images

3. run docker container
$ docker run -d -p 5432:5432 --name postgres -e POSTGRES_PASSWORD=1234 -v ~/docker/postgres:/var/lib/postgres/data postgres

    (1) docker run : docker image에서 container를 생성한다.
    (2) –name postgres : container의 이름은 postgres 한다.
    (3) -p 5432:5432 : 해당 container의 port forwarding에 대해 inbound/outbound port 모두 5432으로 설정한다.
    (4) -e : container 내 변수를 설정한다.
    (5) POSTGRES_PASSWORD=”암호” : ROOT 암호를 설정 따옴표 내의 내용은 암호이다.
    (6) -d postgres : postgres이라는 이미지에서 분리하여 container를 생성한다.


4. connect to docker Shell
$ docker exec -it postgres /bin/bash

5. connect to postgresql(on docker shell)
$ psql -U postgres

6. create DB( must end with " ; " )
$ create database blogdb;

7. create user
$ create ingu blog with encrypted password '1234';

8. grand privileage
$ grant all privileges on database blogdb to ingu;

9. run created DB
$ \c blogdb

10. blogdb를 선택한 후 특정 DB 내 모든 Table을 확인
$ SELECT * FROM PG_TABLES; -- PostgreSQL 내 모든 테이블 이름 조회
SELECT * FROM PG_TABLES WHERE schemaname='public'; -- 사용자가 생성한 테이블 이름 조회
SELECT table_name FROM information_schema.tables WHERE table_schema = 'public' ORDER BY table_name; -- 사용자가 생성한 테이블의 이름 정보만 조회
