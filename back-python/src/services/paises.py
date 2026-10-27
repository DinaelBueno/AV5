from config import *
from models.paises import Paises

def criar_pais(data):
    pais = Paises(
        nome=data['nome'],
        capital=data['capital'],
        tamanho=data['tamanho'],
        populacao=data['populacao'],
        idioma=data['idioma'],
    )
    
    # salvar no banco de dados
    db.session.add(pais)
    db.session.commit()
    
    return pais

def retornar_paises():
    # buscar todas as pessoas no 
    # banco de dados
    paises = Paises.query.all()
    
    return paises
