FROM amazon/aws-lambda-nodejs:18

ARG FUNCTION_DIR="/var/task"
RUN mkdir -p ${FUNCTION_DIR}
WORKDIR ${FUNCTION_DIR}

COPY package*.json tsconfig.json ${FUNCTION_DIR}/
COPY src ${FUNCTION_DIR}/src
RUN npm install
RUN npm run build

CMD ["build/app.handler"]
