CS1999: Buggy Race Editor
=========================

> This is the "buggy editor" component of the Foundation Year Computer Science
> project at RHUL.

![image info](./static/images/cat.jpg)

[Race server](http://rhul.buggyrace.net)

[Technical & project information](https://rhul-cs-projects.github.io/CS1999-buggy-race-server/)

[CS1999 Tech Notes](https://rhul-cs-projects.github.io/CS1999-buggy-race-server/).


### Extra detail: setting `FLASK_ENV`

It's best if you run in Flask's _development environment_. To do that, set the 
Set the environment variable before you run `appy.py` to `development`. Once
you've done this, it's good for the rest of the session.

On Windows cmd/Powershell do:

    $env:FLASK_ENV = 'development'

On Linux or Mac:

    export FLASK_ENV=development

When you get to task [3-ENV](https://rhul-cs-projects.github.io/CS1999-buggy-race-server/project/tasks/#task-3-env)
you'll investigate other ways of doing this.


---

*RHUL CS1999... that's a course number, not a year* ;-)

