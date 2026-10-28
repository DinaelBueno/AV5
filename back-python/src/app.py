from config import *
from models.pessoa import Pessoa
from models.pais import Pais
from routes.pessoa import *
from routes.pais import *
from routes.utils import *
from routes.login import *

# cria o banco, caso não exista :-/
with app.app_context():
    db.create_all()
    auxiliar_criar_bd()

# this is the app start