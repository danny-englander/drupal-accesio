#!/usr/bin/env bash
green='\033[0;32m'
NC='\033[0m'

cd web/themes/custom/accesio

if [ -d "node_modules" ]
then
    echo "Directory node_modules exists."
    echo -e "${green}Removing node_modules folder${NC}"
    rm -R node_modules
else
    echo ""
fi

echo -e "${green}Installing NPMs${NC}"
npm install

echo -e "${yellow}Gulp Build${NC}"
gulp
