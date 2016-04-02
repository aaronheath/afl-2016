# -*- mode: ruby -*-
# vi: set ft=ruby :

Vagrant.configure(2) do |config|
  config.vm.box = "bento/ubuntu-15.04"

  config.vm.network "private_network", ip: "192.168.10.12"

  config.vm.provider "vmware_fusion"

  config.vm.provision "shell", path: "vagrant/setup.sh"
end
