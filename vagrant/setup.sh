#!/usr/bin/env bash

echo '----------------------'
echo '------ SETUP.SH ------'
echo '----------------------'

#######################################
## DIST SETUP
#######################################

# Update packages
sudo apt-get update

# Install Packages
sudo apt-get install -y apache2 curl libfontconfig

# Add Sources
curl -sL https://deb.nodesource.com/setup_5.x | sudo -E bash -

# Install Node & NPM Packages
sudo apt-get install -y nodejs
sudo npm set progress=false
sudo npm install --global gulp-cli

#######################################
## SETUP
#######################################

# Apache
sudo su -
cp /vagrant/vagrant/apache-site-config.conf /etc/apache2/sites-available/000-default.conf
sudo a2enmod rewrite
service apache2 restart
exit

echo '----------------------------'
echo '------ SETUP.SH (end) ------'
echo '----------------------------'
