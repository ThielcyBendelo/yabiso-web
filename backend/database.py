# database.py
from motor.motor_asyncio import AsyncIOMotorClient
from odmantic import AIOEngine

# Si connexion locale (Compass) : "mongodb://localhost:27017"
# Si connexion Cloud Atlas : "mongodb+srv://bendelothielcy_db_user:bendelo1996$$$@mvercekl.mongodb.net/"
MONGO_URL = "mongodb://localhost:27017" 
DATABASE_NAME = "yabiso_db_drc"

# Initialisation du client asynchrone Motor
client = AsyncIOMotorClient(MONGO_URL)

# Initialisation du moteur ODMantic pour mapper nos modèles de documents NoSQL
engine = AIOEngine(client=client, database=DATABASE_NAME)

# Dépendance pour obtenir l'instance NoSQL dans les routes FastAPI
async def get_db():
    yield engine
