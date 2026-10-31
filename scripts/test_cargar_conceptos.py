"""Pruebas de scripts/cargar_conceptos.py sin base de datos: solo genera el SQL.

  python3 scripts/test_cargar_conceptos.py
"""
import json
import pathlib
import subprocess
import sys
import unittest

sys.path.insert(0, str(pathlib.Path(__file__).parent))
from cargar_conceptos import explicacion_con_cita  # noqa: E402

LPRL = "data/ley31-1995/capitulo-v.json"


def generar(path, *extra):
    return subprocess.run([sys.executable, "scripts/cargar_conceptos.py", path, "--estado", "borrador", *extra],
                          capture_output=True, text=True, check=True).stdout


def preguntas_con_cita(path):
    d = json.loads(pathlib.Path(path).read_text(encoding="utf-8"))
    return [p for c in d["conceptos"] for p in c["preguntas"] if p.get("cita")]


class ExplicacionConCita(unittest.TestCase):
    def test_sin_cita_no_cambia(self):
        self.assertEqual(explicacion_con_cita({"explicacion": "Art. 1."}), "Art. 1.")

    def test_con_cita_la_anade(self):
        self.assertEqual(explicacion_con_cita({"explicacion": "Art. 1.", "cita": "texto literal"}),
                         "Art. 1. Cita literal: «texto literal».")

    def test_no_duplica_si_ya_esta(self):
        p = {"explicacion": "Art. 1: «texto literal».", "cita": "texto literal"}
        self.assertEqual(explicacion_con_cita(p), p["explicacion"])


class SqlGenerado(unittest.TestCase):
    def test_las_citas_propias_llegan_al_sql(self):
        ps = preguntas_con_cita(LPRL)
        self.assertTrue(ps, "el capítulo V tiene preguntas con cita propia")
        for modo in ((), ("--compacto",)):
            sql = generar(LPRL, *modo)
            for p in ps:
                self.assertIn(p["cita"].replace("'", "''"), sql, (modo, p["enunciado"]))

    def test_fichero_sin_citas_propias_genera_lo_mismo(self):
        path = "data/constitucion/titulo-preliminar.json"
        self.assertEqual(preguntas_con_cita(path), [])
        self.assertNotIn("Cita literal:", generar(path))


if __name__ == "__main__":
    unittest.main()
