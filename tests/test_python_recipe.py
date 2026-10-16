import unittest
import sys
import os

sys.path.insert(0, os.path.abspath(os.path.join(os.path.dirname(__file__), '..', 'python')))
from secure_dispatch import create_signed_token, verify_signed_token

class TestPythonRecipe(unittest.TestCase):
    def setUp(self):
        self.secret = "test-secret-key-python-recipe-32chars!"

    def test_create_and_verify_token(self):
        token = create_signed_token("deck.pdf", self.secret, "alice@vc.com", expires_in_sec=600)
        res = verify_signed_token(token, self.secret)
        self.assertTrue(res["valid"])
        self.assertEqual(res["payload"]["doc_id"], "deck.pdf")
        self.assertEqual(res["payload"]["email"], "alice@vc.com")

    def test_tampered_token_rejected(self):
        token = create_signed_token("deck.pdf", self.secret, "alice@vc.com")
        tampered = token[:-4] + "wxyz"
        res = verify_signed_token(tampered, self.secret)
        self.assertFalse(res["valid"])
        self.assertIn("Signature mismatch", res["error"])

if __name__ == '__main__':
    unittest.main()
