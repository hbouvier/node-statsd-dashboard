# Statsd Dashboard


#LICENSE:

node-statsd-dashboard is licensed under the GNU LGPLv3

# Installation

npm install node-statsd-dashboard


# Usage as a Web Service

## Start the service

dashboard --port=3000 &

### You can also use the HTML User Interface

> http://localhost:3000/

# To deploy on Heroku

Make sure you have an account and the "heroku" command line tools installed.
This project already has a Procfile for heroku, the only left is to
replace __MyPersonalDashboard__ by the name you will chose for your service.

    heroku create --stack cedar __MyPersonalDashboard__
    git push heroku master

Then open your browser at http://__MyPersonalDashboard__.herokuapp.com/


