#!/bin/bash

# Colors
Red="0;31"
Purple="0;35"
LightRed="1;31"
LightGreen="1;32"
Yellow="1;33"

# Path constants
base_dir=$(pwd)
output_dir="${base_dir}/dist"
bundle_path="${output_dir}/bundle.js"
src_dir="${base_dir}/src"
lib_dir="${base_dir}/lib"

# Helper functions
echoWithColor() {
  text=$1
  color="\033[$2m"
  NC="\033[0m"
  echo -e "$color $text $NC"
}

createBundle() {
  cat ${lib_dir}/runtime.js ${lib_dir}/init.js ${lib_dir}/frp.js ${lib_dir}/svg.js ${src_dir}/* >> $bundle_path
  echoWithColor "Bundle built\n" $LightGreen
}

watchFile() {
  dir=$1
  filter=$2
  cmd=$3
  chsum2=$(find -L $dir -type f -name $filter -exec md5 {} \;)
  if [[ $chsum1 != $chsum2 ]] ; then
    echoWithColor "Building bundle.." $Yellow
    $cmd
    chsum1=$chsum2
  fi

  while [[ true ]]
  do
    chsum2=$(find -L $dir -type f -name $filter -exec md5 {} \;)
    if [[ $chsum1 != $chsum2 ]] ; then
      echoWithColor "Rebuilding bundle.." $Yellow
      $cmd
      chsum1=$chsum2
    fi
    sleep 1
  done
}
