import mysql.connector
import bcrypt
from flask import Flask, request, jsonify, abort
# Connect to the MySQL database
mydb = mysql.connector.connect(
    host="localhost",
    user="root",
    password="",
    database="translationapp"
)

#----------------------------------------------------------------------------#
#----------------------------- L O G I N ------------------------------------#
#----------------------------------------------------------------------------#

def login(username, password):
    
    cursor = mydb.cursor()

    query = f"SELECT * FROM user WHERE UserEmail='{username}'"
    cursor.execute(query)
    
    row = cursor.fetchone()
    if row is None:
        print("Invalid username or password.")
    else:
        hashed_password = get_hashed_password(username)
        if bcrypt.checkpw(password.encode('utf-8'), hashed_password.encode('utf-8')):
            print("Login successful!")
            cursor.close()
            return 1
       
        else:
            print("Invalid username or password.")
    
    cursor.close()


    
#----------------------------------------------------------------------------#
#----------------------------- R E G I S T E R ------------------------------#
#----------------------------------------------------------------------------#

def register(username, password, country):
    
    cursor = mydb.cursor()

    query = f"SELECT UserEmail FROM user WHERE UserEmail='{username}'"
    cursor.execute(query)
    result = cursor.fetchone()
    if result is not None:
        print("User already exists in the database.")
        abort(409, "User already exists in the database.")
        return
    
    salt = bcrypt.gensalt()

    try:
       
        hashed_password = bcrypt.hashpw(password.encode('utf-8'), salt)

        hashed_password_str = hashed_password.decode('utf-8')

        query = f"INSERT INTO user (UserEmail, UserPassword, country) VALUES ('{username}', '{hashed_password_str}', '{country}')"
        cursor.execute(query)
        mydb.commit()

        print("User registered successfully!")

        return 1;

    except ValueError as e:
        if str(e) == "Invalid salt":
           
            salt = bcrypt.gensalt()
            hashed_password = bcrypt.hashpw(password.encode('utf-8'), salt)
            hashed_password_str = hashed_password.decode('utf-8')

            query = f"INSERT INTO user (UserEmail, UserPassword, country) VALUES ('{username}', '{hashed_password_str}', '{country}')"
            cursor.execute(query)

            mydb.commit()
            print("User registered successfully with new salt and hashed password.")

        else:
            print("An error occurred while registering the user:", e)

    # Close the cursor
    cursor.close()



#----------------------------------------------------------------------------#
#----------------------------- PASSWORD HASHING ----------------------------#
#----------------------------------------------------------------------------#

def get_hashed_password(username):
  
    
    cursor = mydb.cursor()

    
    query = "SELECT UserPassword FROM user WHERE userEmail = %s"
    cursor.execute(query, (username,))
    result = cursor.fetchone()

    cursor.close()
  
    if result is not None:
        print("Password found")
        return result[0]
       
    else:
        print("User not found")
        return None 
    

#----------------------------------------------------------------------------#
#----------------------------- CLOSE CONNECTION -----------------------------#
#----------------------------------------------------------------------------#

def close_connection():
  
    global mydb
    mydb.close()
    mydb = None
    