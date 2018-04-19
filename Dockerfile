FROM node:8-wheezy

RUN mkdir -p /usr/src/app

WORKDIR /usr/src/app

#RUN mkdir /root/.ssh/
#ADD id_rsa /root/.ssh/id_rsa
#RUN chmod 400 /root/.ssh/id_rsa
#RUN touch /root/.ssh/known_hosts
#RUN ssh-keyscan bitbucket.org >> /root/.ssh/known_hosts
#RUN GIT_SSH_COMMAND='ssh -i /root/.ssh/id_rsa'

RUN npm install pm2 -g

COPY package.json package.json

RUN npm install

COPY . .

#RUN npm upgrade

RUN npm install

CMD ["pm2-runtime", "npm", "--", "start"]
