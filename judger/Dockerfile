FROM ubuntu:18.04

COPY build/java_policy /etc
RUN buildDeps='software-properties-common git libtool cmake python-dev python3-pip python-pip libseccomp-dev' && \
    apt-get update && apt-get install -y curl zip python python3 python-pkg-resources python3-pkg-resources gcc g++ $buildDeps && \
    add-apt-repository ppa:openjdk-r/ppa && add-apt-repository ppa:longsleep/golang-backports && apt-get update && apt-get install -y golang-go openjdk-8-jdk 
RUN curl -sL https://deb.nodesource.com/setup_10.x | bash -
RUN apt-get -y install nodejs
RUN cd / && git clone -b newnew  --depth 1 https://github.com/QingdaoU/Judger && cd Judger && \
    mkdir build && cd build && cmake .. && make && make install && cd ../bindings/NodeJS && npm install && npm run build
RUN apt-get purge -y --auto-remove $buildDeps && \
    apt-get clean && rm -rf /var/lib/apt/lists/* && \
    mkdir -p /code && mkdir -p /output
ADD server /code
WORKDIR /code
RUN npm i
RUN gcc -shared -fPIC -o unbuffer.so unbuffer.c
RUN mkdir -p /kotlin
ADD kotlin /kotlin
EXPOSE 5000
EXPOSE 9092
CMD ["npm", "run", "start"]
#ENV DOCKERIZE_VERSION v0.6.1
#RUN apt-get update && apt-get -y install wget \
#    && wget https://github.com/jwilder/dockerize/releases/download/$DOCKERIZE_VERSION/dockerize-alpine-linux-amd64-$DOCKERIZE_VERSION.tar.gz \
#    && tar -C /usr/local/bin -xzvf dockerize-alpine-linux-amd64-$DOCKERIZE_VERSION.tar.gz \
#    && rm dockerize-alpine-linux-amd64-$DOCKERIZE_VERSION.tar.gz
