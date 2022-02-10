import unittest
from datasource import *
import psycopg2

class DataSourceTester(unittest.TestCase):
	def setUp(self):
		def connect(user, password):
			try:
				connection = psycopg2.connect(database=user, user=user, password=password)
			except Exception as e:
				print("Connection error: ", e)
				exit()
			return connection
		user = "ruasanchezf"
		password = "desktop379carpet5128"
		connection = connect(user, password)
		self.ds = DataSource(connection)

	def test_getDataByNumberOfVictims(self):
		self.assertNotEqual(self.ds.getDataByNumberOfVictims(0,7), [])
		self.assertNotEqual(self.ds.getDataByNumberOfVictims(4,4), [])
		self.assertNotEqual(self.ds.getDataByNumberOfVictims(-1,4), [])
		self.assertEqual(self.ds.getDataByNumberOfVictims(7,4), [])
		self.assertEqual(self.ds.getDataByNumberOfVictims(-2, -1), [])

	def test_getAllNumbersBetween(self):
		self.assertEqual(self.ds.getAllNumbersBetween(4,7), ["4","5","6","7"])
		self.assertEqual(self.ds.getAllNumbersBetween(4,4), ["4"])
		self.assertEqual(self.ds.getAllNumbersBetween(7,4), [])
		self.assertEqual(self.ds.getAllNumbersBetween(-1,4), ["-1", "0", "1", "2", "3", "4"])

	def test_writeVictimNumberQuery(self):
		self.assertEqual(self.ds.writeVictimNumberQuery(["4","5","6","7"]), "SELECT * FROM incidents WHERE totalInjuredorKilled=4 OR totalInjuredorKilled=5 OR totalInjuredorKilled=6 OR totalInjuredorKilled=7")
		self.assertEqual(self.ds.writeVictimNumberQuery(["3"]), "SELECT * FROM incidents WHERE totalInjuredorKilled=3")
		self.assertEqual(self.ds.writeVictimNumberQuery([]), "SELECT * FROM incidents WHERE ")
		self.assertEqual(self.ds.writeVictimNumberQuery(["-1", "0", "1"]), "SELECT * FROM incidents WHERE totalInjuredorKilled=-1 OR totalInjuredorKilled=0 OR totalInjuredorKilled=1")

if __name__ == '__main__':
	unittest.main()
