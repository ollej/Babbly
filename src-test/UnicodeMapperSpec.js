describe('UnicodeMapper', function () {
    var str = '', map = {'!':'exclamation'};

    it('can translate a character into a word', function () {
        str = UnicodeMapper.translate('☃');
        expect(str).toEqual('snowman');
    });

    it('can clean a string', function () {
        str = UnicodeMapper.clean(' snowman   heart ');
        expect(str).toEqual('snowman heart');
    });

    it('can get the character for a word', function () {
        str = UnicodeMapper.getChar('snowman');
        expect(str).toEqual('☃');
    });

    it('can encode a string', function () {
        str = UnicodeMapper.encode('snowman heart');
        expect(str).toEqual('☃♥');
    });

    it('can decode a string', function () {
        str = UnicodeMapper.decode('☃♥');
        expect(str).toEqual('snowman heart');
    });

    it('can check if character is a punctuation', function () {
        str = UnicodeMapper.ispunct('!');
        expect(str).toEqual(true);
    });

    it('can set a map', function () {
        UnicodeMapper.setMap(map);
        expect(UnicodeMapper.getMap()).toEqual(map);
    });

    it('can get a map', function () {
        var newmap = UnicodeMapper.getMap();
        expect(newmap).toEqual(map);
    });

});
