FROM ubuntu:18.04

ARG DEBIAN_FRONTEND=noninteractive
COPY build/java_policy /etc
RUN buildDeps='software-properties-common git libtool cmake python-dev python3-pip python-pip libseccomp-dev' && \
    apt-get update && apt-get install -y curl zip python python3.8 python-pkg-resources python3-pkg-resources gcc g++ $buildDeps && \
    add-apt-repository ppa:openjdk-r/ppa && add-apt-repository ppa:longsleep/golang-backports && apt-get update && apt-get install -y golang-go openjdk-8-jdk
RUN curl -sL https://deb.nodesource.com/setup_10.x | bash -
RUN apt update
RUN apt-get -y install build-essential checkinstall wget
RUN apt-get -y install libreadline-gplv2-dev libncursesw5-dev libssl-dev \
                       libsqlite3-dev tk-dev libgdbm-dev libc6-dev libbz2-dev libffi-dev zlib1g-dev
WORKDIR /usr/bin
RUN wget https://www.python.org/ftp/python/3.9.2/Python-3.9.2.tgz
RUN tar xzf Python-3.9.2.tgz
WORKDIR /usr/bin/Python-3.9.2
RUN ./configure --enable-optimizations
RUN make altinstall
RUN apt-get -y install nodejs
RUN cd / && git clone -b newnew  --depth 1 https://github.com/QingdaoU/Judger && cd Judger && \
    mkdir build && cd build && cmake .. && make && make install && cd ../bindings/NodeJS && npm install && npm run build
RUN apt-get purge -y --auto-remove $buildDeps && \
    apt-get clean && rm -rf /var/lib/apt/lists/* && \
    mkdir -p /code && mkdir -p /output
WORKDIR /app
COPY package*.json ./
RUN npm i
RUN npm install -g pm2
COPY . .
RUN gcc -shared -fPIC -o unbuffer.so unbuffer.c
RUN mkdir -p /kotlin
ADD kotlin /kotlin
RUN chmod 777 -R /kotlin
RUN mkdir -p /java_submit
RUN chmod 777 -R /java_submit
RUN mkdir -p /kotlin_submit
RUN chmod 777 -R /kotlin_submit
EXPOSE 5000
EXPOSE 9092
CMD ["npm", "run", "start"]

