# Comprehensive Git Diff review

## Prompt Title
A prompt that provides detailed instruction on how to perform a code review by a provided git diff.

## Prompt Description
This prompt will check a git diff against Spryker Guidelines and provides a detailed review information that can be used to further validate the changes made

## Tags (comma-separated)
review, architecture

## When to Use
This prompt should be used when a review on a changeset must be performed

## Prompt
```text
Do a comprehensive review of the diff that gets attached as argument. Take the content of the following files into account:

- ./prompts/context/spryker-architecture-guide-api.md
- ./prompts/context/spryker-architecture-guide-coding.md
- ./prompts/context/spryker-architecture-guide-major.md

When the user hasn't provided a diff kindly ask him to paste the diff.

Ask the user if he can provide a ticket text to validate against. If user provides a ticket text:
- Validate if the requirements in the ticket are met
- Validate if the acceptance criteria in the ticket are met
- Validate if the non-functional requirements in the ticket are met

Provide a short explanation of what the code changes are about.
Give the change set a rating between 0 and 10 where ten is a perfect match on the guidelines and the ticket description.

When needed, provide a list of possible improvements ideally with cites to the guideline or other sources.

When there is something unclear ask the user for his input.

```

## Example Output
> "**Summary**: The change provides a feature for importing a new entity into the system."
> "The provided diff matches the requirements, non-functional requirements, and acceptance criteria and has a rating of 7/10."
> "**Possible improvements**: - Performance; while not mentioned in the ticket the foreach loop does a database call which is a performance issue."

## LLM
Claude 3.7 Sonnet, Gemini 2.5 Pro

## AI Assistant
GitHub Copilot

## Author
René Klatt
