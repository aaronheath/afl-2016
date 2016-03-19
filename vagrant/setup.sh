#!/usr/bin/env bash

#######################################
## DIST SETUP - PHASE ONE
#######################################

# Update packages
sudo apt-get update

# Install Packages
sudo apt-get install -y apache2 curl

# Add Sources
curl -sL https://deb.nodesource.com/setup_5.x | sudo -E bash -

# Install NPM Packages
#

#######################################
## DIST SETUP - PHASE TWO
#######################################

# Update packages
sudo apt-get update

# Install Packages
sudo apt-get install -y nodejs

# Install NPM Packages
sudo npm install --global gulp-cli

#######################################
## SETUP
#######################################

# Apache
sudo su -
cp /vagrant/vagrant/apache-site-config.conf /etc/apache2/sites-available/default
sudo a2enmod rewrite
service apache2 restart
exit

# NPM
cd /vagrant
npm set progress=false
