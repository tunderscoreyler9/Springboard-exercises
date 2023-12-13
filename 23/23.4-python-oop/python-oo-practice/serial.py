"""Python serial number generator."""

class SerialGenerator:
    """Machine to create unique incrementing serial numbers.
    
    >>> serial = SerialGenerator(start=100)

    >>> serial.generate()
    100

    >>> serial.generate()
    101

    >>> serial.generate()
    102

    >>> serial.reset()

    >>> serial.generate()
    100
    """
    
    def __init__(self, start = 0):
        """Make a new serial generator that starts at 'start'"""
        
        self.start = self.next = start
    
    def __repr__(self):
        """Show a user the representation"""
        
        return f"<SerialGenerator start={self.start} next={self.next}>"
    
    def generate(self):
        """return next number/serial"""
        
        self.next += 1
        return self.next - 1
    
    def reset(self):
        """Reset the generator back to the 'start' serial"""
        
        self.next = self.start