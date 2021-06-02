def isNotEven(num):
    if int(num) % 2 == 0:
        return False
    else:
        return True


def process(form):

    valid = True

    msg = "Form data is invalid and can't be accepted. "

    for field in form:
        if len(form[field]) > 100:
            return False, msg
    
    # ? game rules

    # ? Wheels must be > 4 
    if int(form['qty_wheels']) < 4:
        valid = False
        msg += '\nInvalid amount of wheels.'

    # ? Wheels must be even
    if isNotEven(form['qty_wheels']):
        valid = False
        msg += '\nInvalid amount of wheels.'

    # ? tyre must be >= No. wheels
    if int(form['qty_wheels']) >= int(form['qty_tyres']):
        valid = False
        msg += '\nToo few tyres.'
    
    # ? flag color must not be the same as each other
    if (form['flag_color'] == form['flag_color_secondary']) and form['flag_pattern'] != 'plain':
        valid = False
        msg += '\nFlag Colours match which is not allowed unless pattern is plain.'
    
    # ? algo must not be buggy
    if form['algo'] == 'buggy':
        valid = False
        msg += '\nInvalid A.I type.'

    #? check length of all fields
    for element in form:
        if len(form[element]) > 20:
            valid = False
            msg += '\nOne of the form fields had too much data in it'
            break
    
    return valid, msg
