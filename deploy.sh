#!/bin/sh
# Script to update nginx server
# create new build folder
npm run build
# stop nginx server
service nginx stop
# clear old assets
rm -rf /var/www/html/
# copy new assets
cp -a build/. /var/www/html/
# restart nginx server
service nginx restart
echo "Deploy complete successfully"