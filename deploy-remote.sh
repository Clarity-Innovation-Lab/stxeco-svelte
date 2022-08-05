#!/bin/bash -e
set -e;

export DEPLOYMENT=$1
PATH_DEPLOY=build
mkdir -p $PATH_DEPLOY
export SERVER=locke.brightblock.org
export BUILDER=build-stag
if [ "$DEPLOYMENT" == "prod" ]; then
  SERVER=chomsky.brightblock.org;
  BUILDER=build-prod
fi

printf "\n-----------------------------------------------------------------------------------------------------\n";
printf "Running script: $0 \n";
printf "Deploying to: $SERVER \n";
printf "\n-----------------------------------------------------------------------------------------------------\n";

function __build() {
  echo "Building $BUILDER ...";
  npm run $BUILDER
  echo "Initialisation of $BUILD_PATH complete";
}

function __pushcode() {
  echo "\n- deploying from pipeline build \n";
  rsync -aP -e "ssh  -p 7019" $PATH_DEPLOY/* static/* bob@$SERVER:/var/www/stxeco
}

BUILD_PATH=./
__build

__pushcode

exit 0;
