# -*- mode: ruby -*-
# vi: set ft=ruby :

Vagrant.configure(2) do |config|
  config.vm.box = "ubuntu/trusty64"

  config.vm.network "private_network", ip: "192.168.26.12"
  config.vm.network "forwarded_port", guest: 22, host: 26012

  config.vm.provider "virtualbox"

  config.vm.provision "shell", path: "vagrant/setup.sh"
end
