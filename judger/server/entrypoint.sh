#!/bin/bash

#curl -s https://get.sdkman.io | bash
#chmod a+x "$HOME/.sdkman/bin/sdkman-init.sh"
#source "$HOME/.sdkman/bin/sdkman-init.sh"
#sdk install kotlin
#
#rm -rf /judger/*
#
#mkdir -p /judger/run
#chmod 777 /judger/run

exec pm2-runtime start config/pm2.config.js
