FROM node:11-slim
WORKDIR /app
COPY . /app

EXPOSE 9000
ENV PORT "9000"
CMD ["npm", "start"]
