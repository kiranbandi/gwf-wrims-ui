#!/bin/sh
# Script to update nginx server
# create new build folder
npm run build
cd ..
cd nginx
# stop nginx server
nginx -s stop
# clear old assets
rm -rf html/
# copy new assets
cp -a ../gwf-wrims-ui/build/. html/
# restart nginx server
nginx -s reload
echo "Deploy complete successfully"
