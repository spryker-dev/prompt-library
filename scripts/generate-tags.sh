#!/bin/bash
# Generate tag-to-prompt mapping from all markdown files

echo "🏷️  Generating prompt tags mapping..."

# Use Python for better JSON handling
python3 -c "
import os
import json
import re
from pathlib import Path

def extract_tags_from_file(file_path):
    '''Extract tags from markdown file'''
    try:
        with open(file_path, 'r', encoding='utf-8') as f:
            content = f.read()

        # Find tags section
        match = re.search(r'^## Tags.*?\n(.+?)$', content, re.MULTILINE | re.IGNORECASE)
        if match:
            tags_line = match.group(1).strip()
            # Split by comma and clean up
            tags = [tag.strip().lower() for tag in tags_line.split(',') if tag.strip()]
            return tags
    except Exception as e:
        print(f'Error reading {file_path}: {e}')
    return []

def main():
    tags_mapping = {}

    # Find all markdown files (excluding templates and README)
    prompts_dir = Path('ai-prompts/prompts')
    if not prompts_dir.exists():
        prompts_dir = Path('prompts')  # Fallback for direct execution

    for md_file in prompts_dir.rglob('*.md'):
        # Skip templates and README files
        if 'templates' in md_file.parts or md_file.name == 'README.md':
            continue

        tags = extract_tags_from_file(md_file)
        relative_path = str(md_file.relative_to(Path('.')))

        for tag in tags:
            if tag:
                print(f'Found tag: {tag} -> {relative_path}')

                if tag in tags_mapping:
                    # Tag already exists
                    if isinstance(tags_mapping[tag], list):
                        # Already an array, add if not present
                        if relative_path not in tags_mapping[tag]:
                            tags_mapping[tag].append(relative_path)
                    else:
                        # Convert to array
                        if tags_mapping[tag] != relative_path:
                            tags_mapping[tag] = [tags_mapping[tag], relative_path]
                else:
                    # First occurrence
                    tags_mapping[tag] = relative_path

    # Write JSON file
    with open('prompt-tags.json', 'w') as f:
        json.dump(tags_mapping, f, indent=2)

    print(f'✅ Generated prompt-tags.json with {len(tags_mapping)} tags')

    # Show some stats
    single_prompts = sum(1 for v in tags_mapping.values() if isinstance(v, str))
    multi_prompts = sum(1 for v in tags_mapping.values() if isinstance(v, list))

    if multi_prompts > 0:
        print(f'📊 {single_prompts} tags with single prompt, {multi_prompts} tags with multiple prompts')

if __name__ == '__main__':
    main()
"

echo "🎯 Tag mapping complete!"
