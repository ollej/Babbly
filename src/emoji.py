#!/usr/bin/python
# vim: set fileencoding=utf8 :

import codecs
import re
import json

class EmojiMapper(object):
    filename = 'emoji.json'
    map = dict()
    re_descr = re.compile(
        r'<td class="name_anno">([^<]*)',
        re.IGNORECASE)
    re_char = re.compile(
        r'<span class="(?:unified|proposed_uni)">([^<]*)</span>', 
        re.IGNORECASE)

    def __init__(self, fname=None):
        if fname:
            self.filename = fname

    def get_descr(self, line):
        match = self.re_descr.search(line)
        if match:
            return match.group(1)

    def get_char(self, line):
        match = self.re_char.search(line)
        if match:
            char = match.group(1)
            if char.startswith('U+'):
                charcode = int(char[2:], 16)
                try:
                    char = unichr(charcode).encode('utf8')
                except ValueError:
                    print(u"Couldn't parse character: '{0}'".format(char))
                    return None
            return char

    def read_emoji(self, fname=None):
        if not fname:
            fname = self.filename
        with codecs.open(fname, encoding='UTF-8') as f:
            for line in f:
                #print(u"Searching line: {0}".format(line))
                descr = self.get_descr(line)
                char = self.get_char(line)
                #print(u"Char: '{0}' = '{1}'".format(char, descr))
                if char:
                    if len(char) == 1:
                        if not self.map.has_key(char):
                            self.map[char] = descr
                    else:
                        print(u"Character too long for: {0}".format(descr))

    def save(self, fname):
        if not fname:
            fname = self.filename
        with codecs.open(fname, 'w', encoding='UTF-8') as f:
            json_data = json.dumps(self.map)
            f.write(json_data)
            f.close()

    def load(self, fname=None):
        if not fname:
            fname = self.filename
        with codecs.open(fname, encoding='UTF-8') as f:
            try:
                self.map = json.load(f)
            except ValueError, ve:
                print("Failed loading '{0}', maybe not proper json?\nError: {1}".format(fname, ve))
                return
            f.close()

if __name__ == '__main__':
    EM = EmojiMapper()
    #EM.load('charmap.dat')
    EM.read_emoji('emoji.dat')
    EM.save('emoji.json')


