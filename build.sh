#!/bin/bash

Red="0;31"
Purple="0;35"
LightRed="1;31"
LightGreen="1;32"

base_dir=$(pwd)
output_dir="${base_dir}/dist"
bundle_path="${output_dir}/bundle.js"
src_dir="${base_dir}/src"
lib_dir="${base_dir}/lib"

echoWithColor() {
  text=$1
  color="\033[$2m"
  NC="\033[0m"
  echo -e "$color $text $NC"
}

# in case bundle doesn't already exist
touch $bundle_path
# delete old bundle
rm $bundle_path

# create new bundle
# currently just append all files together to create main bundle
cat ${lib_dir}/runtime.js ${lib_dir}/init.js ${lib_dir}/frp.js ${lib_dir}/svg.js ${src_dir}/* >> $bundle_path

echoWithColor "Bundle built" $LightGreen

# add watcher script
