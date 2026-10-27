from config import *
from models.paises import Paises
import services.paises as paises_service

'''
--------------
LISTAR PAISES
--------------
'''

'''
TESTE DE ROTA - Paises - GET

curl localhost:5000/paises
{
  "detalhes": [
    {
      "nome": "Dinamarca",
      "id": 1,
      "tamanho": "15000",
      "populacao": "5000",
      "idioma": "Japones",
    }
  ],
  "resultado": "ok"
}

'''



@app.route('/paises', methods=['GET'])
def retornar_paises():
    paises = paises_service.retornar_paises()
    return jsonify({
        "resultado": "ok",
        "detalhes":[pais.json() for pais in paises]
    })


@app.route('/pais', methods=['POST'])
@jwt_required()
def criar_pais():
    dados = request.get_json(silent=True)
    campos_obrigatorios = ("nome", "capital", "tamanho", "populacao", "idioma")

    if not isinstance(dados, dict) or any(
      dados.get(campo) is None or dados.get(campo) == ""
      for campo in campos_obrigatorios
    ):
      return jsonify({
        "resultado": "erro",
        "detalhes": "Nome, capital, tamanho, população e idioma são obrigatórios",
      }), 400

    try:
      dados["tamanho"] = int(dados["tamanho"])
      dados["populacao"] = int(dados["populacao"])
    except (TypeError, ValueError):
      return jsonify({
        "resultado": "erro",
        "detalhes": "Tamanho e população devem ser números inteiros",
      }), 400

    if dados["tamanho"] <= 0 or dados["populacao"] <= 0:
      return jsonify({
        "resultado": "erro",
        "detalhes": "Tamanho e população devem ser maiores que zero",
      }), 400
    pais = paises_service.criar_pais(dados)

    return jsonify({
        "resultado":"ok",
        "detalhes":pais.json()
      }), 201

