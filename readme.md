1. apt-get install nodejs
1. apt-get install npm
1. npm install -g n
1. n lts
1. n --version
1. node -v
1. sudo node -v
1. install http://www.airspayce.com/mikem/bcm2835/

    sudo apt-get install html-xml-utils
    mkdir -p bcm2835 && (wget -qO - `curl -sL http://www.airspayce.com/mikem/bcm2835 | hxnormalize -x -e | hxselect -s '\n' -c "div.textblock>p:nth-child(4)>a:nth-child(1)"` | tar xz --strip-components=1 -C bcm2835 )
    cd bcm2835
    ./configure
    make
    sudo make install

1. add user who will run the node site(s) to the gpio group

    > sudo adduser pi gpio

1. sudo raspi-config

Go to Interfaces and then to 1-Wire and enable it and reboot the device.

1. make sure the ds18b20 has a resister from 5v to the gpio pin then follow instructions here http://www.circuitbasics.com/raspberry-pi-ds18b20-temperature-sensor-tutorial/

-to start on restart of system
nano /etc/rc.local

    #start api posting script
    sudo node /home/pi/scripts/temp_controller/api.js &

    #start local web interface
    sudo node /home/pi/scripts/temp_controller/dashboard.js &

-   to start manually
    sudo node dashboard.js
