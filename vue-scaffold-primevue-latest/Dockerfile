FROM node:18-alpine3.17 as builder

# 작업 디렉토리 설정
WORKDIR /app

# 소스 코드 복사
COPY . .

# 프로젝트 의존성 설치
RUN npm install

# 프로덕션 빌드 실행
RUN npm run build

# Nginx를 이용하여 서빙할 때 사용할 이미지
FROM nginx:alpine

# Nginx 설정 파일 복사
COPY ./nginx/nginx.conf /etc/nginx/nginx.conf
COPY ./nginx/error.html /usr/share/nginx/html/error.html

# Vue.js 빌드 결과물을 Nginx에 복사
COPY --from=builder /app/dist /usr/share/nginx/html

# 포트 설정
EXPOSE 80

# Nginx 실행
CMD ["nginx", "-g", "daemon off;"]
