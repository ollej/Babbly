from fabric.api import *
from fabric.contrib.console import confirm

deploy_dir='/home/jxdevelopment/public_html/scripts/babbly'
repo_dir='/home/jxdevelopment/repos/Babbly'

def update():
    # update to latest code from repo
    local('git pull') 

def test():
    #local('./manage.py test my_app', capture=True)
    # run jasmine tests
    pass

def compile():
    # Minimize javascript using google closure.
    local("java -jar ~/bin/compiler.jar --js src/compat.js --js src/wString.js --js src/UnicodeMapper.js --js src/Babbly.js --js_output_file /tmp/Babbly.min.js")

def pack():
    # Create a release package.
    local('tar czf /tmp/babbly_latest.tgz LICENSE src/Babbly.user.js src/Babbly.js /tmp/Babbly.min.js data/charmap-en-v1.js 2>/dev/null')

def prepare_deploy():
    test()
    compile()
    pack()

def deploy_remote():
    with cd(deploy_dir):
        run('tar xzf /tmp/babbly_latest.tgz --strip-components=1')

def deploy():
    with lcd(deploy_dir):
        local('tar xzf /tmp/babbly_latest.tgz --strip-components=1')
    # tweet about release
    # upload tar ball to github
