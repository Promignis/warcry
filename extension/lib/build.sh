#!/bin/bash

Red="0;31"
Purple="0;35"
LightRed="1;31"
LightGreen="1;32"

echoWithColor() {
  text=$1
  color="\033[$2m"
  NC="\033[0m"
  echo -e "$color $text $NC"
}

# tmp hack
if [ $(basename $(pwd)) == "extension" ]; then
  cd ./lib
fi

rm bundle.js && cat runtime.js init.js frp.js svg.js ../components/* >> bundle.js
echoWithColor "Bundle built" $LightGreen

# add watcher script
