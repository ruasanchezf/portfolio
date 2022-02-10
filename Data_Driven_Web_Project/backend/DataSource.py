import psycopg2
import getpass

class DataSource:

    def __init__(self, connection):
        self.connection = connection

    def sortByWeapon(self, weaponType):
        """
        Returns a data table of incidents that were caused by a certain type of weapon.
        PARAMETERS:
            weaponType - type of weapon was used in the attack.
        RETURN:
            Returns a data table of incidents that were caused by a certain type of weapon.
        """
        additionalWeapons = { 'Handgun' : 'Multiple Handguns', 'Rifle': 'Multiple Rifles', 'Other': 'Unknown'}
        additional = ' '
        if weaponType in additionalWeapons:
            additional = additionalWeapons[weaponType]
        try:
            cursor = self.connection().cursor()
            query = "SELECT	incidentDay, school, weaponType FROM incidents WHERE weaponType='" + weaponType + "' OR weaponType='" + additional + "'"
            cursor.execute(query)
            return cursor.fetchall()

        except Exception as e:
            print ("Something went wrong when executing the query: ", e)
            return None

    def sortByLocation(self, location):
        """ Returns a data table of incidents that occured within a certain state or territory.
            PARAMETERS:
                location - US state or territory the incident occured in.
            RETURN:
                Returns a data table of incidents that occured within a certain state.
        """
        try:
            cursor = self.connection().cursor()
            query = "SELECT	incidentDay, school, state, city FROM incidents WHERE state='" + location + "'"
            cursor.execute(query)
            return cursor.fetchall()
        except Exception as e:
            print ("Something went wrong when executing the query: ", e)
            return None

    def sortByTimeFrame(self, timeFrame):
        """ Returns a data table of incidents that occured within a certain time frame.
            PARAMETERS:
                timeFrame -  a list of years that fall within the users desired time frame in years
            RETURN:
                Returns a data table of incidents that occured within a certain time frame.
         """
         try:
             cursor = self.connection().cursor()
             query = "SELECT	incidentDay, school, state, city FROM incidents WHERE incidentday LIKE '" + timeFrame
             cursor.execute(query)
             return cursor.fetchall()

         except Exception as e:
             print ("Something went wrong when executing the query: ", e)
             return None

    def sortByNumberOfVictims(self, vicitimNumberRange):
        """
        Returns a data table of all incidents that have a certain number of victims,
            wounded or killed, within the given range.
            PARAMETERS:
                vicitimNumberRange - sets the bounds for the number of victims in an incident
            RETURN:
                A data table of all incidents that have victims, wounded or killed, in the given range
        """
        pass

    def sortByAffiliation(self, affiliation):
        """Returns a data table of all incidents that occured where the shooter had a specific affiliation
            to the school or community. Categories include student, staff, teacher, ex-student, etc.
            PARAMETERS:
                affiliation - shooters affiliation to school
            RETURN:
                returns a data table of all incidents that occured where the shooter had a specific affiliation
                to the school or community.
        """
        pass

    def sortByHostageSituation(self, hostages):
        """ Returns a data table of incidents based on whether hostages were taken or not.
            PARAMETERS:
                hostages - whether the incidents involved a hostage situation, with yes or no statement
            RETURN:
                Returns a data table of incidents based on whether hostages were taken or not.
        """
        pass

    def sortByCauses(self, harassment, cause):
        """ Returns a data table of all incidents with specific causes. Whether the shooter was bullied,
            had domestic violence, or any situation that resulted in the attack.
            PARAMETERS:
                harassment -  whether or not the shooter experienced any bullying or domestic violence
                cause -  the cause that led to the attack (example: escalation of dispute, gang related,
                        mental health, etc.)
            RETURN:
                Returns a data table of all incidents with specific causes
        """
        pass

        def sortyBySchoolDetails(self, schoolType, location):
        """ Returns a data table of all incidents that match certain school aspects. Specifically
                regarding when/where the attack happened.
            PARAMETERS:
                schoolType - states whether the school is elementary, junior high, high, etc.
                location - where specifically in the school the attack began
            RETURN:
                Returns a data table of all incidents that match certain school aspects.
        """
        pass
