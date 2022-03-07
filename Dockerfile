FROM node:12.18.1
WORKDIR /home/dashboard-backend/
COPY ["package.json", "package-lock.json*", "tsconfig.json", "./"]
RUN npm install
COPY . .
RUN npx tsc
ENTRYPOINT node ./build/index.js