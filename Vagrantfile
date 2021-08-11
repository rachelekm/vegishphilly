# -*- mode: ruby -*-
# vi: set ft=ruby :

Vagrant.require_version ">= 2.2"

ANSIBLE_VERSION = "2.9.*"

Vagrant.configure(2) do |config|
  config.vm.box = "bento/ubuntu-20.04"

  config.ssh.username = "vagrant"
  config.ssh.password = "vagrant"

  config.vm.synced_folder "./", "/vagrant"
  # config.vm.synced_folder "~/.aws", "/home/vagrant/.aws"

  config.vm.provider :virtualbox do |vb|
    vb.memory = 4096
    vb.cpus = 4
  end

  # React
  config.vm.network :forwarded_port, guest: 4567, host: 4567
  # Django
  config.vm.network :forwarded_port, guest: 8033, host: 8033

  config.vm.provision "ansible_local" do |ansible|
    ansible.compatibility_mode = "2.0"
    ansible.install_mode = "pip_args_only"
    ansible.pip_args = "ansible==#{ANSIBLE_VERSION}"
    ansible.pip_install_cmd = "sudo apt-get install -y python3-distutils && curl https://bootstrap.pypa.io/get-pip.py | sudo python3"
    ansible.playbook = "deployment/ansible/vegishphilly.yml"
    ansible.galaxy_role_file = "deployment/ansible/roles.yml"
    ansible.galaxy_roles_path = "deployment/ansible/roles"
    ansible.extra_vars = { ansible_python_interpreter: "/usr/bin/python3" }
  end

  # Change working directory to /vagrant upon session start.
  config.vm.provision "shell" do |s|
    s.inline = <<-SHELL
    if ! grep -q "cd /vagrant" "/home/vagrant/.bashrc"; then
      echo "cd /vagrant" >> "/home/vagrant/.bashrc"
    fi

    cd /vagrant
    su vagrant ./scripts/update
    SHELL
  end
end
