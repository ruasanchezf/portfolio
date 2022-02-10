'''
psycopg2-test.py
Sample code demonstrating how to use the psycopg2 Python library to connect
to a database and execute a query.
author: Amy Csizmar Dalal
date: 22 October 2019
Adapted from code originally written by Jeff Ondich
'''

import psycopg2
import getpass
from DataSource import *

def getInput(connection):
	properInput = False
	ds = DataSource(connection)
	while properInput == False:
		print("Options: \n a. WeaponType \n b. Location \n c. Incidents within a time frame")
		option = input("What would you like to search by? : ")
		option = option.lower()
		if option == 'a':
			weaponInput = getWeaponType()
			results = ds.sortByWeapon(weaponInput)
			properInput = True
		elif option == 'b':
			locationInput = getState()
			results = ds.sortByLocation(locationInput)
			properInput = True
		elif option == 'c':
			timeInput = getTimeFrame()
			results = ds.sortByTimeFrame(timeInput)
			properInput = True
		else:
			print("Please enter one of the options listed above.")
	return results

def getWeaponType():
	properInput = False
	while properInput == False:
		weapon = input("Please Select a Weapon Type: \n a. Handgun \n b. Rifle \n c. Shotgun \n d. Combination of Weapons \n e. Other \n Enter Letter: ")
		weapon = weapon.lower()
		if weapon == 'a':
			weapon = 'Handgun'
			properInput = True
		elif weapon == 'b':
			weapon = 'Rifle'
			properInput = True
		elif weapon == 'c':
			weapon = 'Shotgun'
			properInput = True
		elif weapon == 'd':
			weapon = 'Combination of Different Types of Weapons'
			properInput = True
		elif weapon == 'e':
			weapon = 'Other'
			properInput = True
		else:
			print("Please select a valid letter corresponding to the weapon. ")
	return weapon

def getState():
	states = {'AK': 'alaska','AL': 'alabama','AR': 'arkansas','AZ': 'arizona','CA': 'california','CO': 'colorado','CT': 'connecticut','DC': 'district of columbia','DE': 'delaware','FL': 'florida','GA': 'georgia','HI': 'hawaii','IA': 'iowa','ID': 'idaho','IL': 'illinois','IN': 'indiana','KS': 'kansas','KY': 'kentucky','LA': 'louisiana','MA': 'massachusetts','MD': 'maryland','ME': 'maine','MI': 'michigan','MN': 'minnesota','MO': 'missouri','MS': 'mississippi','MT': 'montana','NC': 'north carolina','ND': 'north dakota','NE': 'nebraska','NH': 'new hampshire','NJ': 'new jersey','NM': 'new mexico','NV': 'nevada','NY': 'new york','OH': 'ohio','OK': 'oklahoma','OR': 'oregon','PA': 'pennsylvania','RI': 'rhode island','SC': 'south carolina','SD': 'south dakota','TN': 'tennessee','TX': 'texas','UT': 'utah','VA': 'virginia','VI': 'virgin islands','VT': 'vermont','WA': 'washington','WI': 'wisconsin','WV': 'west virginia','WY': 'wyoming'}
	#http://code.activestate.com/recipes/577305-python-dictionary-of-us-states-and-territories/
	properInput = False
	while properInput == False:
		location = input("Please Enter A State: ")
		locationUpper = location.upper()
		locationLower = location.lower()
		if locationUpper in states.keys():
			location = locationUpper
			properInput = True
		elif locationLower in states.values():
			for key, value in states.items():
				if locationLower == value:
					location = key
					properInput = True
		else:
			print("Please Enter a Valid US State or Territory Name or Abbreviation")
	return location

def getTimeFrame():
	properInput = False
	while properInput == False:
		startYear = input("Please enter beginning year: ")
		endYear = input("Please enter end year: ")
		if startYear.isdigit() and endYear.isdigit():
			startYear = int(startYear)
			endYear = int(endYear)
			if startYear >= 1970 and endYear <= 2020 and startYear < endYear:
				listOfYears= getYearsBetween(startYear, endYear)
				timeFrame = writeTimeQuery(listOfYears)
				properInput = True
				return timeFrame
			else:
				print("Please make sure your values are between 1970 and 2020")
		else:
			print("Please enter year in a four digit format, example: 1996")

def getYearsBetween(startYear, endYear):
	listOfYears = []
	for i in range(startYear, endYear + 1):
		listOfYears.append(str(i))
	return listOfYears

def writeTimeQuery(listOfYears):
	timeFrame ="%" + listOfYears[0] + "'"
	for i in range(1, len(listOfYears)):
		timeFrame = timeFrame + " OR incidentDay LIKE '%" + listOfYears[i] + "'"
	return timeFrame


def connect(user, password):
	try:
		connection = psycopg2.connect(database=user, user=user, password=password)
	except Exception as e:
		print("Connection error: ", e)
		exit()
	return connection

def main():
	user = input("User Name: ")
	password = getpass.getpass()

	connection = connect(user, password)
	results = getInput(connection)

	if results is not None:
		print("Query results: ")
		for item in results:
			print(item)

	connection.close()

main()
