#!/bin/bash
source scripts/helpers.sh

# in case bundle doesn't already exist
touch $bundle_path
# delete old bundle
rm $bundle_path

# create new bundle
# currently just append all files together to create main bundle



watchFile "${src_dir} ${lib_dir}" "*.js" "createBundle"
