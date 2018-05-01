import mysql.connector
from mysql.connector import pooling

dbconfig = {
    'user': 'testclient',
    'password': 'testconnect',
    'database': 'TempSystem',
    'host': '192.168.1.100',
    'autocommit': True
}

cnxpool = pooling.MySQLConnectionPool(pool_name='sql_pool', pool_size=32, **dbconfig)