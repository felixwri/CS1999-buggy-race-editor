import unittest
import sqlite3 as sql
from components import validation
from components import data
from components import users
from components import default_user


def count_database(table):
    con = sql.Connection("database.db")
    try:
        cur = con.cursor()
        cur.execute(f"SELECT COUNT(*) FROM {table}")
        data = cur.fetchone()

    except Exception as e:
        print(e)
        con.rollback()
        data = 1

    finally:
        response = data[0]
        return response


class TestComponents(unittest.TestCase):
    # ? test multiple checks is validation.py
    def test_validation(self):
        user = default_user.get(asArray=False)
        response, msg = validation.process(user)
        self.assertTrue(response)

        user["qty_tyres"] = "2"
        response, msg = validation.process(user)
        self.assertFalse(response)

        user["qty_wheels"] = "2"
        response, msg = validation.process(user)
        self.assertFalse(response)

        user["buggy_name"] = "ThisIsATestThatTooMuchDataIsNotAccepted"
        response, msg = validation.process(user)
        self.assertFalse(response)

    # ? test database exists and that it has at least one row
    def test_database(self):
        response = count_database("buggies")

        self.assertNotEqual(response, 0)

    # ? test adding data to database
    def test_add_buggt_to_database(self):
        init_response = count_database("buggies")
        default = default_user.get(
            asArray=False, owner="admin", unnamedId=99999999)
        msg = data.addCar(default, "admin", private=99999999)
        print(msg)
        final_response = count_database("buggies")

        self.assertNotEqual(init_response, final_response)

    # ? test deleting data from database
    def test_delete_buggy_from_database(self):
        init_response = count_database("buggies")
        msg = data.deleteCar(99999999)
        print(msg)
        final_response = count_database("buggies")

        self.assertNotEqual(init_response, final_response)

    # ? test adding a user to the database
    def test_add_user_to_database(self):
        init_response = count_database("users")
        users.create("test_case", "this_user_does_not_exist")
        final_response = count_database("users")

        self.assertNotEqual(init_response, final_response)

    # ? test deleting user from the database
    def test_delete_user_from_database(self):
        init_response = count_database("users")
        users.destroy("test_case", "this_user_does_not_exist")
        final_response = count_database("users")

        self.assertNotEqual(init_response, final_response)


if __name__ == '__main__':
    unittest.main()
