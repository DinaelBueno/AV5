from config import *

class Pais(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    nome = db.Column(db.String(200), nullable=False)
    capital = db.Column(db.String(200), nullable=False)
    continente = db.Column(db.String(200), nullable=False)
    populacao = db.Column(db.Integer, nullable=False)
    area = db.Column(db.Float, nullable=False)

    def json(self):
        return {
            "id": self.id,
            "nome": self.nome,
            "capital": self.capital,
            "continente": self.continente,
            "populacao": self.populacao,
            "area": self.area
        }
