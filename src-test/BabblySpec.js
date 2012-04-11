describe('Babbly', function () {
    var result, notImpl = new Error('Test not implemented!');

    it('can initialize', function () {
        spyOn(window, 'setTimeout');
        Babbly.init();
        expect(window.setTimeout).toHaveBeenCalled();
    });

    it('can set xpaths', function () {
        this.fail(notImpl);
    });

    it('can set update interval', function () {
        this.fail(notImpl);
    });

    it('can set encode marker', function () {
        this.fail(notImpl);
    });

    it('can add button', function () {
        spyOn($.prototype, 'before');
        Babbly.addBabblyButton();
        expect($.prototype.before).toHaveBeenCalled();
    });

    it('can decode tweets', function () {
        this.fail(notImpl);
    });

    it('can babble', function () {
        this.fail(notImpl);
    });

});
