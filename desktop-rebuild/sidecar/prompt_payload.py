"""Local prompt payload builder for Pojia.

This module preserves prompt insertion as a feature while keeping the inserted
content to operator-authored persona text. It does not claim system priority,
disable provider policies, or rewrite model safety instructions.
"""
from __future__ import annotations

from dataclasses import dataclass


@dataclass(frozen=True)
class PromptPayload:
    target: str
    text: str
    character_count: int


def build_payload(user_prompt: str, target: str) -> PromptPayload:
    """Build the text block to insert into a supported client's prompt config."""
    normalized_target = (target or "").strip()
    if not normalized_target:
        raise ValueError("必须指定注入目标")
    prompt = (user_prompt or "").replace("\r\n", "\n").replace("\r", "\n").strip()
    if not prompt:
        raise ValueError("人格内容不能为空")

    # Deliberately do not add priority-escalation, policy override, or refusal-
    # suppression language. The user's own prompt remains intact.
    block = (
        "<!-- pojia-managed-prompt -->\n"
        f"<!-- target: {normalized_target} -->\n"
        f"{prompt}\n"
        "<!-- /pojia-managed-prompt -->"
    )
    return PromptPayload(
        target=normalized_target,
        text=block,
        character_count=len(block),
    )


def extract_payload(text: str) -> str | None:
    """Return the managed block, or None when this file has no managed block."""
    start = "<!-- pojia-managed-prompt -->"
    end = "<!-- /pojia-managed-prompt -->"
    source = text or ""
    left = source.find(start)
    if left < 0:
        return None
    right = source.find(end, left + len(start))
    if right < 0:
        return None
    return source[left:right + len(end)]
