$distribution = cat /etc/*-release | grep DISTRIB_CODENAME | cut -d '=' -f 2
echo "deb https://apache.bintray.com/couchdb-deb $distribution main" \ | sudo tee -a /etc/apt/sources.list
