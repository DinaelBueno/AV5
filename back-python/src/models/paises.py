from config import *

class Paises(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    nome = db.Column(db.String(100), nullable=False)
    capital = db.Column(db.String(100), nullable=False)
    tamanho = db.Column(db.Integer, nullable=False)
    populacao = db.Column(db.Integer, nullable=False)
    idioma = db.Column(db.String(200), nullable=False)


    def json(self):
        return {
            "id":self.id,
            "nome": self.nome,
            "capital": self.capital,
            "tamanho":self.tamanho,
            "populacao":self.populacao,
            "idioma":self.idioma   
            }
