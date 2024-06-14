FROM node:lts
WORKDIR /usr/src/app
COPY . .
RUN npm i
ENV MODEL_URL=https://storage.googleapis.com/quitzone-bucket/model_ml/model.json
CMD ["npm", "run", "start"]