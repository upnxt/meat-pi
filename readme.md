# What is this?
Meat Pi is a controller/api/web site built to help control and monitor meat curing and home brew chamber conditions. Internal chamber conditions are continously monitored via temperature and humidity sensors and power is toggled on/off to the chamber (freezer/fridge/dehumidifier) depending on the sensor readouts and the configuration settings that have been set.

This is more of an example project than anything for most people. Feel free to fork, I have no intentions of maintaining this on any regular basis.

![web ui](https://i.imgur.com/8dJscbG.png)

# Required equipment
1. Raspberry Pi
2. ds18b20 temperature sensor
3. dht22 humidity sensor
4. 3 relays

# Dependency setup

Install nodejs and npm

> apt-get install nodejs npm

Install a node version manager

> npm install -g n

Install latest stable version of node

> n lts

Check to make sure n actually worked

> n --version

> node -v

> sudo node -v

The ds18b20 temperature guage is dependent on the BCM2835 library (http://www.airspayce.com/mikem/bcm2835/)

> sudo apt-get install html-xml-utils

> mkdir -p bcm2835 && (wget -qO - `curl -sL http://www.airspayce.com/mikem/bcm2835 | hxnormalize -x -e | hxselect -s '\n' -c "div.textblock>p:nth-child(4)>a:nth-child(1)"` | tar xz --strip-components=1 -C bcm2835 )

> cd bcm2835

> ./configure

> make

> sudo make install

Add user who will run the node site(s) to the gpio group

> sudo adduser pi gpio

Enable 1-Wire devices

> sudo raspi-config
> Go to Interfaces, then 1-Wire and select "enable"

Make sure the ds18b20 temperature guage has a resister from 5v to the gpio pin then follow instructions here http://www.circuitbasics.com/raspberry-pi-ds18b20-temperature-sensor-tutorial/

# Start the site on restart of the system

> sudo nano /etc/rc.local

> #start local web interface

> sudo node /share/apps/meat-pi/src/index.js &

# Start the site manually

> sudo node src/index.js
