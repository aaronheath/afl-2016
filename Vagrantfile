# -*- mode: ruby -*-
# vi: set ft=ruby :

Vagrant.configure(2) do |config|
  config.vm.box = "ubuntu/trusty64"

  config.vm.network "private_network", ip: "192.168.12.2"

  config.vm.provider "virtualbox"

  config.vm.provision "shell", path: "vagrant/setup.sh"
end
