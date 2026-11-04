import unittest

from prompt_payload import build_payload, extract_payload


class PromptPayloadTests(unittest.TestCase):
    def test_preserves_operator_text_without_priority_wrapper(self):
        source = "请用中文回答。\n保留原有项目结构。"
        payload = build_payload(source, "codex")
        self.assertIn(source, payload.text)
        self.assertIn("target: codex", payload.text)
        self.assertNotIn("最高优先级", payload.text)
        self.assertNotIn("忽略安全", payload.text)

    def test_extracts_only_managed_block(self):
        payload = build_payload("自定义人格", "claude")
        self.assertEqual(extract_payload("before\n" + payload.text + "\nafter"), payload.text)

    def test_rejects_empty_prompt_or_target(self):
        with self.assertRaises(ValueError):
            build_payload("", "codex")
        with self.assertRaises(ValueError):
            build_payload("有效内容", "")


if __name__ == "__main__":
    unittest.main()
