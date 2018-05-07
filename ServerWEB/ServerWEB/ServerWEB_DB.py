import mysql.connector
from mysql.connector import pooling

dbconfig = {
    'user': 'webclient',
    'password': 'webconnect',
    'database': 'TempSystem',
    'host': 'localhost',
    'autocommit': True
}

cnxpool = pooling.MySQLConnectionPool(pool_name='sql_pool', pool_size=32, **dbconfig)