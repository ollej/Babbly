#!/usr/bin/python
# vim: set fileencoding=utf8 :

"""
The MIT License

Copyright (c) 2012 Olle Johansson

Permission is hereby granted, free of charge, to any person obtaining a copy
of this software and associated documentation files (the "Software"), to deal
in the Software without restriction, including without limitation the rights
to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
copies of the Software, and to permit persons to whom the Software is
furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in
all copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN
THE SOFTWARE.
"""

# TODO: Needs to check that no duplicate uses of characters are in file.
# TODO: Check for duplicates of words.
# TODO: Add maps for: common numbers, emoji characters
# TODO: automap function to autmatically map all words in list to characters
# TODO: add unit tests
# TODO: Keep backup of old charmap.
# TODO: Add function should probably automatically search
# TODO: Search function should probably ask to add if word isn't available.
# TODO: Change character for mapping
# TODO: Reverse search, go through characters and find words that might match
# TODO: CharMap could have a loop method that takes a function to be run on each loop.

import json
import cmd
import codecs
import random

charmap_file = '../data/charmap.json'

class CharMap(object):
    filename = '../data/charmap.json'
    map = dict()
    changed = dict()
    dirty = False

    def __init__(self, fname=None):
        if fname:
            self.filename = fname

    def save(self, fname=None):
        if not self.map:
            return False
        if not fname:
            if not self.dirty:
                return False
            fname = self.filename
        with codecs.open(fname, 'w', encoding='UTF-8') as f:
            json_data = json.dumps(self.map)
            f.write(json_data)
            f.close()
            self.set_clean()
            print(u"Character map written to: {0}".format(fname))
            return True

    def load(self, fname=None):
        if not fname:
            fname = self.filename
        with codecs.open(fname, encoding='UTF-8') as f:
            try:
                self.map = json.load(f)
                self.set_clean()
            except ValueError, ve:
                print("Failed loading '{0}', maybe not proper json?\nError: {1}".format(fname, ve))
                return
            f.close()

    def get_map(self, match=None):
        if not match:
            return self.map
        items = dict()
        umatch = match.upper()
        for char, word in self.map.items():
            if not match or (match == char or umatch in word):
                items[char] = word
        return items

    def get_items(self, match=None):
        items = self.get_map(match)
        return items.items()

    def set(self, char, word):
        self.dirty = True
        word = word.upper()
        self.map[char] = word
        self.changed[char] = word

    def get(self, char):
        return self.map[char]

    def remove(self, char):
        # TODO: Maybe keep track of deleted maps as well?
        del self.map[char]
        self.dirty = True

    def is_dirty(self):
        return self.dirty

    def set_clean(self):
        self.changed = dict()
        self.dirty = False

    def get_changed(self):
        return self.changed.items()

    def has_word(self, word):
        word = word.upper()
        if word in self.map.values():
            return True
        return False


class CommandLine(cmd.Cmd):
    prompt = u'> '
    intro = u"Character Chooser\nChoose best matching character for each word."
    chars = None
    words = None
    map = None

    def preloop(self):
        self.chars = self.read_chars('../data/charmap.dat')
        self.words = self.read_words('../data/commonwords.dat')
        self.read_map()

    def default(self, line):
        print(u"Type 'help' to get list of available commands.")

    def read_chars(self, fname):
        with codecs.open(fname, encoding='UTF-8') as f:
            chars = json.load(f)
            return chars

    def read_words(self, fname):
        words = []
        with codecs.open(fname, encoding='UTF-8') as f:
            word = None
            for word in f:
                if word.strip():
                    words.append(word.strip().lower())
        return words

    def read_map(self, fname=None):
        """Read map file and remove all used characters and words from lists."""
        self.map = CharMap(fname)
        self.map.load()
        for char, word in self.map.get_items():
            try:
                del self.chars[char]
            except KeyError, ke:
                pass
            try:
                self.words.remove(word.lower())
            except ValueError, ve:
                pass

    def get_chars(self, match=None):
        """
           Get dict of characters. 
           If argument is given, only chars with matching description is returned.
        """
        match = match.upper()
        chars = dict()
        for char, descr in self.chars.items():
            if not match or match in descr:
                chars[char] = descr
        return chars

    def map_char(self, char, word):
        """Maps char to word and removes char and word from lists."""
        try:
            descr = self.chars[char]
            self.map.set(char, word)
            del self.chars[char]
            self.words.remove(word.lower())
            return True
        except KeyError:
            return False

    def add_word(self, word):
        """Adds word to word list unless it already exists or is already mapped."""
        if not word or word in self.words:
            return False
        if self.map.has_word(word):
            return False
        self.words.append(word.lower())
        return True

    def get_selection(self, words):
        """Prints the contents of dict and prompts user to select by entering a number."""
        # TODO: If only one selection, automatically select it. Maybe.
        index = 0
        for char, descr in words.items():
            index = index + 1
            print(u"{0}:\t{1}\t{2}".format(index, char, descr))
        print(u"Nothing = no selection")
        num = raw_input(u"Select: ")
        try:
            num = int(num)
        except ValueError:
            num = 0
        if num > 0 and num <= len(words):
            char = words.keys()[num-1]
            return char
        return None

    def select_char(self, word):
        words = self.get_chars(word)
        if not words:
            print(u"No characters found for search: {0}".format(word))
            return None
        print(u"Characters matching search: {0}".format(word))
        char = self.get_selection(words)
        if char:
            print(u"Selected character: {0}".format(char))
            return char

    def find_char(self, word):
        print(u"Find character for word: {0}".format(word))
        search = word
        if len(word) < 4:
            search = u"LETTER {0}".format(word)
        char = self.select_char(search)
        while not char:
            if char is not None:
                print(u"No character selected for word: {0}".format(word))
            search = raw_input(u"Search: ")
            if search:
                char = self.select_char(search)
            else:
                return
        if self.map_char(char, word):
            print(u"Character '{0}' mapped to word '{1}'.".format(char, word))

    def do_add(self, line):
        """Add word to word list."""
        words = line.strip().split()
        for word in words:
            if self.add_word(word):
                print(u"Word '{0}' added to list.".format(word))
            else:
                print(u"Word '{0}' already mapped.".format(word))

    def do_search(self, line):
        """
        Search character for given words if found.
        Without argument all words in word list are looped.
        """
        search_words = line.strip().lower().split()
        if not line:
            search_words = self.words
        for word in search_words:
            if word and word in self.words:
                self.find_char(word)
            else:
                print(u"Word '{0}' not found in list.".format(line))

    def do_next(self, line):
        """Search for character in the next word in the list."""
        word = self.words[0]
        self.find_char(word)

    def do_words(self, line):
        """List all words in list."""
        print(u"Word list:")
        for word in self.words:
            print word,
        print

    def do_chars(self, line):
        """Print list of characters matching argument."""
        chars = self.get_chars(line)
        print(u"Characters:")
        for char, descr in chars.items():
            print(u"\t{0}\t= {1}".format(char, descr))

    def do_map(self, line):
        """Prints the current character map. Any argument is used to filter chars/words."""
        if line:
            print(u"Matching mappings:")
        else:
            print(u"Current map:")
        for char, word in self.map.get_items():
            if not line or (line == char or line.upper() in word):
                print(u"\t{0}\t= {1}".format(char, word))

    def do_remap(self, line):
        """List mappings matching argument and asks if they should be renamed."""
        maps = self.map.get_map(line)
        if not maps:
            print(u"No mappings matched '{0}'.".format(line))
            return
        char = self.get_selection(maps)
        if char:
            word = self.map.get(char)
            print(u"Renaming: {0}\t{1}".format(char, word))
            new_word = raw_input(u"New word: ")
            if new_word:
                self.map.set(char, new_word)
                print(u"Character '{0}' renamed to: '{1}'".format(char, new_word))

    def do_unmap(self, line):
        """List mappings matching argument and asks if they should be removed."""
        maps = self.map.get_map(line)
        if not maps:
            print(u"No mappings matched '{0}'.".format(line))
            return
        char = self.get_selection(maps)
        if char:
            self.map.remove(char)
            print(u"Removed character: {0}".format(char))

    def do_match(self, line):
        """Automatically map all words in list to random characters."""
        for word in self.words:
            if not self.chars:
                print(u"No remaining characters to match to.")
                return
            char = random.choice(self.chars.keys())
            if self.map_char(char, word):
                print(u"Mapped character '{0}' to word '{1}'".format(char, word))

    def do_load(self, line):
        """Replace map in memory with map from file. Argument will be used as filename."""
        self.read_map(line.strip())

    def do_save(self, line):
        """Saves the map in a file. Argument will be used as filename."""
        # TODO: Sanitize filename
        self.map.save(line.strip())

    def do_new(self, line):
        """Prints all new mappings that aren't saved."""
        for char, word in self.map.get_changed():
            print(u"\t{0}\t= {1}".format(char, word))

    def do_quit(self, line):
        """Quit the program and automatically saves charmap file."""
        print(u'Quitting...')
        self.map.save()
        return True

if __name__ == '__main__':
    CommandLine().cmdloop()


