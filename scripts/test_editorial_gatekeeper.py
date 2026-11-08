import csv
import tempfile
import unittest
from pathlib import Path
from editorial_gatekeeper import lint
from hash_cache import fingerprint

class EditorialGatekeeperTests(unittest.TestCase):
    def setUp(self):
        self.item = {
            'id_pregunta':'x1','id_origen':'f-1','tema':'17','epigrafe':'SVB',
            'fuente':'documento oficial','localizacion':'apartado 1',
            'enunciado':'Pregunta?','opcion_a':'Uno','opcion_b':'Dos',
            'opcion_c':'Tres','correcta':'A','explicacion':'Explicación',
            'nivel':'2','estado':'borrador','version_fuente':'2026'
        }

    def validate(self, items):
        with tempfile.TemporaryDirectory() as directory:
            path = Path(directory)/'lote.csv'
            with path.open('w', newline='', encoding='utf-8') as fh:
                writer=csv.DictWriter(fh,fieldnames=list(self.item))
                writer.writeheader()
                writer.writerows(items)
            return lint(path)

    def test_valid_single_draft(self):
        self.assertEqual([],self.validate([self.item]))

    def test_reject_duplicate_answer_options(self):
        row=dict(self.item,opcion_c='Uno')
        self.assertIn('DUPLICATE_OPTIONS',[x['code'] for x in self.validate([row])])

    def test_reject_non_draft(self):
        row=dict(self.item,estado='publicada')
        self.assertIn('NOT_DRAFT',[x['code'] for x in self.validate([row])])

    def test_reject_out_of_syllabus(self):
        row=dict(self.item,tema='41')
        self.assertIn('OUTSIDE_SYLLABUS',[x['code'] for x in self.validate([row])])

    def test_reject_invalid_correct_answer(self):
        row=dict(self.item,correcta='D')
        self.assertIn('BAD_ANSWER',[x['code'] for x in self.validate([row])])

    def test_reject_duplicate_ids(self):
        self.assertIn('DUPLICATE_ID',[x['code'] for x in self.validate([self.item,self.item])])

    def test_reject_more_than_thirty(self):
        items=[dict(self.item,id_pregunta=f'x{i}',enunciado=f'Pregunta {i}?') for i in range(31)]
        self.assertIn('BATCH_SIZE',[x['code'] for x in self.validate(items)])

    def test_explanation_changes_fingerprint(self):
        self.assertNotEqual(fingerprint(self.item,'v1'),
                            fingerprint(dict(self.item,explicacion='Modificada'),'v1'))

    def test_source_version_changes_fingerprint(self):
        self.assertNotEqual(fingerprint(self.item,'v1'),
                            fingerprint(dict(self.item,version_fuente='2027'),'v1'))

    def test_evaluator_version_changes_fingerprint(self):
        self.assertNotEqual(fingerprint(self.item,'v1'),fingerprint(self.item,'v2'))

if __name__ == '__main__':
    unittest.main()
