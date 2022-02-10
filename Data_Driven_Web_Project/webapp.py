import flask
from flask import render_template, request, url_for, redirect
from datasource import *
import json
import sys
import psycopg2
import getpass

app = flask.Flask(__name__)
app.config['SEND_FILE_MAX_AGE_DEFAULT'] = 0

def connect(user, password):
	"""
		Establishes a connection with the perlman server.

		VARIABLES:
			user - username
			password - password

		RETURN:
			connection - connection to server with sql table
	"""
	try:
		connection = psycopg2.connect(database=user, user=user, password=password, host = "localhost")
	except Exception as e:
		print("Connection error: ", e)
		exit()
	return connection

# Using Fabricio's credential. Local host enabled.
user = 'ruasanchezf'
password = 'desktop379carpet'
localhost = 'localhost'
connection = connect(user, password)
ds = DataSource(connection)

@app.route('/')
def initial():
	"""
		renders homepage html. Provides the initial landing point for the website.
	"""
	return render_template('homepage.html')

@app.route('/home')
def home():
	"""
		Alternate route to display home page.
	"""
	return render_template('homepage.html')

@app.route('/about')
def about():
	"""
		Displays about page.
	"""
	return render_template('about.html')

@app.route('/contact')
def contact():
	"""
		Displays the contact page.
	"""
	return render_template('contact.html')

@app.route('/resultpage', methods=['GET', 'POST'])
def resultpage():
	"""
		Renders results page.
		Recieves front end user forms indicating the data needed. Runs the corresponding function
		from DataSource class to retrieve information.

		RETURNS:
			Returns data for the the table along with the title of the table to front end.
			If no form is provided, renders the static resultpage.
	"""
	if request.method == 'POST':
		if request.form.get('weaponType') != None:
			weaponType = request.form.get('weaponType')
			table = ds.getDataByWeaponType(weaponType)
			title = "Table with Weapon Type " + str(weaponType)
			return render_template('resultpage.html', table=table, title=title)
		if request.form.get('stateSelected') != None:
			stateSelected = request.form.get('stateSelected')
			table = ds.getDataByState(stateSelected)
			title = "Table of Incidents in: " + str(stateSelected)
			return render_template('resultpage.html', table=table, title=title)
		if request.form.get('startYear') != None and request.form.get('endYear') != None:
			startYear = int(request.form.get('startYear'))
			endYear = int(request.form.get('endYear'))
			if startYear > endYear:
				startYear, endYear = endYear, startYear
			table = ds.getDataByYear(startYear, endYear)
			title = "Table of Incidents from " + str(startYear) + " to " + str(endYear)
			return render_template('resultpage.html', table=table, title=title)
		if request.form.get('minVictims') != None and request.form.get('maxVictims') != None:
			minVictims = int(request.form.get('minVictims'))
			maxVictims = int(request.form.get('maxVictims'))
			if minVictims > maxVictims:
				minVictims, maxVictims = maxVictims, minVictims
			table = ds.getDataByNumberOfVictims(minVictims, maxVictims)
			title = "Table of Incidents with victims ranging " + str(minVictims) + " to " + str(maxVictims)
			return render_template('resultpage.html', table=table, title=title)
	return render_template('resultpage.html')



if __name__ == '__main__':
	if len(sys.argv) != 3:
		print('Usage: {0} host port'.format(sys.argv[0]), file=sys.stderr)
		exit()

	host = sys.argv[1]
	port = sys.argv[2]
	app.run(host=host, port=port)
