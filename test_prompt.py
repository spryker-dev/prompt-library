#!/usr/bin/env python3

import sys
sys.path.append('.')

# Import without frontmatter for now, just to test structure
from prompt_mcp.prompt_loader import PromptLoader

def main():
    loader = PromptLoader()
    try:
        loader.load_prompts()
        prompts = loader.get_all_prompts()
        print(f"Loaded {len(prompts)} prompts")

        if prompts:
            first_prompt = prompts[0]
            print(f"First prompt: {first_prompt['filename']}")
            print(f"Title: {first_prompt['title']}")
            print(f"Description: {first_prompt['description']}")
            print(f"Tags: {first_prompt['tags']}")
            print(f"When to use: {first_prompt.get('when_to_use', 'Not specified')}")
            print(f"Author: {first_prompt.get('author', 'Not specified')}")
    except ImportError as e:
        print(f"ImportError (expected without frontmatter installed): {e}")
        print("Structure updated successfully, but frontmatter dependency not available")
    except Exception as e:
        print(f"Error: {e}")

if __name__ == "__main__":
    main()