import pandas as pd
import sqlite3

# 1. Load the raw data
df_energy = pd.read_csv('energy_dataset.csv')
df_weather = pd.read_csv('weather_features.csv')

# 2. Basic Cleaning (Crucial Step)
# Convert timestamps to actual datetime objects so SQL understands them
df_energy['time'] = pd.to_datetime(df_energy['time'], utc=True)
df_weather['dt_iso'] = pd.to_datetime(df_weather['dt_iso'], utc=True)

# 3. Create/Connect to your SQLite database
conn = sqlite3.connect('energy_project.db')
cursor = conn.cursor()

# 4. Write data to SQL (This creates the tables automatically)
# We use 'replace' to overwrite if you run this multiple times
df_energy.to_sql('energy_data', conn, if_exists='replace', index=False)
df_weather.to_sql('weather_data', conn, if_exists='replace', index=False)

print("Database created successfully! Files loaded into 'energy_project.db'")

# 5. Quick Test: Run a SQL Query to prove it works
# "Show me the top 5 hours with the highest solar generation"
test_query = """
SELECT time, "generation solar" 
FROM energy_data 
ORDER BY "generation solar" DESC 
LIMIT 5;
"""
print(pd.read_sql(test_query, conn))

conn.close()