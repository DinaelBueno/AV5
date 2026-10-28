from config import *
from models.pais import Pais
import services.pais as pais_service


@app.route('/paises', methods=['GET'])
def retornar_paises():


    paises = pais_service.retornar_paises()


    return jsonify({
        "resultado": "ok",
        "detalhes": [pais.json() for pais in paises]
    })



@app.route('/pais', methods=['POST'])
@jwt_required()
def criar_pais():


    dados = request.json


    if (
        not dados
        or not dados.get('nome')
        or not dados.get('capital')
        or not dados.get('continente')
        or dados.get('populacao') is None
        or dados.get('area') is None
    ):
        return jsonify({
            "resultado": "erro",
            "detalhes": "Nome, capital, continente, população e área são obrigatórios"
        }), 400


    pais = pais_service.criar_pais(dados)

    return jsonify({
        "resultado": "ok",
        "detalhes": pais.json()
    }), 201