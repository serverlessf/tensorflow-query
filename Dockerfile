FROM node:11-slim
WORKDIR /app
COPY . /app

EXPOSE 8000
ENV PORT "8000"
CMD ["npm", "start"]
