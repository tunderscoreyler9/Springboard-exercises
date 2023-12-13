"""Word Finder: finds random words from a dictionary."""

import random


class WordFinder:
    """Class used for finding random words from a file
    
    >>> wf = WordFinder("words.txt")
    235886 words read
    
    """
    
    def __init__(self, path):
        dict_file = open(path)
        
        self.words = self.parse(dict_file)
        print(f"{len(self.words)} words read")
        
    def parse(self, dict_file):
        """Parse the text_file into a list of words"""
        return [word.strip() for word in dict_file]
        
    def random(self):
        """Return a random word"""
        return random.choice(self.words)

class SpecialWordFinder(WordFinder):
    """A special word finer class that parses all words save comments and blank lines.
    
    >>> swf = SpecialWordFinder("specials.txt")
    6 words read
    
    >>> swf.random() in ['call', 'sara', 'joe', 'School', 'Springboard', 'antapoplectic']
    True
    
    """
    
    def parse(self, dict_file):
        return [word.strip() for word in dict_file if word.strip() and not word.startswith("#")]