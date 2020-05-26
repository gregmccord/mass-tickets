#!/usr/bin/env python

#-----------------------------------------------------------------------
# Database.py
# Authors: Gregory McCord, Min Lee, and Rohan Joshi
#-----------------------------------------------------------------------

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
            self.conn = psycopg2.connect(host="ec2-52-44-166-58.compute-1.amazonaws.com",
                                         database="ddrajco9j89ohn",
                                         user="avmrhjkjylfyih",
                                         password="c7f82cfe3b4881b06b9bff655c85feb0e25191d319fee775e9431274c43bd109")


        self.cursor = self.conn.cursor()


    # Get available tickets for specified mass
    def get_num_tickets(self):

        self.cursor.execute("SELECT mass_day_time, num12, num34, num56 FROM tickets_by_mass")

        days = []
        tickets = {}
        row = self.cursor.fetchone()
        
        while row is not None:
            days.append(row[0])
            tickets[row[0]] = {"1-2" : row[1], "3-4" : row[2], "5-6": row[3]}
            row = self.cursor.fetchone()

        return tickets, days


    # 
    def check_has_ticket(self, mass_day_time, email):

        self.cursor.execute("SELECT ticket FROM tickets_by_email WHERE mass_day_time=%s AND email=%s", [mass_day_time, email])

        tickets = []
        row = self.cursor.fetchone()
        
        while row is not None:
            tickets.append(row[0])
            row = self.cursor.fetchone()

        return tickets


    # Get a new ticket for mass and update available amounts
    def get_new_ticket_for_mass(self, mass_day_time, num_people):
        pass


    # Close database connection
    def close(self):
        self.cursor.close()
        self.conn.close()


#-----------------------------------------------------------------------

# Test functions above by passing in case number to test
def _test():

    try:
        db = Database()

        # Create table
        db.cursor.execute(''' CREATE TABLE tickets_by_mass (
                                mass_day_time   varchar(50) NOT NULL,
                                num12           integer NOT NULL,
                                num34           integer NOT NULL,
                                num56           integer NOT NULL
                              ); ''')


        # TEST
        print('test')
        db.cursor.execute("INSERT INTO tickets_by_mass VALUES ('Saturday, May 30, 5:00PM', 0, 0, 0)")
        db.cursor.execute("INSERT INTO tickets_by_mass VALUES ('Sunday, May 31, 7:30AM', 5, 1, 0)")
        db.cursor.execute("INSERT INTO tickets_by_mass VALUES ('Sunday, May 31, 11:00AM', 5, 1, 6)")
        db.conn.commit()

        db.cursor.execute("SELECT * FROM tickets_by_mass")

        row = db.cursor.fetchone()
        
        while row is not None:
            print(row)
            row = db.cursor.fetchone()
    except:
        db.close()
        print('Table already exists')

    try:
        db = Database()

        # Create table
        db.cursor.execute(''' CREATE TABLE tickets_by_email (
                                mass_day_time   varchar(50) NOT NULL,
                                email           varchar(50) NOT NULL,
                                ticket          varchar(50) NOT NULL
                              ); ''')


        # TEST
        print('test')
        db.cursor.execute("INSERT INTO tickets_by_email VALUES ('Saturday, May 30, 5:00PM', 'gmccord@princeton.edu', 'TICKET')")
        db.cursor.execute("INSERT INTO tickets_by_email VALUES ('Sunday, May 31, 7:30AM', 'gmccord@princeton.edu', 'TICKET')")
        db.conn.commit()

        db.cursor.execute("SELECT * FROM tickets_by_email")

        row = db.cursor.fetchone()

        while row is not None:
            print(row)
            row = db.cursor.fetchone()
    except:
        db.close()
        print('Table already exists')

    db.close()

#-----------------------------------------------------------------------

if __name__ == '__main__':
    _test()

