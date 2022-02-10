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
from datasource import *

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
	"""	Gets state name from user and put in in the correct form so that the backend program can use it
		to create database queries. States dictionary is placed here in order to facilitate front-end visuals
		in later implementation.

		PARAMETERS:

		RETURN:
			stateSelected - the state that the user selects. string data type representing state name in abbreviated from
	"""

	# A dictionary of state names and the corresponding abbreviations
	states = {'AK': 'alaska','AL': 'alabama','AR': 'arkansas','AZ': 'arizona','CA': 'california','CO': 'colorado','CT': 'connecticut','DC': 'district of columbia','DE': 'delaware','FL': 'florida','GA': 'georgia','HI': 'hawaii','IA': 'iowa','ID': 'idaho','IL': 'illinois','IN': 'indiana','KS': 'kansas','KY': 'kentucky','LA': 'louisiana','MA': 'massachusetts','MD': 'maryland','ME': 'maine','MI': 'michigan','MN': 'minnesota','MO': 'missouri','MS': 'mississippi','MT': 'montana','NC': 'north carolina','ND': 'north dakota','NE': 'nebraska','NH': 'new hampshire','NJ': 'new jersey','NM': 'new mexico','NV': 'nevada','NY': 'new york','OH': 'ohio','OK': 'oklahoma','OR': 'oregon','PA': 'pennsylvania','RI': 'rhode island','SC': 'south carolina','SD': 'south dakota','TN': 'tennessee','TX': 'texas','UT': 'utah','VA': 'virginia','VI': 'virgin islands','VT': 'vermont','WA': 'washington','WI': 'wisconsin','WV': 'west virginia','WY': 'wyoming'}
	#http://code.activestate.com/recipes/577305-python-dictionary-of-us-states-and-territories/

	while True:
		stateSelected = input("Please Enter A State: ")
		stateSelectedUpperCase = stateSelected.upper()
		stateSelectedLowerCase = stateSelected.lower()

		if stateSelectedUpperCase in states.keys():
			stateSelected = stateSelectedUpperCase
			return stateSelected

		elif stateSelectedLowerCase in states.values():
			for key, value in states.items():
				if stateSelectedLowerCase == value:
					stateSelected = key
					return stateSelected

		else:
			print("Please Enter a Valid US State or Territory Name or Abbreviation")



def getTwoYearsFromUser():
	""" The function will ask the user for two inputs of years between 1970 and 2020.
	 	These will be used to retrieve data between the two years from the database.
		The years must be between 1970 and 2020. The function will check the user input
		until it is a valid input and return the two years if valid. When this is visually
		implemented the user will be restricted into choosing years through a dropdown menu.

		PARAMETERS:

		RETURN:
			startYear - 4 digit string. The year the user wants the data to start.
			endYear - 4 digit string. The year the user wants the data to end.
	"""
	while True:
		startYear = input("Please enter beginning year (1970 ~ 2020): ")
		endYear = input("Please enter end year: (1970 ~ 2020)")
		if startYear.isdigit() and endYear.isdigit():
			startYear = int(startYear)
			endYear = int(endYear)
			if startYear >= 1970 and endYear <= 2020:
				print("Please make sure your values are between 1970 and 2020")
			elif startYear < endYear:
				print("Please make sure the years are in the right order")
			else:
				return startYear, endYear
		else:
			print("Please enter year in a four digit format, example: 1996")


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
	#results = getInput(connection)

	ds = DataSource(connection)

	results = ds.getDataByNumberOfVictims(0, 7)
	if results is not None:
		print("Query results: ")
		for item in results:
			try:
				print(item)
			except Exception as e:
				print("error: ", e)
	weaponType = getWeaponType()
	results = ds.getDataByWeaponType(weaponType)
	if results is not None:
		print("Query results for weapon type: ")
		for item in results:
			try:
				print(item)
			except Exception as e:
				print("error: ", e)

	stateSelected = getState()
	results = ds.getDataByState(stateSelected)
	if results is not None:
		print("Query results for state: ")
		for item in results:
			try:
				print(item)
			except Exception as e:
				print("error: ", e)

	startYear, endYear = getTwoYearsFromUser()
	results = ds.getDataByYear(startYear, endYear)
	if results is not None:
		print("Query results: ")
		for item in results:
			try:
				print(item)
			except Exception as e:
				print("error: ", e)

	connection.close()

main()
