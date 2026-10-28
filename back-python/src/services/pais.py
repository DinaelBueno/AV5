from config import *
from models.pais import Pais


def criar_pais(data):

   
    pais = Pais(
        nome=data['nome'],
        capital=data['capital'],
        continente=data['continente'],
        populacao=data['populacao'],
        area=data['area']
    )


    db.session.add(pais)
    db.session.commit()

    return pais


def retornar_paises():


    paises = Pais.query.all()

    return paises