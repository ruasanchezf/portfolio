import psycopg2
import getpass

class DataSource:

	def __init__(self, connection):
		""" DataSource executes all of the queries on the database.
			It also formats the data to send back to the frontend, typically in a list
			or some other collection or object.

			PARAMETERS:
				connection - information needed to connect to the database

			VARIABLES:
				connection - information needed to connect to the database
				dataFieldDictionary - A dictionary of all the data fields in our database as keys
									  and the corresponding index of the data. Will be used later to access
									  to specific data fields within a table after the database query. The dictionary
									  will be used in later implementations when we create a graph.
		"""
		self.connection = connection
		self.dataFieldDictionary = {"incidentDay": 0, "school": 1, "city": 2, "state": 3, "reliabilityScore": 4,
									"killedIncludingShooter": 5, "wounded": 6, "totalInjuredorKilled": 7, "victimsGender": 8,
									"victimsRace": 9, "victimsEthnicity": 10, "targetedSpecificVictim": 11, "bullied": 12,
									"domesticViolence": 13, "prePlannedAttack": 14, "summary": 15, "category": 16,
									"schoolType": 17, "narrative": 18, "timeofIncident": 19, "duringSchoolDay": 20,
									"duringSportEvent": 21, "duringSchoolEvent": 22, "location": 23, "numberofShotsFired": 24,
									"weaponType": 25, "shooterName": 26, "shooterAge": 27, "shooterGender": 28,
									"shooterAffiliationtoSchool": 29, "hostagesTaken": 30}


	def getDataByWeaponType(self, weaponType):
		"""
		Returns a list of all data where the data field weaponType (name of weapon used)
		matches the user input of weapon name.

		PARAMETERS:
			weaponType - string of the weapon name

		RETURN:
			Returns a list of all data that the used weapon name matches weaponType or None if any exceptions occur
		"""

		additionalWeaponType = self.getAdditionalWeaponType(weaponType)

		try:
			cursor = self.connection.cursor()
			query = "SELECT * FROM incidents WHERE weaponType='" + weaponType + "' OR weaponType='" + additionalWeaponType + "'"
			cursor.execute(query)

			tableByWeaponType = cursor.fetchall()
			listOfDataByWeaponType = self.createListFromTable(tableByWeaponType)

			return listOfDataByWeaponType

		except Exception as e:
			print ("Something went wrong when executing the query: ", e)
			return None

	def getAdditionalWeaponType(self, weaponType):
		""" Weapon types in the database contain similar weapon types in different names.
			This method will return the corresponding cases if exists or an empty string if not.

			PARAMETERS:
				weaponType - string of the weapon name

			RETURN:
				additionalWeaponType - a string of the corresponding weapon name if it exists or an empty string if not
		"""

		additionalWeaponDictionary = { 'Handgun' : 'Multiple Handguns', 'Rifle': 'Multiple Rifles', 'Other': 'Unknown'}
		additionalWeaponType = ""

		if weaponType in additionalWeaponDictionary:
			additionalWeaponType = additionalWeaponDictionary.get(weaponType, "")

		return additionalWeaponType

	def createListFromTable(self, table):
		""" Creates a list of the data from given table.

			PARAMETERS:
				table - a table generated from a SQL query

			RETURN:
				listOfData - a list containing all the data of the given table.
		"""
		listOfData = []

		for data in table:
			listOfData.append(data)

		return listOfData


	def getDataByState(self, stateSelected):
		""" Returns the list of incidents that occured within a certain state or territory.

			PARAMETERS:
				stateSelected - US state or territory the incidents occured in.

			RETURN:
				Returns the list of incidents that occured within that particular US state or territory.
		"""

		try:
			cursor = self.connection.cursor()
			query = "SELECT	* FROM incidents WHERE state='" + stateSelected + "'"
			cursor.execute(query)

			tableByState = cursor.fetchall()
			listOfIncidentsInState = self.createListFromTable(tableByState)

			return listOfIncidentsInState

		except Exception as e:
			print ("Something went wrong when executing the query: ", e)
			return None

	def getDataByYear(self, startYear, endYear):
		""" Returns a list containing all data of incidents that occured between two specific years.

			PARAMETERS:
				startYear - the starting year of the data the user wants
				endYear - the end year of the data the user wants

			RETURN:
				Returns a list of all the data between startYear and endYear or None if any exceptions occur
		"""
		try:
			cursor = self.connection.cursor()

			listOfYears = self.getAllNumbersBetween(startYear, endYear)
			timeQuery = self.writeTimeQuery(listOfYears)
			cursor.execute(timeQuery)

			tableByYear = cursor.fetchall()
			listOfDataByYear = self.createListFromTable(tableByYear)

			return listOfDataByYear

		except Exception as e:
			print ("Something went wrong when executing the query: ", e)
			return None



	def writeTimeQuery(self, listOfYears):
		""" Creates a query that will fetch all the data from the table for all the years
			in the listOfYears.

			PARAMETERS:
				listOfYears - a list containing all the years between two years in string data types.

			RETURN:
				timeQuery - string query to fetch data from database using SQL
		"""

		timeQuery= "SELECT * FROM incidents WHERE "

		for i in range(0, len(listOfYears)):
			if i == 0:
				timeQuery = timeQuery + "incidentday LIKE '%" + listOfYears[0] + "'"
			else:
				timeQuery = timeQuery + " OR incidentDay LIKE '%" + listOfYears[i] + "'"

		return timeQuery

	def getDataByNumberOfVictims(self, minVicitims, maxVictims):
		"""	Recieves inputs for the range of victims the user wants in he or her data and
			returns a list of data where the number of victims in the incident are between
			a certain range.

			PARAMETERS:
				minVicitims - string digit for the minimum number of victims in the range
				maxVictims - string digit for the maximum number of victims in the range

			RETURN:
				A list of all the data where the number of victims in the incident are between
				a certain range. Returns None if exception occurs.
		"""

		try:
			cursor = self.connection.cursor()

			listOfVictimNumbers = self.getAllNumbersBetween(minVicitims, maxVictims)
			victimNumberQuery = self.writeVictimNumberQuery(listOfVictimNumbers)
			if victimNumberQuery == "SELECT * FROM incidents WHERE ":
				return[]
			else:
				cursor.execute(victimNumberQuery)
				tableByVictimRange = cursor.fetchall()
				listOfDataByVictimRange = self.createListFromTable(tableByVictimRange)

				return listOfDataByVictimRange

		except Exception as e:
			print("Something went wrong when executing the query: ", e)
			return None


	def getAllNumbersBetween(self, min, max):
		""" Returns a list containing all the numbers between a specified range.

			PARAMETERS:
				min - the starting number of the range the user wants
				max - the end number of the range the user wants

			RETURN:
				listOfNumbers - a list containing all the numbers in strings
				between and including min and max
		"""
		listOfNumbers = []

		for i in range(min, max + 1):
			listOfNumbers.append(str(i))

		return listOfNumbers

	def writeVictimNumberQuery(self, listOfVictimNumbers):
		""" Creates a query that will fetch all the data from the table for all the number of victims
			within a given range

			PARAMETERS:
				listOfVictimNumbers - a list containing all the numbers between a given min and Max
			RETURN:
				victimNumberQuery - string query to fetch data from database using SQL
		"""

		victimNumberQuery= "SELECT * FROM incidents WHERE "

		for i in range(0, len(listOfVictimNumbers)):
			if i == 0:
				victimNumberQuery = victimNumberQuery + "totalInjuredorKilled=" + listOfVictimNumbers[i]
			else:
				victimNumberQuery = victimNumberQuery + " OR totalInjuredorKilled=" + listOfVictimNumbers[i]

		return victimNumberQuery

	def getDataByAffiliation(self, affiliation):
		""" Returns a list of data where the shooter has a specific affiliation with the school.
			Categories for affiliation include student, staff, teacher, ex-student, etc.

			PARAMETERS:
				affiliation - string describing shooters affiliation with the school

			RETURN:
				Returns a list of the all of the data where the shooter has a specific affiliation
				with the school. Returns None if exception occurs.
		"""
		affiliationList = ["Student", "Other Staff", "No Relation", "Unknown", "Police Officer/SRO", "Other Staff", "Teacher",
		"Former Student", "Intimate Relationship With Victim", "Relative", "None", "Parent", ]

		return []

	def getByHostageSituation(self, hostages):
		""" Returns the list of incidents depending on if hostages were taken.

			PARAMETERS:
				hostages - indicates whether hostages were taken with a "yes" or a "no" in order
				to tailor the search results for the user.

			RETURN:
				Returns a list of incidents based on whether hostages were taken or not.
				Returns None if exception occurs.
		"""

		return []


	def getDataIfShooterExperiencedHarrasmentYesOrNo(self, experiencedHarrasment):
		""" Return a list of data based on whether the shooter experienced either bullying or domestic violence
			prior to the incident.

			PARAMETERS:
				experiencedHarrasment - boolean True or False whether the shooter experienced either bullying or domestic violence
					 prior to the incident.

			RETURN:
				List of data based on whether the shooter experienced either bullying or domestic violence
				Returns None if exception occurs.
		"""

		return []

	def getDataByCauses(self, cause):
		""" Returns a data table of all incidents with specific causes. The user can select a specific
			cause for the shooting. Causes include, escalation of dispute, gang related, mental health, etc.

			PARAMETERS:
				cause - the cause that led to the attack in string data (example: escalation of dispute,
						gang related, mental health, etc.)

			RETURN:
				Returns a data list of all data for incidents with that match the specific causes.
				Returns None if exception occurs.
		"""

		return []


	def getDataBySchoolDetails(self, schoolType):
		""" Returns a list of data where the school type matches the given school type.
			School type includes elementary, junior high, high, etc.

			PARAMETERS:
				schoolType - string that indicates the school type.

			RETURN:
				Returns a list of data where the school type matches the given school type.
				Returns None if exception occurs.
		"""

		return []

	def CountElementsForGraph(self, datafield):
		""" Counts all the elements in the specified data field so that we can use it to
			create graphs. We will count all the elements in the data using a dictionary.

			PARAMETERS:
				datafield - the data field we will be creating the graph on. string data matching
							one of the key values in the dataFieldDictionary.

			RETURN:
				a dictionary containing each of the elements in the data field and the
				corresponding value for each key which would represent how many times the
				key shows up in integer data type. Returns None if exception occurs.
		"""

		return {}
