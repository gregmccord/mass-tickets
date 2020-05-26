#!/usr/bin/env python

#-----------------------------------------------------------------------
# Database.py
# Authors: Gregory McCord, Min Lee, and Rohan Joshi
#-----------------------------------------------------------------------

from sys import argv
import psycopg2
import time
import os
from datetime import datetime

class Database (object):

    # Initialize a registrar database object
    def __init__(self):

        try:
            # On Heroku
            DATABASE_URL = os.environ['DATABASE_URL']
            self.conn = psycopg2.connect(DATABASE_URL, sslmode='require')

        except:
            # on localhost
            self.conn = psycopg2.connect(host="ec2-18-213-176-229.compute-1.amazonaws.com",
                                         database="d5h5eghbt2hhaq",
                                         user="ddbesipqncgtrs",
                                         password="575c5665caf3db12bc5e63cd98d1e9319aeb9854399e5621d9320bc8e0c48dca")


        self.cursor = self.conn.cursor()


    # Get available tickets for specified mass
    def get_tickets_for_mass(self, mass_day_time):

        self.cursor.execute("SELECT num12, num34, num56 FROM tickets_by_mass WHERE mass_day_time = %s;", [mass_day_time])

        results = []
        row = self.cursor.fetchone()
        
        while row is not None:
            results.append(row)
            row = self.cursor.fetchone()

        return results


    # Get a new ticket for mass and update available amounts
    def get_new_ticket_for_mass(self, mass_day_time, num_people):
        pass


    # Close database connection
    def close(self):
        self.cursor.close()
        self.conn.close()


#-----------------------------------------------------------------------

# Test functions above by passing in case number to test
def _test(case):

    # Initialize instance of object to test on
    db = Database()



    db.close()

#-----------------------------------------------------------------------

if __name__ == '__main__':
    _test(int(argv[1]))

