import math

WORDS_PER_MINUTE = 200

def reading_time_calculator(content: str) -> int:
    words = len(content.split())
    return max(1, math.ceil(words / WORDS_PER_MINUTE))