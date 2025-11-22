#!/usr/bin/env python3

from pathlib import Path

def test_simple_frontmatter():
    """Test frontmatter parsing manually"""
    template_path = Path("prompts/templates/prompt-template.md")

    if not template_path.exists():
        print(f"Template file not found at {template_path}")
        return

    with open(template_path, 'r', encoding='utf-8') as f:
        content = f.read()

    print("Template content:")
    print(content)
    print("\n" + "="*50 + "\n")

    # Test if we can at least import without external dependencies
    print("Testing basic import structure...")

    # Simple YAML-like parsing test
    lines = content.split('\n')
    in_frontmatter = False
    frontmatter_lines = []
    content_lines = []

    for i, line in enumerate(lines):
        if line.strip() == '---':
            if not in_frontmatter:
                in_frontmatter = True
            else:
                in_frontmatter = False
                content_lines = lines[i+1:]
                break
        elif in_frontmatter:
            frontmatter_lines.append(line)

    print("Frontmatter detected:")
    for line in frontmatter_lines:
        print(f"  {line}")

    print(f"\nContent after frontmatter: {len(content_lines)} lines")

    return True

if __name__ == "__main__":
    test_simple_frontmatter()